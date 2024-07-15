import { defineStore } from 'pinia';
import axios from "axios";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: localStorage.getItem('username') || ''
  }),
  actions: {
    setAuthState(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
    setUserName(username) {
      this.username = username;
      localStorage.setItem('username', username)
    },
    logout() {
      this.isAuthenticated = false;
      this.username = '';
      localStorage.removeItem('username');
    },
    async checkAuth() {
      try {
        const response = await axios.get('/auth/validate');
        this.setAuthState(response.data.isAuthenticated);
      } catch (error) {
        console.log(error)
        this.setAuthState(false);
      }
    }
  }
});