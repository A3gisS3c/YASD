<template>
  <v-container fluid class="fill-height login">
    <v-row align="center" justify="center">
      <v-col cols="3">
        <v-form>
          <h1 class="text-center text-white">Login</h1>
          <v-text-field
            prepend-icon="mdi-account"
            placeholder="Login"
            class="text-white"
            v-model="username"
          ></v-text-field>
          <v-text-field
            type="password"
            prepend-icon="mdi-lock"
            placeholder="Password"
            class="text-white"
            v-model="password"
          ></v-text-field>
          <v-btn color="grey-darken-3" flat block type="submit" @click.prevent="login"
            >Submit</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
    <h4 class="footer text-grey-darken-1 text-center">
      {{ new Date().getFullYear() }} - YASD v1.0
    </h4>
  </v-container>
  <v-snackbar v-model="snackbar" timeout="2000" color="error" location="bottom">
    Login error
  </v-snackbar>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/AuthStore";

export default {
  setup() {
    const authStore = useAuthStore();
    const yasdBackend = window.location.origin;

    return { authStore, yasdBackend };
  },
  data() {
    return {
      username: "",
      password: "",
      snackbar: false,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(this.yasdBackend + "/login", {
          username: this.username,
          password: this.password,
        });
        this.authStore.setAuthState(true);
        this.authStore.setUserName(response.data.username);
        this.$router.push("/");
      } catch (error) {
        console.log(error);
        this.username = "";
        this.password = "";
        this.snackbar = true;
      }
    },
  },
};
</script>

<style scoped>
.login {
  background: url("@/assets/authentication.jpg");
  background-size: cover;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
