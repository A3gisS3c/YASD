<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <PieChart
          :data="this.indexerStore.getUsersConnectionsPieArray"
          :theme="this.theme.global.name.value"
        ></PieChart>
      </v-col>
      <v-col cols="8">
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
          :items="this.indexerStore.getUsersConnectionsArray"
          height="500"
          item-value="id"
          density="compact"
          hover
          items-per-page="25"
          :loading="this.indexerStore.loading"
          :search="search"
          @click:row="getSession"
        >
          <template v-slot:item.timestamp="{ item }">
            {{ formattedDate(item.timestamp) }}
          </template>
          <template v-slot:item.agent.name="{ item }">
            <v-icon>
              {{
                item.decoder.name == "sshd" ? "mdi-penguin" : "mdi-microsoft-windows"
              }}</v-icon
            >
            {{ item.agent.name }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" width="auto" transition="dialog-top-transition">
    <v-card color="grey-darken-3" height="800" width="800">
      <v-card-title class="text-center"> Commands played during session </v-card-title>
      <v-card-text>
        <span>/bin/bash</span>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useIndexerStore } from "@/stores/WazuhIndexerStore.js";
import { useApiStore } from "@/stores/WazuhAPIStore";
import PieChart from "@/components/charts/PieChart.vue";
import { parseISO, format } from "date-fns";
import { useTheme } from "vuetify/lib/framework.mjs";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const indexerStore = useIndexerStore();
    const apiStore = useApiStore();
    const theme = useTheme();
    const { t } = useI18n();
    const headers = computed(() => [
      { title: t("custom.timestamp"), align: "start", sortable: false, key: "timestamp" },
      { title: t("custom.server"), align: "start", sortable: false, key: "agent.name" },
      { title: t("custom.user"), align: "start", sortable: false, key: "data.dstuser" },
      { title: "IP", align: "start", sortable: false, key: "data.srcip" },
      { title: t("custom.origin"), align: "start", sortable: false, key: "decoder.name" },
    ]);

    return { indexerStore, apiStore, theme, headers };
  },
  components: { PieChart },
  data() {
    return {
      dialog: false,
      search: "",
    };
  },
  methods: {
    formattedDate(timestamp) {
      return format(parseISO(timestamp), "yyyy-MM-dd - HH:mm:ss");
    },
    getSession() {
      this.dialog = true;
    },
  },
};
</script>
