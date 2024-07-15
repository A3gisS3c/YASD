<template>
  <v-container class="ma-0" fluid>
    <v-row>
      <v-col>
        <h1>{{ $t("custom.agentsCompliance") }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="agent in this.apiStore.agents" :key="agent.id" md="3" xl="3">
        <v-card class="bg-scaCard" max-width="500" :loading="this.apiStore.loading">
          <v-card-title class="pb-0">
            {{ agent.name }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text
            v-for="policy in this.apiStore.scaSummary[agent.id]"
            :key="this.apiStore.scaSummary[agent.id].policy_id"
          >
            <div>
              <v-chip variant="text" class="pl-0">{{ policy.name }}</v-chip>
            </div>
            <div>
              <v-chip variant="text" class="pl-0">
                <span style="font-size: 17px">{{
                  calculateScore(policy.pass, policy.fail)
                }}</span>
              </v-chip>
            </div>
            <BarChart
              :dataPass="policy.pass"
              :dataFail="policy.fail"
              :dataInvalid="policy.invalid"
              @click="getSCA(agent.id, policy.policy_id)"
              :theme="this.theme.global.name.value"
            >
            </BarChart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useApiStore } from "@/stores/WazuhAPIStore";
import { useIndexerStore } from "@/stores/WazuhIndexerStore.js";
import BarChart from "@/components/charts/Barchart.vue";
import { useTheme } from "vuetify/lib/framework.mjs";

export default {
  setup() {
    const apiStore = useApiStore();
    const indexerStore = useIndexerStore();
    const theme = useTheme();
    return { apiStore, indexerStore, theme };
  },
  components: { BarChart },
  methods: {
    getSCA(agentID, policyID) {
      this.$router.push({ name: "policy", params: { id: agentID, policy_id: policyID } });
    },
    calculateScore(pass, fail) {
      const total = pass + fail;
      if (total === 0) {
        return "N/A";
      }
      const score = (pass / total) * 100;
      return score.toFixed(2) + "%";
    },
  },
};
</script>

<style scoped></style>
