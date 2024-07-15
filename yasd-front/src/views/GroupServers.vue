<template>
  <v-container class="ma-0" fluid>
    <v-row>
      <v-col v-for="agent in this.apiStore.agents" :key="agent.id" md="3" xl="3">
        <v-card class="bg-serverCard" max-width="400" :loading="this.apiStore.loading">
          <v-card-title class="pb-0">
            {{ agent.name }}
            <v-icon :color="agent.status === 'active' ? 'green' : 'red'"
              >mdi-circle-small</v-icon
            >
          </v-card-title>
          <v-card-subtitle class="pb-2">
            <div>
              {{
                agent.os.platform === "windows"
                  ? agent.os.name
                  : agent.os.name + " " + agent.os.version
              }}
              <v-icon
                :icon="
                  agent.os.platform === 'windows'
                    ? 'mdi-microsoft-windows'
                    : 'mdi-penguin'
                "
              ></v-icon>
            </div>
            <div>
              {{ agent.ip }}
            </div>
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex">
              <span class="flex-grow-1">{{ $t("custom.uptime") }}</span>
              <v-chip
                variant="text"
                class="font-weight-medium"
                density="compact"
                :color="getUptime(agent.id) > 90 ? 'red ' : 'green'"
              >
                {{ getUptime(agent.id) }}
              </v-chip>
            </div>
            <div class="d-flex">
              <span class="flex-grow-1">{{ $t("custom.rootPasswordAge") }}</span>
              <v-chip
                variant="text"
                class="font-weight-medium"
                density="compact"
                :color="getRootpasswordAge(agent.id) > 180 ? 'red' : 'green'"
              >
                {{ getRootpasswordAge(agent.id) }}
              </v-chip>
            </div>
            <div class="d-flex">
              <span class="flex-grow-1">{{ $t("custom.criticalVulnerabilities") }}</span>
              <v-chip
                variant="text"
                class="font-weight-medium"
                density="compact"
                :color="getCriticals(agent.id) > 0 ? 'red' : 'green'"
              >
                {{ getCriticals(agent.id) }}
              </v-chip>
            </div>
          </v-card-text>
          <v-card-actions justify-center>
            <v-btn
              flat
              class="text-custom1 text-lowercase"
              prepend-icon="mdi-magnify"
              :to="{ name: 'vulnerabilities', params: { id: agent.id } }"
            >
              {{ $t("custom.vulnerabilities") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useApiStore } from "@/stores/WazuhAPIStore";
import { useIndexerStore } from "@/stores/WazuhIndexerStore.js";

export default {
  setup() {
    const apiStore = useApiStore();
    const indexerStore = useIndexerStore();

    return { apiStore, indexerStore };
  },
  methods: {
    getUptime(agentID) {
      
      for (const alert of this.indexerStore.getUptimeAlerts) {
        if (alert.agent.id === agentID) {
          return alert?.data?.machine?.uptime ?? 0;
        }
      }
      return "N/A";
    },
    getRootpasswordAge(agentID) {
      for (const alert of this.indexerStore.getRootPasswordAlerts) {
        if (alert.agent.id === agentID) {
          return alert?.data?.password?.age ?? 0;
        }
      }
      return "N/A";
    },
    getCriticals(agentID) {
      for (const agent of this.indexerStore.criticalsVulnsSummary) {
        if (agent.id === agentID) {
          return agent.criticals;
        }
      }

      return 0;
    },
  },
};
</script>

<style scoped></style>
