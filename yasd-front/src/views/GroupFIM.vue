<template>
  <v-container class="ma-0" fluid>
    <v-row>
      <v-chip-group color="blue" :filter="true" v-model="filterFIM" mandatory="true">
        <v-chip label>
          {{ $t("custom.all") }}
        </v-chip>
        <v-chip label>
          {{ $t("custom.user") }}
        </v-chip>
        <v-chip label>
          {{ $t("custom.system") }}
        </v-chip>
      </v-chip-group>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('custom.search')"
          single-line
          hide-details
          clearable
          density="compact"
        >
        </v-text-field>
        <v-data-table
          :headers="headers"
          :items="this.filteredItems"
          height="600"
          density="compact"
          hover
          items-per-page="25"
          :search="search"
          :expand-on-click="true"
          :show-expand="true"
          :loading="this.indexerStore.loading"
        >
          <template v-slot:item.timestamp="{ item }">
            {{ formattedDate(item.timestamp) }}
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="pa-5">
                <v-card v-if="item.syscheck?.diff">
                  <v-card-title class="text--red"> Diff </v-card-title>
                  <v-card-text style="white-space: pre-line">
                    {{ item.syscheck?.diff }}
                  </v-card-text>
                </v-card>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useIndexerStore } from "@/stores/WazuhIndexerStore";
import { parseISO, format } from "date-fns";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  data() {
    return {
      search: "",
      filterFIM: 1,
    };
  },
  setup() {
    const indexerStore = useIndexerStore();
    const { t } = useI18n();
    const headers = computed(() => [
      { title: "", align: "start", sortable: false, key: "data-table-expand" },
      {
        title: t("custom.timestamp"),
        align: "start",
        sortable: false,
        key: "agent.name",
      },
      { title: t("custom.file"), align: "start", sortable: false, key: "syscheck.path" },
      {
        title: t("custom.effectiveUser"),
        align: "start",
        sortable: false,
        key: "syscheck.audit.effective_user.name",
      },
      {
        title: t("custom.loginUser"),
        align: "start",
        sortable: false,
        key: "syscheck.audit.login_user.name",
      },
      {
        title: t("custom.event"),
        align: "start",
        sortable: false,
        key: "syscheck.event",
      },
    ]);
    return { indexerStore, headers };
  },
  methods: {
    formattedDate(timestamp) {
      return format(parseISO(timestamp), "yyyy-MM-dd - HH:mm:ss");
    },
  },
  computed: {
    filteredItems() {
      if (this.filterFIM === 0) {
        return this.indexerStore.getAllFIM;
      } else if (this.filterFIM === 1) {
        return this.indexerStore.getLoginUserFIM;
      } else {
        return this.indexerStore.getSystemFIM;
      }
    },
  },
};
</script>
