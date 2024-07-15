<template>
  <v-chart class="chart" :option="line" autoresize></v-chart>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { defineComponent } from "vue";

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, GridComponent]);

export default defineComponent({
  Name: "LineChart",
  components: { VChart },
  props: ["data", "count"],
  computed: {
    line() {
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          text: `${this.count} Alerts`,
          top: "top",
        },
        grid: {
          left: 5,
          top: 40,
          right: 5,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: "time",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Alerts over time",
            type: "line",
            step: "end",
            symbol: "none",
            areaStyle: {},
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
