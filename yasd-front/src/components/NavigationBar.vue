<template>
  <v-navigation-drawer v-model="drawer" app theme="dark">
    <v-img src="/assets/logo.png" class="ma-5"></v-img>
    <v-divider class="border-opacity-25" />
    <v-list v-for="link in links" :key="link.text">
      <v-list-item
        :prepend-icon="link.icon"
        :title="$t(link.text)"
        :to="link.route"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar app flat :elevation="0">
    <v-container fluid>
      <v-row align="center">
        <v-col>
          <v-row align="center">
            <v-app-bar-nav-icon :elevation="1" @click="drawer = !drawer">
              <v-icon color="grey">mdi-dots-vertical</v-icon>
            </v-app-bar-nav-icon>
            <v-app-bar-title :text="$route.name" class="ml-3" />
          </v-row>
        </v-col>

        <v-spacer></v-spacer>

        <v-col align="end" cols="6">
          <v-btn icon="mdi-refresh" @click="refresh"></v-btn>

          <v-chip variant="text"> {{ $t("custom.from") }}: </v-chip>
          <v-menu
            v-model="menuFrom"
            :return-value.sync="from"
            width="290px"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ props }">
              <v-chip variant="text" v-bind="props" prepend-icon="mdi-calendar-range">
                {{ this.getFormattedFromDate }}
              </v-chip>
            </template>
            <v-date-picker
              color="blue"
              @update:modelValue="(val) => updateTimeRange('from', val)"
              v-model="this.from"
            >
            </v-date-picker>
          </v-menu>

          <v-chip variant="text"> {{ $t("custom.to") }}: </v-chip>
          <v-menu
            v-model="menuTo"
            :return-value.sync="to"
            width="290px"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ props }">
              <v-chip variant="text" v-bind="props" prepend-icon="mdi-calendar-range">
                {{ this.getFormattedToDate }}
              </v-chip>
            </template>
            <v-date-picker
              color="blue"
              @update:modelValue="(val) => updateTimeRange('to', val)"
              v-model="this.to"
            >
            </v-date-picker>
          </v-menu>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <vue-flag :code="currentLanguage" size="default" />
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="lang in languages"
                :key="lang.vueFlagsCode"
                @click="changeLanguage(lang.vueFlagsCode, lang.i18nCode)"
                :title="lang.name"
              >
                <template v-slot:prepend>
                  <vue-flag :code="lang.vueFlagsCode" size="default" class="mr-3" />
                </template>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn class="text-lowercase text-h6 font-weight-light" v-bind="props">
                {{ this.authStore.username }}
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-item
                  :title="$t('custom.settings')"
                  :subtitle="$t('custom.adminUser')"
                ></v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  <v-switch
                    v-model="darkMode"
                    :label="$t('custom.darkMode')"
                    color="custom1"
                    hide-details
                    density="compact"
                    @change="changeTheme"
                  >
                  </v-switch>
                </v-list-item>
              </v-list>

              <v-card-actions class="align-center">
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-logout" color="custom1" @click="logout">{{
                  $t("custom.logout")
                }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>

  <v-snackbar v-model="snackbar" timeout="4000" color="success" location="top">
    {{ this.indexerStore.allAlerts.length + " " + $t("custom.alertsFetched") }}
  </v-snackbar>
</template>

<script>
import { useTheme } from "vuetify/lib/framework.mjs";
import { format, isToday, sub } from "date-fns";
import axios from "axios";
import { useAuthStore } from "@/stores/AuthStore";
import { useIndexerStore } from "@/stores/WazuhIndexerStore.js";
import { useApiStore } from "@/stores/WazuhAPIStore";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const theme = useTheme();
    const authStore = useAuthStore();
    const indexerStore = useIndexerStore();
    const apiStore = useApiStore();
    const { locale, t } = useI18n();

    const yasdBackend = window.location.origin;

    let darkMode = "";

    if (localStorage.getItem("theme")) {
      theme.global.name.value = localStorage.getItem("theme");
      darkMode = localStorage.getItem("theme") === "light" ? false : true;
    } else {
      theme.global.name.value = "light";
      darkMode = false;
    }

    return { theme, authStore, indexerStore, apiStore, darkMode, yasdBackend, locale, t };
  },
  data() {
    return {
      drawer: true,
      from: sub(new Date(), { days: 7 }),
      to: new Date(),
      menuFrom: false,
      menuTo: false,
      snackbar: false,
      links: [
        { icon: "mdi-view-dashboard", text: "custom.general", route: "/" },
        { icon: "mdi-server", text: "custom.groups", route: "/group/alerts" },
        { icon: "mdi-security", text: "custom.audit", route: "/audit" },
      ],
      currentLanguage: "gb",
      languages: [
        { vueFlagsCode: "gb", i18nCode: "en", name: "English" },
        { vueFlagsCode: "fr", i18nCode: "fr", name: "Français" },
        { vueFlagsCode: "cn", i18nCode: "zhHans", name: "Chineese" },
        { vueFlagsCode: "de", i18nCode: "de", name: "German" },
        { vueFlagsCode: "it", i18nCode: "it", name: "Italian" },
      ],
    };
  },
  methods: {
    changeTheme() {
      this.theme.global.name.value = this.theme.global.current.value.dark
        ? "light"
        : "dark";
      this.darkMode = this.theme.global.current.value.dark;
      localStorage.setItem("theme", this.theme.global.name.value);
    },
    logout() {
      axios
        .post(this.yasdBackend + "/logout", {}, { withCredentials: true })
        .then(() => {
          this.authStore.logout();
          this.$router.push("/login");
        })
        .catch((error) => {
          console.error("Logout failed:", error);
        });
    },
    async updateTimeRange(dateType, value) {
      this.menuFrom = false;
      this.menuTo = false;

      if (dateType === "from") {
        this.indexerStore.from = value;
      } else if (dateType === "to") {
        this.indexerStore.to = value;
      }

      this.refresh();
    },
    async refresh() {
      this.indexerStore.loading = true;

      if (this.$route.path.startsWith("/group/")) {
        const luceneQuery = this.apiStore.agents
          .map((agent) => `agent.name:${agent.name}`)
          .join(" OR ");
        await this.indexerStore.fetchDatas(luceneQuery);
        await this.indexerStore.fetchVulns(luceneQuery);
      } else if (this.$route.path === "/") {
        await this.indexerStore.fetchDatas("rule.level: [12 TO 20]");
      } else if (this.$route.path === "/audit/ad") {
        try {
          let adServers = this.$config.ad_servers;

          if (!adServers) {
            this.loading = false;
            return;
          }

          if (typeof adServers === "string") {
            adServers = [adServers];
          }

          const luceneQuery = adServers
            .map((agent) => `agent.name:${agent}`)
            .join(" OR ");

          this.indexerStore.fetchDatas(luceneQuery);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.loading = false;
        }
      }

      this.snackbar = true;
    },
    changeLanguage(vueFlagsCode, i18nCode) {
      this.currentLanguage = vueFlagsCode;
      this.locale = i18nCode;
    },
  },
  computed: {
    getFormattedFromDate() {
      return format(this.from, "MM-dd-yyyy");
    },
    getFormattedToDate() {
      if (isToday(this.to)) {
        return this.t("custom.now");
      } else {
        return format(this.to, "MM-dd-yyyy");
      }
    },
  },
};
</script>
