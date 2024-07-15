<template>
  <v-chart class="chart" :option="donut" autoresize></v-chart>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

use([
  CanvasRenderer,
  PieChart,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  GridComponent,
]);

export default defineComponent({
  Name: "DonutChart",
  components: { VChart },
  props: ["data", "colorPalette"],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: {
    donut() {
      return {
        backgroundColor: "transparent",
        title: {
          text: this.t("custom.top5Alerts"),
        },
        grid: {
          left: 5,
          top: 0,
          right: 5,
          bottom: 0,
        },
        legend: {
          orient: "vertical",
          left: "left",
          top: "bottom",
          formatter: function (name) {
            const maxLength = 50;
            if (name.length > maxLength) {
              return name.substring(0, maxLength) + "...";
            } else {
              return name;
            }
          },
        },
        series: [
          {
            name: "Top alerts",
            type: "pie",
            radius: ["60%", "90%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
              formatter: "{d}%",
            },
            center: ["80%", "50%"],
            emphasis: {
              label: {
                show: true,
                fontSize: 30,
                fontweight: "bold",
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            labelLine: {
              show: false,
            },
            color: this.colorPalette,
            data: this.data,
          },
        ],
      };
    },
  },
});
</script>

<style scoped>
.chart {
  height: 250px;
  width: 100%;
}
</style>
