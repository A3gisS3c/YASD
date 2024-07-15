<template>
  <v-app>
    <NavigationBar v-if="this.authStore.isAuthenticated" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavigationBar from "@/components/NavigationBar";
import { useAuthStore } from "@/stores/AuthStore";

export default {
  setup() {
    const authStore = useAuthStore();

    return { authStore };
  },
  name: "App",
  components: { NavigationBar },
};
</script>

<style></style>
