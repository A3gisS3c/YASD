<template>
  <div class="mt-5">
    <v-btn icon="mdi-arrow-left" to="/group/servers"></v-btn>
    <v-chip class="ml-3 serverName" variant="text" size="large">{{
      this.agentName
    }}</v-chip>
  </div>

  <v-card class="mx-auto" variant="text">
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col cols="2" class="text-center">
            <v-chip variant="text">{{ $t("custom.critical") }}</v-chip>
            <v-chip
              color="red"
              dark
              variant="text"
              class="severity-chip"
              @click="addFilter('Critical')"
            >
              {{ this.getCriticalCount }}
            </v-chip>
          </v-col>
          <v-col cols="2" class="text-center">
            <v-chip variant="text">{{ $t("custom.high") }}</v-chip>
            <v-chip
              color="orange-darken-2"
              dark
              variant="text"
              class="severity-chip"
              @click="addFilter('High')"
            >
              {{ this.getHighCount }}
            </v-chip>
          </v-col>
          <v-col cols="2" class="text-center">
            <v-chip variant="text">{{ $t("custom.medium") }}</v-chip>
            <v-chip
              color="yellow-darken-2"
              dark
              variant="text"
              class="severity-chip"
              @click="addFilter('Medium')"
            >
              {{ this.getMediumCount }}
            </v-chip>
          </v-col>
          <v-col cols="2" class="text-center">
            <v-chip variant="text">{{ $t("custom.low") }}</v-chip>
            <v-chip
              color="blue"
              dark
              variant="text"
              class="severity-chip"
              @click="addFilter('Low')"
            >
              {{ this.getLowCount }}
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>

  <v-container class="ma-0" fluid>
    <v-row>
      <h3 class="font-weight-medium">
        {{ $t("custom.vulnerabilities") + " (" + this.vulnerabilities.length + ")" }}
      </h3>
      <v-chip
        v-if="this.activeSeverity.length"
        closable
        v-for="severity in activeSeverity"
        :key="severity"
        @click:close="removeFilter(severity)"
        class="ml-2"
      >
        {{ severity }}
      </v-chip>
    </v-row>
  </v-container>

  <v-text-field
    v-model="search"
    append-icon="mdi-magnify"
    :label="$t('custom.searchVulnerability')"
    single-line
    hide-details
    clearable
    density="compact"
  >
  </v-text-field>
  <v-data-table
    :group-by="groupBy"
    :expanded.sync="expanded"
    :headers="headers"
    :items="this.filteredSeverity"
    :sort-by="sortBy"
    height="600"
    density="compact"
    items-per-page="25"
    hover
    :search="search"
  >
    <template v-slot:item.vulnerability.reference="{ item }">
      <div
        v-for="(linkRef, index) in splitReferences(item.vulnerability.reference)"
        :key="index"
      >
        <v-btn
          :href="linkRef"
          target="_blank"
          variant="text"
          density="compact"
          class="text-lowercase font-weight-regular"
          color="blue-darken-2"
        >
          {{ linkRef }}
        </v-btn>
      </div>
      <!--<div v-if="isDebian">
            <v-btn 
            :href="`https://security-tracker.debian.org/tracker/${item.cve}`"
            target="_blank"
            variant="text"
            density="compact"
            class="text-lowercase font-weight-regular"
            color="blue-darken-2"
            > 
            {{ `https://security-tracker.debian.org/tracker/${item.cve}` }}
            </v-btn> 
        </div>-->
    </template>
    <template v-slot:item.vulnerability.severity="{ item }">
      <v-chip
        variant="text"
        :color="getColor(item.vulnerability.severity)"
        class="font-weight-medium"
      >
        {{ item.vulnerability.severity }}
      </v-chip>
    </template>
    <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
      <tr>
        <td :colspan="columns.length">
          <VBtn
            size="small"
            variant="text"
            :icon="isGroupOpen(item) ? '$expand' : '$next'"
            @click="toggleGroup(item)"
          ></VBtn>
          {{ item.value + " (" + item.items.length + ")" }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { useIndexerStore } from "@/stores/WazuhIndexerStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t } = useI18n();
    const indexerStore = useIndexerStore();
    const headers = computed(() => [
      { title: "package", align: "start", sortable: false, key: "package.name" },
      {
        title: t("custom.version"),
        align: "start",
        sortable: false,
        key: "package.version",
        width: "15%"
      },
      { title: "CVE", align: "start", sortable: false, key: "vulnerability.id" },
      {
        title: t("custom.description"),
        align: "start",
        sortable: false,
        key: "vulnerability.description",
        width: "15%"
      },
      {
        title: t("custom.severity"),
        align: "start",
        sortable: false,
        key: "vulnerability.severity",
      },
      {
        title: "CVSS3",
        align: "start",
        sortable: false,
        key: "vulnerability.score.base",
      },
      {
        title: "References",
        align: "start",
        sortable: false,
        key: "vulnerability.reference",
      },
    ]);

    return { indexerStore, headers };
  },
  data() {
    return {
      groupBy: [{ key: "package.name", order: "asc" }],
      sortBy: [{ key: "vulnerability.score.base", order: "desc" }],
      expanded: [],
      search: "",
      activeSeverity: [],
      agentName: "",
      isDebian: false,
      vulnerabilities: [],
    };
  },
  async mounted() {
    this.vulnerabilities = this.indexerStore.vulnerabilities.filter(
      (vuln) => vuln.agent.id === this.$route.params.id
    );
    this.agentName = this.vulnerabilities[0]?.agent.name;
  },
  methods: {
    splitReferences(reference) {
      return reference.split(", ");
    },
    getColor(severity) {
      if (severity === "Critical") {
        return "red";
      } else if (severity === "High") {
        return "orange-darken-2";
      } else if (severity === "Medium") {
        return "yellow-darken-2";
      } else if (severity === "Low") {
        return "blue";
      } else {
        return "black";
      }
    },
    addFilter(severity) {
      if (!this.activeSeverity.includes(severity)) {
        this.activeSeverity.push(severity);
      }
    },
    removeFilter(severity) {
      this.activeSeverity = this.activeSeverity.filter((e) => e !== severity);
    },
    resetFilter() {
      this.activeSeverity = [];
    },
  },
  computed: {
    filteredSeverity() {
      if (!this.activeSeverity.length) return this.vulnerabilities;
      return this.vulnerabilities.filter((item) => {
        if (this.activeSeverity.includes(item.vulnerability.severity)) {
          return true;
        }
      });
    },
    getCriticalCount() {
      return this.vulnerabilities.filter(
        (vuln) => vuln.vulnerability.severity === "Critical"
      ).length;
    },
    getHighCount() {
      return this.vulnerabilities.filter((vuln) => vuln.vulnerability.severity === "High")
        .length;
    },
    getMediumCount() {
      return this.vulnerabilities.filter(
        (vuln) => vuln.vulnerability.severity === "Medium"
      ).length;
    },
    getLowCount() {
      return this.vulnerabilities.filter((vuln) => vuln.vulnerability.severity === "Low")
        .length;
    },
  },
};
</script>

<style scoped>
.severity-chip {
  font-size: 30px;
}
.serverName {
  font-size: 1.25rem;
}
</style>
