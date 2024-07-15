import { defineStore } from "pinia";
import axios from 'axios';
import { isThisSecond, sub } from 'date-fns';

const YASDBACKEND = window.location.origin;
const LINUX_SSH_OPEN_SESSION = "5715";
const WINDOWS_RDP_OPEN_SESSION = "92653";
const AD_AUDIT_COMPUTERS = "60121"; //added/changed/deleted
const AD_AUDIT_USERS_ADDED = "60109"; //or enabled
const AD_AUDIT_USERS_MODIFIED = "60110";
const AD_AUDIT_USERS_DELETED = "60111"; //or disabled
const AD_AUDIT_GROUPS_SECURITY_GLOBAL_CREATED = "60140"
const AD_AUDIT_GROUPS_SECURITY_GLOBAL_MEMBER_ADDED = "60141"
const AD_AUDIT_GROUPS_SECURITY_GLOBAL_MEMBER_REMOVED = "60142"
const AD_AUDIT_GROUPS_SECURITY_GLOBAL_DELETED = "60202"
const AD_AUDIT_GROUPS_SECURITY_LOCAL_CREATED = "60143"
const AD_AUDIT_GROUPS_SECURITY_LOCAL_MEMBER_ADDED = "60144"
const AD_AUDIT_GROUPS_SECURITY_LOCAL_MEMBER_REMOVED = "60145"
const AD_AUDIT_GROUPS_SECURITY_LOCAL_DELETED = "60146"
const AD_AUDIT_GROUPS_SECURITY_UNIVERSAL_CREATED = "60149"
const AD_AUDIT_GROUPS_SECURITY_UNIVERSAL_MEMBER_ADDED = "60151"
const AD_AUDIT_GROUPS_SECURITY_UNIVERSAL_MEMBER_REMOVED = "60152"
const AD_AUDIT_GROUPS_SECURITY_UNIVERSAL_DELETED = "60153"
const GROUP_ALERTS_LEVEL_MIN = 6;
const GENERAL_ALERTS_LEVEL_MIN = 12;

