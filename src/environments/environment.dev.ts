// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
  
    pi_url: "https://ezflow.dev.epsoftinc.com/prcintel",
    bps_url: "https://ezflow.dev.epsoftinc.com/bpstudio",
    rpa_url: "https://ezflow.dev.epsoftinc.com/wfrpa",
    loopback_url: "http://10.11.0.107:3000",
    idm_url: "https://ezidm.dev.epsoftinc.com",
    auth_url: "https://ezflow.dev.epsoftinc.com/authservices",
    //for Auto build
    pi_node_url: "https://ezflow.dev.epsoftinc.com/pinode",
    pi_node_jobs: "http://pi-node-jobs:5000",
    platform_url: "https://ezflow.dev.epsoftinc.com/aiotalplatform",
    schema_registry_url: "http://schemadev-registry:8081",
    alerts_url: "https://ezflow.dev.epsoftinc.com/alerts",
    // Aiotal redirection urls
    myaccount_url: "https://ezflow.dev.epsoftinc.com/#/activation",
    logout_url: "https://ezflow.dev.epsoftinc.com/#/activation",
    redirectout_url: "https://ezflow.dev.epsoftinc.com/#/signout",
    platform_home_url: "https://ezflow.dev.epsoftinc.com/#/",
    projectendpoint_url: "https://ezflow.dev.epsoftinc.com/pcs",
    subscriptionendpoint_url: "https://ezflow.dev.epsoftinc.com/subscriptions",
    // camunda navigation
    camunda_url: "https://ezworkflow.dev.epsoftinc.com",
    // Data upload path
    data_path: "/usr/share/confluent-ftp-data",
    // PI Connectors
    connector_topic: "nodeDev",
    //DB Connector
    dbConnectorHost: "pgpooldev",
    dbName: "eiap_dev",
    dbPort: "5430",
    //RPA WebActions Action AttrId
    webActionAttrId: 536,
    //IPCTenant
    ipcTenant: "28b22b35-9dc5-4860-b5b5-559855d9618c",
    isChatEnable : false,
    isProcessLogsEnable: false,
  };
  