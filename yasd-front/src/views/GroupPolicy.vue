<template>
  <div class="mt-5">
    <v-btn icon="mdi-arrow-left" to="/group/sca"></v-btn>
    <v-chip class="ml-5" size="large" variant="text">{{ policy_id }}</v-chip>
  </div>
  <v-container class="ma-0" fluid>
    <v-row>
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
      <v-data-table
        :headers="headers"
        :items="this.apiStore.sca"
        height="500"
        item-value="id"
        density="compact"
        hover
        items-per-page="25"
        :expand-on-click="true"
        :show-expand="true"
        :search="search"
      >
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="pa-5">
              <b>Rationale</b>
              <br />
              {{ item.rationale }}
              <br />
              <br />
              <b>Remediation</b>
              <br />
              {{ item.remediation }}
              <br />
              <br />
              <b>Description</b>
              <br />
              {{ item.description }}
              <br />
              <br />
              <b>Checks</b>
              <br />
            </td>
          </tr>
        </template>
        <template v-slot:item.result="{ item }">
          <v-icon size="x-large" :color="item.result === 'failed' ? 'red' : 'green'"
            >mdi-circle-small</v-icon
          >
          {{ item.result }}
        </template>
      </v-data-table>
    </v-row>
  </v-container>
</template>

<script>
import { useApiStore } from "@/stores/WazuhAPIStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const apiStore = useApiStore();
    const { t } = useI18n();
    const headers = computed(() => [
      { title: "", align: "start", sortable: false, key: "data-table-expand" },
      { title: t("custom.title"), align: "start", sortable: false, key: "title" },
      { title: t("custom.target"), align: "start", sortable: false, key: "command" },
      { title: t("custom.result"), align: "start", sortable: false, key: "result" },
    ]);
    return { apiStore, headers };
  },
  async mounted() {
    await this.apiStore.updateSCAByAgent(this.id, this.policy_id);
  },
  data() {
    return {
      search: "",
    };
  },
  props: {
    policy_id: {
      type: String,
      required: true,
    },
    id: {
      // Agent id
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
