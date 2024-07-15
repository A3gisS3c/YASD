<template>
  <v-chart class="chart" :option="bar" autoresize></v-chart>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { TooltipComponent, TitleComponent } from "echarts/components";
import VChart from "vue-echarts";
import { defineComponent } from "vue";

use([CanvasRenderer, BarChart, TooltipComponent, TitleComponent]);

export default defineComponent({
  Name: "BarChart",
  components: { VChart },
  props: ["dataPass", "dataFail", "dataInvalid"],
  computed: {
    bar() {
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          containLabel: false,
        },
        xAxis: {
          type: "value",
          show: false,
        },
        yAxis: {
          type: "category",
          data: [""],
          show: false,
        },
        series: [
          {
            name: "Pass",
            type: "bar",
            stack: "total",
            emphasis: {
              focus: "series",
            },
            data: [this.dataPass],
            color: "#26b99a",
          },
          {
            name: "Fail",
            type: "bar",
            stack: "total",
            emphasis: {
              focus: "series",
            },
            data: [this.dataFail],
            color: "#E74c3c",
          },
          {
            name: "Invalid",
            type: "bar",
            stack: "total",
            emphasis: {
              focus: "series",
            },
            data: [this.dataInvalid],
            color: "#bdc3c7",
          },
        ],
      };
    },
  },
});
</script>

<style scoped>
.chart {
  height: 30px;
  width: 100%;
}
</style>
