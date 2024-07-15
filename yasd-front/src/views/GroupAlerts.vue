<template>
  <v-container class="ma-0" fluid>
    <v-row>
      <v-col>
        <v-chip
          :color="this.indexerStore.getCriticalAlerts.length ? 'red' : 'green'"
          size="large"
        >
          <v-icon
            start
            :icon="this.indexerStore.getCriticalAlerts.length ? 'mdi-close' : 'mdi-check'"
          ></v-icon>
          {{
            this.indexerStore.getCriticalAlerts.length
              ? $t("custom.alerts12Plus") +
                " (" +
                this.indexerStore.getCriticalAlerts.length +
                ")"
              : $t("custom.noAlerts")
          }}
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <LineChart
          :data="this.indexerStore.getLineArrayByHour"
          :count="this.indexerStore.getFilteredAlerts.length"
          :theme="this.theme.global.name.value"
        ></LineChart>
      </v-col>
      <v-col cols="5">
        <DonutChart
          :data="this.indexerStore.getTopAlertsDonnutArray"
          :colorPalette="this.colorPalette"
          :theme="this.theme.global.name.value"
        ></DonutChart>
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
import { useIndexerStore } from "@/stores/WazuhIndexerStore.js";
import LineChart from "@/components/charts/LineChart.vue";
import DonutChart from "@/components/charts/DonutChart.vue";
import { parseISO, format } from "date-fns";
import { useTheme } from "vuetify/lib/framework.mjs";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

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
      {
        title: t("custom.level"),
        align: "start",
        sortable: true,
        key: "rule.level",
        width: "5%",
      },
    ]);

    return { indexerStore, theme, headers };
  },
  components: { LineChart, DonutChart },
  data() {
    return {
      expanded: [],
      search: "",
      colorPalette: ["#0D47A1", "#00BCD4", "#E91E63", "#4CAF50", "#009688"], // blue-darken-4 cyan pink green teal
    };
  },
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
