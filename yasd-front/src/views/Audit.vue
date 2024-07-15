<template>
  <div>
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
  </div>
</template>

<script>
import AuditAD from "../components/AuditAD.vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

export default {
  setup() {
    const { t } = useI18n();
    const tabs = computed(() => [{ label: t("custom.adAudit"), value: "AD" }]);

    return { tabs };
  },
  mounted() {
    this.$router.push("/audit/ad");
  },
  data() {
    return {
      tab: "AD",
    };
  },
  components: { AuditAD },
};
</script>
