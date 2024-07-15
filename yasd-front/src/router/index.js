import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore';
import Audit from '../views/Audit.vue'
import AuditAD from '@/components/AuditAD.vue';
import General from '../views/General.vue'
import Group from '../views/Group.vue'
import GroupAlerts from '../views/GroupAlerts.vue'
import GroupUsers from '../views/GroupUsers.vue'
import GroupServers from '../views/GroupServers.vue'
import GroupVulnerabilities from '../views/GroupVulnerabilities'
import GroupSCA from '../views/GroupSCA.vue'
import GroupFIM from '../views/GroupFIM.vue'
import GroupPolicy from '../views/GroupPolicy.vue'
import Login from '@/views/Login.vue'
import NotFound from '../components/NotFound.vue'


const routes = [

  {
    path: '/',
    name: 'General',
    component: General
  },
  {
    path: '/group',
    name: 'Group',
    component: Group,
    children: [
      {
        path: 'alerts',
        name: 'Alerts 6+',
        component: GroupAlerts
      },
      {
        path: 'users',
        name: 'Users',
        component: GroupUsers
      },
      {
        path: 'servers',
        name: 'Servers',
        component: GroupServers,
      },
      {
        path: 'vulnerabilities/:id',
        name: 'vulnerabilities',
        component: GroupVulnerabilities
      },
      {
        path: 'sca',
        name: 'SCA',
        component: GroupSCA
      },
      {
        path: 'policy/:id/:policy_id',
        name: 'policy',
        props: true,
        component: GroupPolicy
      },
      {
        path: 'fim',
        name: 'FIM',
        component: GroupFIM
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/audit',
    name: 'Audit view',
    component: Audit,
    children: [
      {
        path: 'ad',
        name: 'AD',
        component: AuditAD
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  async function checkAuthAndRedirect() {
    await authStore.checkAuth();

    if (!authStore.isAuthenticated && to.path !== '/login') {
      next('/login');
    } else if (authStore.isAuthenticated && to.path === '/login') {
      next('/');
    } else {
      next();
    }
  }

  checkAuthAndRedirect();
});

export default router
