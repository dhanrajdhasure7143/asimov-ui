// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  pi_url: "https://ezflow.demo.epsoftinc.com/prcintel",
  bps_url: "https://ezflow.demo.epsoftinc.com/bpstudio",
  rpa_url: "https://ezflow.demo.epsoftinc.com/wfrpa",
  loopback_url: "http://10.11.0.107:3000",
  idm_url: "https://ezidm.demo.epsoftinc.com",
  auth_url: "https://ezflow.demo.epsoftinc.com/authservices",
  pi_node_url: "https://ezflow.demo.epsoftinc.com/pinode",
  platform_url: "https://ezflow.demo.epsoftinc.com/aiotalplatform",
  schema_registry_url: "http://schema-demo-registry:8081",
  alerts_url: "https://ezflow.demo.epsoftinc.com/alerts",
  socialLoginRedirectURL: "https://ezflow.demo.epsoftinc.com/#/user",
  // Aiotal redirection urls
  myaccount_url: "https://ezflow.demo.epsoftinc.com/#/activation",
  logout_url: "https://ezflow.demo.epsoftinc.com/#/activation",
  redirectout_url: "https://ezflow.demo.epsoftinc.com/#/signout",
  platform_home_url: "https://ezflow.demo.epsoftinc.com/#/",
  pi_node_jobs: "http://pi-node-jobs-demo:5000",
  projectendpoint_url: "https://ezflow.demo.epsoftinc.com/pcs",
  subscriptionendpoint_url: "https://ezflow.demo.epsoftinc.com/subscriptions",
  //BPMN Platform URL
  camunda_url: "https://ezworkflow.demo.epsoftinc.com",
  //A-Square/Copilot
  asquare:"https://ezflow.demo.epsoftinc.com",
  // Data upload path
  data_path: "/usr/share/confluent-ftp-data",
  // PI Connectors
  connector_topic: "nodeq",
  //DB Connector
  dbConnectorHost: "pgpool",
  dbName: "eiap_demo",
  dbPort: "5432",
  //RPA WebActions Action AttrId
  webActionAttrId: 536,
  //IPCTenant
  ipcTenant: "014bb3a8-a15e-436f-b6fc-f245121d4f20",
  isChatEnable : true,
  isProcessLogsEnable: true,
  isCopilotEnable : true,
  isRPAConfigurationsImportEnabled : false,
  isSubscrptionEnabled : false
};
