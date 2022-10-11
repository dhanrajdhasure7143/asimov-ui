// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Data upload path
  data_path:"/usr/share/confluent-ftp-data",

  pi_url: 'https://ezflow.qa.epsoftinc.com/prcintel',
  bps_url: 'https://ezflow.qa.epsoftinc.com/bpstudio',
  rpa_url: 'https://ezflow.qa.epsoftinc.com/wfrpa',
  loopback_url: 'http://10.11.0.107:3000',
  idm_url:'https://ezidm.qa.epsoftinc.com',
  auth_url: "https://ezflow.qa.epsoftinc.com/authservices",
  //for Auto build
  pi_node_url: "https://ezflow.qa.epsoftinc.com/pinode",
  pi_node_jobs: "http://pi-node-jobs:5000",
  platform_url:'https://ezflow.qa.epsoftinc.com/aiotalplatform',
  schema_registry_url:"http://schema-registry:8081",
  alerts_url:'https://ezflow.qa.epsoftinc.com/alerts',
  
   // Aiotal redirection urls
  myaccount_url : "https://ezflow.qa.epsoftinc.com/#/activation",
  logout_url: 'https://ezflow.qa.epsoftinc.com/#/activation',
  redirectout_url: 'https://ezflow.qa.epsoftinc.com/#/signout',
  platform_home_url: 'https://ezflow.qa.epsoftinc.com/#/',
  projectendpoint_url:'https://ezflow.qa.epsoftinc.com/pcs',
  subscriptionendpoint_url:'https://ezflow.qa.epsoftinc.com/subscriptions',
  
  //BPMN Platform URL
  bpmnplatformUrl : "https://ezcamunda.qa.epsoftinc.com",
    // camunda navigation 
  camunda_url : "https://ezcamunda.qa.epsoftinc.com",

  // PI Connectors
   connector_topic: 'nodeq',

  //DB Connector
   dbConnectorHost: "pgpoolqa",
   dbName: 'eiap_qa',
   dbPort:"5431"

};
