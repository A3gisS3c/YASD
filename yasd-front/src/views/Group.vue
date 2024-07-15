<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center pb-0">
        <v-menu height="400px">
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              rounded="xl"
              v-bind="props"
              size="x-large"
              class="text-h4"
            >
              {{ this.currentClient }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              rounded="xl"
              v-for="client in this.apiStore.clients"
              :key="client.name"
              @click="updateCurrentClient(client)"
            >
              <v-list-item-title v-text="client.name"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="12" class="text-center pt-0">
        {{ "(" + this.apiStore.agents.length + " agents)" }}
      </v-col>
    </v-row>
  </v-container>

  <div class="mt-5">
    <v-tabs v-model="tab">
      <v-tab
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :to="{ name: tab.value }"
      >
        {{ tab.label }}
      </v-tab>
    </v-tabs>
    <v-window>
      <router-view></router-view>
    </v-window>

    <v-snackbar v-model="snackbar" timeout="4000" color="success" location="top">
      {{ this.indexerStore.allAlerts.length + " " + $t("custom.alertsFetched") }}
    </v-snackbar>
  </div>
</template>

<script>
import { useApiStore } from "@/stores/WazuhAPIStore";
import { useIndexerStore } from "@/stores/WazuhIndexerStore.js";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

export default {
  setup() {
    const apiStore = useApiStore();
    const indexerStore = useIndexerStore();
    const { t } = useI18n();

    const tabs = computed(() => [
      { label: t("custom.alertTab"), value: "Alerts 6+" },
      { label: t("custom.usersTab"), value: "Users" },
      { label: t("custom.serversTab"), value: "Servers" },
      { label: t("custom.scaTab"), value: "SCA" },
      { label: t("custom.fimTab"), value: "FIM" },
    ]);

    return { apiStore, indexerStore, tabs };
  },
  async mounted() {
    await this.apiStore.updateClients();
    this.updateCurrentClient(this.apiStore.clients[0]);
  },
  data() {
    return {
      tab: "Alerts 6+",
      currentClient: "",
      snackbar: false,
      agentsDialog: false,
    };
  },
  methods: {
    async updateCurrentClient(client) {
      this.currentClient = client.name;
      this.$router.push("/group/alerts");

      await this.apiStore.updateAgentsByClient(client.name);

      const luceneQuery = this.apiStore.agents
        .map((agent) => `agent.name:${agent.name}`)
        .join(" OR ");
      await this.indexerStore.fetchDatas(luceneQuery);
      await this.indexerStore.fetchVulns(luceneQuery);

      this.snackbar = true;
    },
  },
};
</script>

<style>
.h1-style {
  font-size: 1.25rem;
}
</style>
