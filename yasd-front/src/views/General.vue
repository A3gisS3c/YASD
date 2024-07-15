<template>
  <v-container class="ma-0" fluid>
    <v-row>
      <v-col cols="5">
        <DonutChart
          :data="this.indexerStore.getTopAlertsDonnutArray"
          :colorPalette="this.colorPalette"
          :theme="this.theme.global.name.value"
        ></DonutChart>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1>{{ $t("custom.lastCriticalAlerts") }}</h1>
      </v-col>
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
        <v-data-table-virtual
          v-model:expanded="expanded"
          :headers="headers"
          :items="this.indexerStore.getFilteredAlerts"
          height="600"
          item-value="id"
          density="compact"
          :expand-on-click="true"
          :show-expand="true"
          hover
          :loading="this.indexerStore.loading"
          :search="search"
        >
          <template v-slot:item.timestamp="{ item }">
            {{ formattedDate(item.timestamp) }}
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="pa-5">
                {{ item.full_log ?? item.data?.win?.system?.message ?? "no data" }}
              </td>
            </tr>
          </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed } from "vue";
import { useIndexerStore } from "@/stores/WazuhIndexerStore.js";
import { useI18n } from "vue-i18n";
import { parseISO, format } from "date-fns";
import DonutChart from "@/components/charts/DonutChart.vue";
import { useTheme } from "vuetify/lib/framework.mjs";

export default {
  setup() {
    const indexerStore = useIndexerStore();
    const theme = useTheme();
    const { t } = useI18n();
    const headers = computed(() => [
      { title: "", align: "start", sortable: false, key: "data-table-expand" },
      {
        title: t("custom.timestamp"),
        align: "start",
        sortable: false,
        key: "timestamp",
        width: "15%",
      },
      {
        title: t("custom.agent"),
        align: "start",
        sortable: false,
        key: "agent.name",
        width: "10%",
      },
      {
        title: t("custom.ruleDescription"),
        align: "start",
        sortable: false,
        key: "rule.description",
      },
      { title: t("custom.level"), align: "start", sortable: true, key: "rule.level" },
    ]);

    return { indexerStore, theme, headers, t };
  },
  async mounted() {
    await this.indexerStore.fetchDatas("rule.level: [12 TO 20]");
  },
  data() {
    return {
      search: "",
      expanded: [],
      colorPalette: ["#0D47A1", "#00BCD4", "#E91E63", "#4CAF50", "#009688"], // blue-darken-4 cyan pink green teal
    };
  },
  components: { DonutChart },
  methods: {
    formattedDate(timestamp) {
      return format(parseISO(timestamp), "yyyy-MM-dd - HH:mm:ss");
    },
  },
};
</script>

<style scoped>
DonutChart {
  height: 250px;
  width: 100%;
}
</style>