export const useIndexerStore = defineStore('indexerStore', {
    state: () => ({
        allAlerts: [],
        loading: false,
        scrollId: null,
        hasMoreData: true,
        from: sub(new Date(), { days: 7 }),
        to: new Date(),
        vulnerabilities: [],            //All vulnerabilities for all agents of selected group
        criticalsVulnsSummary: [],     //Criticals vulnerabilities summary for all agents
    }),
    getters: {

        getUsersConnectionsArray() {
            const filteredAlerts = this.allAlerts.filter((item) => {
                if (item.rule.id === LINUX_SSH_OPEN_SESSION || item.rule.id === WINDOWS_RDP_OPEN_SESSION) {
                    if (item.rule.id === WINDOWS_RDP_OPEN_SESSION) {
                        item.data.dstuser = item.data.win.eventdata.targetDomainName + '\\' + item.data.win.eventdata.targetUserName;
                        item.data.srcip = item.data.win.eventdata.ipAddress
                    }
                    //to remove
                    if (item.data.dstuser && !item.data.dstuser.includes('bbettuzzi')) {
                        return true;
                    }
                }
                return false;
            });

            return filteredAlerts;
        },
        getUsersConnectionsPieArray() {

            const nameArray = this.getUsersConnectionsArray.map(item => item.data.dstuser);

            const userCountMap = {};
            for (const user of nameArray) {
                if (userCountMap[user]) {
                    userCountMap[user]++;
                } else {
                    userCountMap[user] = 1;
                }
            }
            const data = Object.keys(userCountMap).map(name => {
                return {
                    value: userCountMap[name],
                    name: name
                }
            });

            return data;
        },
        getTopAlertsDonnutArray() {

            const alertArray = this.getFilteredAlerts.map(item => item.rule.description);

            const alertCountMap = {};
            for (const alert of alertArray) {
                if (alertCountMap[alert]) {
                    alertCountMap[alert]++;
                } else {
                    alertCountMap[alert] = 1;
                }
            }
            const data = Object.keys(alertCountMap).map(alert => {
                return {
                    value: alertCountMap[alert],
                    name: alert
                }
            });

            data.sort((a, b) => b.value - a.value);

            const topAlerts = data.slice(0, 5);


            return topAlerts;
        },
        getFilteredAlerts() {
            const filteredAlerts = this.allAlerts.filter(alert => {
                const isLevelGreaterThan6 = alert.rule.level >= GROUP_ALERTS_LEVEL_MIN;
                const isNotVulnerabilityDetectorOrSyscheck =
                    !alert.rule.groups.includes("vulnerability-detector") &&
                    !alert.rule.groups.includes("syscheck") &&
                    !alert.rule.groups.includes("sca") &&
                    !alert.rule.groups.includes("account_changed") //AD Audit

                return isLevelGreaterThan6 && isNotVulnerabilityDetectorOrSyscheck;
            });

            return filteredAlerts;
        },
        getLineArrayByHour() { // Using getFilteredAlerts

            let alertsCountByHour = {};

            //count alerts by hour
            this.getFilteredAlerts.forEach(alert => {
                let timestamp = alert.timestamp;
                let hour = new Date(timestamp).setMinutes(0, 0, 0); // Round to the nearest hour
                if (!alertsCountByHour[hour]) {
                    alertsCountByHour[hour] = 1;
                } else {
                    alertsCountByHour[hour]++;
                }
            });

            // Get oldest and newest timestamps
            let timestamps = this.getFilteredAlerts.map(alert => new Date(alert.timestamp).getTime());
            let oldestTimestamp = Math.min(...timestamps);
            let newestTimestamp = Math.max(...timestamps);


            // Format array for Line chart + put 0 values where theres no alert
            let dataForChart = [];

            let currentHour = new Date(oldestTimestamp).setMinutes(0, 0, 0);
            while (currentHour <= newestTimestamp) {
                dataForChart.push([
                    new Date(currentHour),
                    alertsCountByHour[currentHour] || 0
                ]);
                currentHour = new Date(currentHour).getTime() + 60 * 60 * 1000;
            }

            return dataForChart;
        },
        getAllFIM() {
            const FIM = this.allAlerts.filter(alert => {
                return (alert.rule.groups.includes("syscheck_file") ||
                    alert.rule.groups.includes("syscheck_registry")
                )
            });
            return FIM;
        },
        getLoginUserFIM() {
            const loginUserFIM = this.getAllFIM.filter(alert => {
                return alert.syscheck?.audit?.login_user?.name !== undefined && alert.syscheck.audit.login_user.name !== '';
            });
            return loginUserFIM;
        },
        getSystemFIM() {
            const systemFIM = this.getAllFIM.filter(alert => {
                return alert.syscheck?.audit?.login_user?.name === undefined || alert.syscheck.audit.login_user.name === '';
            });
            return systemFIM;
        },
        getCriticalAlerts() {

            const criticals = this.getFilteredAlerts.filter(alert => {
                return alert.rule.level >= GENERAL_ALERTS_LEVEL_MIN;
            });

            return criticals;
        },
        getUptimeAlerts() {
            const uptimeAlerts = this.allAlerts.filter(alert => {
                return alert.rule.id === '100034' || alert.rule.id === '100035'
            });

            return uptimeAlerts;
        },
        getRootPasswordAlerts() {
            const rootPasswordAlerts = this.allAlerts.filter(alert => {
                return alert.rule.id === '100037' || alert.rule.id === '100038'
            });

            return rootPasswordAlerts;
        },
        getUsersADAudit() {
            const alerts = this.allAlerts.filter(alert => {
                return (alert.rule.id === AD_AUDIT_USERS_ADDED ||
                    alert.rule.id === AD_AUDIT_USERS_MODIFIED ||
                    alert.rule.id === AD_AUDIT_USERS_DELETED

                )
            });
            for (const alert of alerts) {
                alert.data.src = alert.data.win.eventdata.subjectDomainName + '\\' + alert.data.win.eventdata.subjectUserName;
                alert.data.target = alert.data.win.eventdata.targetDomainName + '\\' + alert.data.win.eventdata.targetUserName;
            }
            return alerts;
        },
        getComputersADAudit() {
            const alerts = this.allAlerts.filter(alert => {
                return (alert.rule.id === AD_AUDIT_COMPUTERS);
            });

            for (const alert of alerts) {
                alert.data.src = alert.data.win.eventdata.subjectDomainName + '\\' + alert.data.win.eventdata.subjectUserName
                alert.data.target = alert.data.win.eventdata.targetDomainName + '\\' + alert.data.win.eventdata.targetUserName
            }

            return alerts;
        },
        getGroupsADAudit() {
            const audit = this.allAlerts.filter(alert => {
                return (alert.rule.id === AD_AUDIT_GROUPS_SECURITY_GLOBAL_CREATED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_GLOBAL_MEMBER_ADDED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_GLOBAL_MEMBER_REMOVED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_GLOBAL_DELETED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_LOCAL_CREATED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_LOCAL_MEMBER_ADDED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_LOCAL_MEMBER_REMOVED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_LOCAL_DELETED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_UNIVERSAL_CREATED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_UNIVERSAL_MEMBER_ADDED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_UNIVERSAL_MEMBER_REMOVED ||
                    alert.rule.id === AD_AUDIT_GROUPS_SECURITY_UNIVERSAL_DELETED
                )
            });
            for (const alert of audit) {
                alert.data.src = alert.data.win.eventdata.subjectDomainName + '\\' + alert.data.win.eventdata.subjectUserName;
                alert.data.target = alert.data.win.eventdata.targetDomainName + '\\' + alert.data.win.eventdata.targetUserName;
            }
            return audit;
        }
    },
    actions: {
        async fetchDatas(luceneQuery) { // Using PIT + search_after to fetch datas from wazuh-indexer (Opensearch)
            this.loading = true;

            try {

                const fromFormatted = this.from.toISOString();
                const toEndOfDay = new Date(this.to);
                toEndOfDay.setHours(23, 59, 59, 999);
                const toFormatted = toEndOfDay.toISOString();
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                const jsonData = {
                    sort: [{ timestamp: 'desc' }],
                    query: {
                        bool: {
                            must: [{ query_string: { query: luceneQuery } }],
                            filter: [{
                                range: {
                                    timestamp: {
                                        time_zone: userTimeZone,
                                        gte: fromFormatted,
                                        lte: toFormatted
                                    }
                                }
                            }]
                        }
                    }
                };

                const pitResponse = await axios.post(YASDBACKEND + `/opensearch/wazuh-alerts-*/_search/point_in_time?keep_alive=1h`);
                const pitId = pitResponse.data.pit_id;
                jsonData.pit = { id: pitId, keep_alive: "1m" }; // check here whether pit can change over time

                let allAlerts = [];
                let searchAfter = null;
                let hasMoreResults = true;
                this.allAlerts = [];

                while (hasMoreResults) {
                    if (searchAfter) {
                        jsonData.search_after = searchAfter;
                    }

                    const response = await axios.post(YASDBACKEND + '/opensearch/_search?size=10000', JSON.stringify(jsonData));
                    const hits = response.data.hits.hits;
                    allAlerts = allAlerts.concat(hits.map(item => item._source));

                    if (hits.length < 10000) {
                        hasMoreResults = false;
                    } else {
                        searchAfter = hits[hits.length - 1].sort;
                    }
                }

                this.allAlerts = allAlerts;

                // PIT closing
                const payload = {
                    pit_id: [pitId]
                };
                axios.delete(YASDBACKEND + '/opensearch/_search/point_in_time', { data: JSON.stringify(payload) });

            } catch (error) {
                console.error("Failed to update alerts:", error);
            } finally {
                this.loading = false;
            }
        },
        async fetchVulns(luceneQuery) { // Using PIT + search_after to fetch datas from wazuh-indexer (Opensearch)
            this.loading = true;

            try {

                const jsonData = {
                    query: {
                        bool: {
                            must: [{ query_string: { query: luceneQuery } }],
                        }
                    }
                };

                const pitResponse = await axios.post(YASDBACKEND + `/opensearch/wazuh-states-vulnerabilities-*/_search/point_in_time?keep_alive=1h`);
                const pitId = pitResponse.data.pit_id;
                jsonData.pit = { id: pitId, keep_alive: "1m" }; // check here whether pit can change over time

                let allAlerts = [];
                let searchAfter = null;
                let hasMoreResults = true;
                this.vulnerabilities = [];
                this.criticalsVulnsSummary = [];

                while (hasMoreResults) {
                    if (searchAfter) {
                        jsonData.search_after = searchAfter;
                    }

                    const response = await axios.post(YASDBACKEND + '/opensearch/_search?size=10000', JSON.stringify(jsonData));
                    const hits = response.data.hits.hits;
                    allAlerts = allAlerts.concat(hits.map(item => item._source));

                    if (hits.length < 10000) {
                        hasMoreResults = false;
                    } else {
                        searchAfter = hits[hits.length - 1].sort;
                    }
                }

                this.vulnerabilities = allAlerts;

                const summary = {};
                this.vulnerabilities.forEach(entry => {
                    if (entry.vulnerability.severity === 'Critical') {
                        const agentId = entry.agent.id;
                        if (!summary[agentId]) {
                            summary[agentId] = 0;
                        }
                        summary[agentId]++;
                    }
                });

                this.criticalsVulnsSummary = Object.keys(summary).map(id => ({
                    id,
                    criticals: summary[id]
                }));


                // PIT closing
                const payload = {
                    pit_id: [pitId]
                };
                axios.delete(YASDBACKEND + '/opensearch/_search/point_in_time', { data: JSON.stringify(payload) });

            } catch (error) {
                console.error("Failed to update alerts:", error);
            } finally {
                this.loading = false;
            }
        },
    },
})