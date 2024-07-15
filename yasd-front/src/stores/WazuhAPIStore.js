import { defineStore } from "pinia";
import axios from "axios";

const yasdBackend = window.location.origin;

export const useApiStore = defineStore('apiStore', {
    state: () => ({
        clients: [],
        agents: [],
        scaSummary: [],                 //Summary for all agents
        sca: [],                        //SCA for selected agent and given policy
        loading: false
    }),
    getters: {
    },
    actions: {
        async updateClients() {
            const res = await axios.get(yasdBackend + "/wazuh/groups");
            this.clients = res.data.data.affected_items;
        },
        async updateAgentsByClient(client) {

            this.loading = true;

            const res = await axios.get(yasdBackend + `/wazuh/groups/${client}/agents`);
            this.agents = res.data.data.affected_items;

            //Update SCA summary par agent, used by SCA view
            this.scaSummary = [];

            for (const agent of this.agents) {
                const res = await axios.get(yasdBackend + `/wazuh/sca/${agent.id}`);
                this.scaSummary[agent.id] = res.data.data.affected_items;
            }

            this.loading = false;

        },
        async updateVulnerabilitiesByAgent(id) {
            const res = await axios.get(yasdBackend + `/wazuh/vulnerability/${id}?limit=10000`);
            this.vulnerabilities = res.data.data.affected_items;
        },
        async updateSCAByAgent(id, policy_id) {
            const res = await axios.get(yasdBackend + `/wazuh/sca/${id}/checks/${policy_id}`);
            this.sca = res.data.data.affected_items;
        }
    }
})