<template>
  <v-chart class="chart" :option="pie" autoresize></v-chart>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { defineComponent } from "vue";

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

export default defineComponent({
  Name: "PieChart",
  components: { VChart },
  props: ["data", "colorPalette"],
  computed: {
    pie() {
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          bottom: 0,
        },
        series: [
          {
            name: "Users connections",
            type: "pie",
            radius: "55%",
            color: this.colorPalette,
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    },
  },
});
</script>

<style scoped></style>
