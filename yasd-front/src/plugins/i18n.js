import { createI18n } from 'vue-i18n'
import { en, fr, de, it, zhHans } from 'vuetify/locale'

const messages = {
  en: {
    $vuetify: {
      ...en,
      dataIterator: {
        loadingText: 'Loading data...'
      },
    },
    custom: {
      adAudit: 'AD Audit',
      adminUser: 'Admin user',
      agent: 'Agent',
      agents: 'agents',
      agentsCompliance: 'Agents compliance',
      alertTab: 'ALERTES 6+',
      alerts12Plus: 'There are 12+ alerts',
      alertsFetched: 'alerts fetched',
      all: 'All',
      audit: 'Audit',
      computers: 'Computers',
      critical: 'Critical',
      criticalVulnerabilities: 'Critical vulnerabilities:',
      darkMode: 'Dark mode',
      description: 'Description',
      effectiveUser: 'Effective user',
      event: 'Event',
      file: 'File',
      fimTab: 'FIM',
      from: 'From',
      general: 'General',
      group: 'Group',
      groups: 'Groups',
      high: 'High',
      lastCriticalAlerts: 'Last critical alerts',
      level: 'Level',
      loginUser: 'Login user',
      logout: 'Logout',
      low: 'Low',
      medium: 'Medium',
      member: 'Member',
      noAlerts: 'There are no 12+ alerts',
      now: 'Now',
      openldapAudit: 'Openldap audit',
      origin: 'Origin',
      pkiAudit: 'PKI (ADCS) audit',
      references: 'References',
      result: 'Result',
      rootPasswordAge: 'Root/Admin password age:',
      ruleDescription: 'Rule description',
      scaTab: 'SCA',
      search: 'Search',
      searchVulnerability: 'Search vulnerability',
      server: 'Server',
      serversTab: 'SERVERS',
      settings: 'Settings',
      severity: 'Severity',
      system: 'System',
      target: 'Target',
      targetGroup: 'Target group',
      timestamp: 'Timestamp',
      title: 'Title',
      to: 'To',
      top5Alerts: 'Top 5 alerts',
      uptime: 'Uptime:',
      user: 'User',
      users: 'Users',
      usersTab: 'USERS',
      vulnerabilities: 'Vulnerabilities',
      version: 'Version'
    }
  },
  fr: {
    $vuetify: {
      ...fr,
      dataIterator: {
        loadingText: 'Chargement des données...'
      },
    },
    custom: {
      adAudit: 'Audit AD',
      adminUser: 'Utilisateur administrateur',
      agent: 'Agent',
      agents: 'agents',
      agentsCompliance: 'Conformité des agents',
      alertTab: 'ALERTES 6+',
      alerts12Plus: 'Il y a 12+ alertes',
      alertsFetched: 'alertes récupérées',
      all: 'Tous',
      audit: 'Audit',
      computers: 'Ordinateurs',
      critical: 'Critique',
      criticalVulnerabilities: 'Vulnérabilités critiques:',
      darkMode: 'Mode sombre',
      description: 'Description',
      effectiveUser: 'Utilisateur effectif',
      event: 'Événement',
      file: 'Fichier',
      fimTab: 'FIM',
      from: 'De',
      general: 'Général',
      group: 'Groupe',
      groups: 'Groupes',
      high: 'Élevé',
      lastCriticalAlerts: 'Dernières alertes critiques',
      level: 'Niveau',
      loginUser: 'Utilisateur connecté',
      logout: 'Déconnexion',
      low: 'Faible',
      medium: 'Moyen',
      member: 'Membre',
      noAlerts: 'Il n\'y a pas d\'alertes 12+',
      now: 'Maintenant',
      openldapAudit: 'Audit Openldap',
      origin: 'Origine',
      pkiAudit: 'Audit PKI (ADCS)',
      references: 'Références',
      result: 'Résultat',
      rootPasswordAge: 'Âge du mot de passe Root/Admin:',
      ruleDescription: 'Description de la règle',
      scaTab: 'SCA',
      search: 'Recherche',
      searchVulnerability: 'Rechercher une vulnérabilité',
      server: 'Serveur',
      serversTab: 'SERVEURS',
      settings: 'Paramètres',
      severity: 'Sévérité',
      system: 'Système',
      target: 'Cible',
      targetGroup: 'Groupe cible',
      timestamp: 'Horodatage',
      title: 'Titre',
      to: 'À',
      top5Alerts: 'Top 5 alertes',
      uptime: 'Temps de fonctionnement:',
      user: 'Utilisateur',
      users: 'Utilisateurs',
      usersTab: 'UTILISATEURS',
      vulnerabilities: 'Vulnérabilités',
      version: 'Version'
    }
  },
  de: {
    $vuetify: {
      ...de,
      dataIterator: {
        loadingText: 'Daten werden geladen'
      },
    },
    custom: {
      adAudit: 'AD-Audit',
      adminUser: 'Admin-Benutzer',
      agent: 'Agent',
      agents: 'Agenten',
      agentsCompliance: 'Agenten-Compliance',
      alertTab: 'ALERTES 6+',
      alerts12Plus: 'Es gibt 12+ Warnungen',
      alertsFetched: 'Warnungen abgerufen',
      all: 'Alle',
      audit: 'Audit',
      computers: 'Computer',
      critical: 'Kritisch',
      criticalVulnerabilities: 'Kritische Schwachstellen:',
      darkMode: 'Dunkler Modus',
      description: 'Beschreibung',
      effectiveUser: 'Effektiver Benutzer',
      event: 'Ereignis',
      file: 'Datei',
      fimTab: 'FIM',
      from: 'Von',
      general: 'Allgemein',
      group: 'Gruppe',
      groups: 'Gruppen',
      high: 'Hoch',
      lastCriticalAlerts: 'Letzte kritische Warnungen',
      level: 'Niveau',
      loginUser: 'Login-Benutzer',
      logout: 'Abmelden',
      low: 'Niedrig',
      medium: 'Mittel',
      member: 'Mitglied',
      noAlerts: 'Es gibt keine 12+ Warnungen',
      now: 'Jetzt',
      openldapAudit: 'Openldap-Audit',
      origin: 'Ursprung',
      pkiAudit: 'PKI (ADCS) Audit',
      references: 'Referenzen',
      result: 'Ergebnis',
      rootPasswordAge: 'Alter des Root-/Admin-Passworts:',
      ruleDescription: 'Regelbeschreibung',
      scaTab: 'SCA',
      search: 'Suche',
      searchVulnerability: 'Schwachstelle suchen',
      server: 'Server',
      serversTab: 'SERVER',
      settings: 'Einstellungen',
      severity: 'Schwere',
      system: 'System',
      target: 'Ziel',
      targetGroup: 'Zielgruppe',
      timestamp: 'Zeitstempel',
      title: 'Titel',
      to: 'Bis',
      top5Alerts: 'Top 5 Warnungen',
      uptime: 'Betriebszeit:',
      user: 'Benutzer',
      users: 'Benutzer',
      usersTab: 'BENUTZER',
      vulnerabilities: 'Schwachstellen',
      version: 'Version'
    }
  },
  it: {
    $vuetify: {
      ...it,
      dataIterator: {
        loadingText: 'Caricamento dati'
      },
    },
    custom: {
      adAudit: 'Audit AD',
      adminUser: 'Utente amministratore',
      agent: 'Agente',
      agents: 'agenti',
      agentsCompliance: 'Conformità degli agenti',
      alertTab: 'ALERTES 6+',
      alerts12Plus: 'Ci sono 12+ avvisi',
      alertsFetched: 'avvisi recuperati',
      all: 'Tutti',
      audit: 'Verifica',
      computers: 'Computer',
      critical: 'Critico',
      criticalVulnerabilities: 'Vulnerabilità critiche:',
      darkMode: 'Modalità scura',
      description: 'Descrizione',
      effectiveUser: 'Utente effettivo',
      event: 'Evento',
      file: 'File',
      fimTab: 'FIM',
      from: 'Da',
      general: 'Generale',
      group: 'Gruppo',
      groups: 'Gruppi',
      high: 'Alto',
      lastCriticalAlerts: 'Ultimi avvisi critici',
      level: 'Livello',
      loginUser: 'Utente di login',
      logout: 'Disconnettersi',
      low: 'Basso',
      medium: 'Medio',
      member: 'Membro',
      noAlerts: 'Non ci sono avvisi 12+',
      now: 'Adesso',
      openldapAudit: 'Audit Openldap',
      origin: 'Origine',
      pkiAudit: 'Audit PKI (ADCS)',
      references: 'Riferimenti',
      result: 'Risultato',
      rootPasswordAge: 'Età della password Root/Admin:',
      ruleDescription: 'Descrizione della regola',
      scaTab: 'SCA',
      search: 'Ricerca',
      searchVulnerability: 'Cerca vulnerabilità',
      server: 'Server',
      serversTab: 'SERVER',
      settings: 'Impostazioni',
      severity: 'Gravità',
      system: 'Sistema',
      target: 'Obiettivo',
      targetGroup: 'Gruppo target',
      timestamp: 'Timestamp',
      title: 'Titolo',
      to: 'A',
      top5Alerts: 'Top 5 avvisi',
      uptime: 'Uptime:',
      user: 'Utente',
      users: 'Utenti',
      usersTab: 'UTENTI',
      vulnerabilities: 'Vulnerabilità',
      version: 'Versione'
    }
  },
  zhHans: {
    $vuetify: {
      ...zhHans,
      dataIterator: {
        loadingText: '加载数据...'
      },
    },
    custom: {
      adAudit: 'AD 审计',
      adminUser: '管理员用户',
      agent: '代理',
      agents: '代理',
      agentsCompliance: '代理合规',
      alertTab: 'ALERTES 6+',
      alerts12Plus: '有 12+ 个警报',
      alertsFetched: '警报获取',
      all: '全部',
      audit: '审计',
      computers: '计算机',
      critical: '严重',
      criticalVulnerabilities: '严重漏洞:',
      darkMode: '黑暗模式',
      description: '描述',
      effectiveUser: '有效用户',
      event: '事件',
      file: '文件',
      fimTab: 'FIM',
      from: '从',
      general: '一般',
      group: '组',
      groups: '组',
      high: '高',
      lastCriticalAlerts: '最后的关键警报',
      level: '级别',
      loginUser: '登录用户',
      logout: '登出',
      low: '低',
      medium: '中',
      member: '成员',
      noAlerts: '没有12+警报',
      now: '现在',
      openldapAudit: 'Openldap 审计',
      origin: '起源',
      pkiAudit: 'PKI (ADCS) 审计',
      references: '参考资料',
      result: '结果',
      rootPasswordAge: 'Root/管理员密码年龄:',
      ruleDescription: '规则描述',
      scaTab: 'SCA',
      search: '搜索',
      searchVulnerability: '搜索漏洞',
      server: '服务器',
      serversTab: '服务器',
      settings: '设置',
      severity: '严重性',
      system: '系统',
      target: '目标',
      targetGroup: '目标组',
      timestamp: '时间戳',
      title: '标题',
      to: '到',
      top5Alerts: '前5个警报',
      uptime: '正常运行时间:',
      user: '用户',
      users: '用户',
      usersTab: '用户',
      vulnerabilities: '漏洞',
      version: '版本'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
