<template>
  <v-container class="ma-0" fluid>
    <v-row align="end">
      <v-col>
        <v-chip variant="text" class="font-weight-bold mt-5">{{
          $t("custom.computers")
        }}</v-chip>
        <v-divider thickness="3"></v-divider>
      </v-col>
      <v-col>
        <v-text-field
          v-model="searchComputer"
          append-icon="mdi-magnify"
          :label="$t('custom.search')"
          single-line
          hide-details
          clearable
          density="compact"
          class="mt-5"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="this.indexerStore.getComputersADAudit"
          item-value="id"
          density="compact"
          items-per-page="10"
          :search="searchComputer"
          v-model:expanded="expandedComputers"
          :expand-on-click="true"
          :show-expand="true"
          :loading="this.loading"
          hover
        >
          <template v-slot:item.timestamp="{ item }">
            {{ formattedDate(item.timestamp) }}
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="pa-5" style="white-space: pre-line">
                {{ item.data?.win?.system?.message ?? "no data" }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row align="end">
      <v-col>
        <v-chip variant="text" class="font-weight-bold mt-5">{{
          $t("custom.users")
        }}</v-chip>
        <v-divider thickness="3"></v-divider>
      </v-col>
      <v-col>
        <v-text-field
          v-model="searchUser"
          append-icon="mdi-magnify"
          :label="$t('custom.search')"
          single-line
          hide-details
          clearable
          density="compact"
          class="mt-5"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="this.indexerStore.getUsersADAudit"
          item-value="id"
          density="compact"
          items-per-page="10"
          :search="searchUser"
          v-model:expanded="expandedUsers"
          :expand-on-click="true"
          :show-expand="true"
          :loading="this.loading"
          hover
        >
          <template v-slot:item.timestamp="{ item }">
            {{ formattedDate(item.timestamp) }}
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="pa-5" style="white-space: pre-line">
                {{ item.data?.win?.system?.message ?? "no data" }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row align="end">
      <v-col>
        <v-chip variant="text" class="font-weight-bold mt-5">{{
          $t("custom.groups")
        }}</v-chip>
        <v-divider thickness="3"></v-divider>
      </v-col>
      <v-col>
        <v-text-field
          v-model="searchGroup"
          append-icon="mdi-magnify"
          :label="$t('custom.search')"
          single-line
          hide-details
          clearable
          density="compact"
          class="mt-5"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers2"
          :items="this.indexerStore.getGroupsADAudit"
          item-value="id"
          density="compact"
          items-per-page="10"
          :search="searchGroup"
          :loading="this.loading"
        >
          <template v-slot:item.timestamp="{ item }">
            {{ formattedDate(item.timestamp) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useIndexerStore } from "@/stores/WazuhIndexerStore.js";
import { useApiStore } from "@/stores/WazuhAPIStore";
import { parseISO, format } from "date-fns";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const indexerStore = useIndexerStore();
    const apiStore = useApiStore();
    const { t } = useI18n();
    const headers = computed(() => [
      { title: "", align: "start", sortable: false, key: "data-table-expand" },
      {
        title: t("custom.timestamp"),
        align: "start",
        sortable: false,
        key: "timestamp",
        width: "13%",
      },
      {
        title: t("custom.server"),
        align: "start",
        sortable: false,
        key: "agent.name",
        width: "10%",
      },
      {
        title: t("custom.description"),
        align: "start",
        sortable: false,
        key: "rule.description",
        width: "20%",
      },
      {
        title: t("custom.origin"),
        align: "start",
        sortable: false,
        key: "data.src",
        width: "20%",
      },
      { title: t("custom.target"), align: "start", sortable: false, key: "data.target" },
      {
        title: t("custom.event"),
        align: "start",
        sortable: false,
        key: "data.win.system.eventID",
      },
    ]);
    const headers2 = computed(() => [
      {
        title: t("custom.timestamp"),
        align: "start",
        sortable: false,
        key: "timestamp",
        width: "13%",
      },
      {
        title: t("custom.server"),
        align: "start",
        sortable: false,
        key: "agent.name",
        width: "10%",
      },
      {
        title: t("custom.description"),
        align: "start",
        sortable: false,
        key: "rule.description",
        width: "20%",
      },
      {
        title: t("custom.origin"),
        align: "start",
        sortable: false,
        key: "data.src",
        width: "20%",
      },
      {
        title: t("custom.targetGroup"),
        align: "start",
        sortable: false,
        key: "data.target",
      },
      {
        title: t("custom.member"),
        align: "start",
        sortable: false,
        key: "data.win.eventdata.memberName",
      },
    ]);

    return { indexerStore, apiStore, headers, headers2 };
  },
  async mounted() {
    this.loading = true;
    try {
      let adServers = this.$config.ad_servers;

      if (!adServers) {
        this.loading = false;
        return;
      }

      if (typeof adServers === "string") {
        adServers = [adServers];
      }

      const luceneQuery = adServers.map((agent) => `agent.name:${agent}`).join(" OR ");

      this.indexerStore.fetchDatas(luceneQuery);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.loading = false;
    }
  },
  data() {
    return {
      dialog: false,
      search: "",
      searchComputer: "",
      searchUser: "",
      searchGroup: "",
      expandedComputers: [],
      expandedUsers: [],
      loading: false,
    };
  },
  methods: {
    formattedDate(timestamp) {
      return format(parseISO(timestamp), "yyyy-MM-dd - HH:mm:ss");
    },
  },
};
</script>
