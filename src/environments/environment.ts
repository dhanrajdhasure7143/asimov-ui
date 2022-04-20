// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //pi_url: 'https://ezflow.demo.epsoftinc.com/prcintel',
  pi_url: 'http://10.100.7.20:9192'
  bps_url: 'https://ezflow.demo.epsoftinc.com/bpstudio',
  rpa_url: 'https://ezflow.demo.epsoftinc.com/wfrpa',
  loopback_url: 'http://10.11.0.107:3000',
  idm_url:'https://ezidm.demo.epsoftinc.com',
  auth_url: "https://ezflow.demo.epsoftinc.com/authservices",
  pi_node_url: "https://ezflow.demo.epsoftinc.com/pinode",
  platform_url:'https://ezflow.demo.epsoftinc.com/aiotalplatform',
  schema_registry_url:"http://schema-registry:8081",
  alerts_url:'https://ezflow.demo.epsoftinc.com/alerts',
  socialLoginRedirectURL: 'https://ezflow.demo.epsoftinc.com/#/user',

 // Aiotal redirection urls 
  myaccount_url : "https://ezflow.demo.epsoftinc.com/#/activation",
  logout_url: 'https://ezflow.demo.epsoftinc.com/#/activation', 
  //redirection_logout_url: 'https://eiapclouddemo.epsoftinc.com:86/#/user',
  redirectout_url: 'https://ezflow.demo.epsoftinc.com/#/signout',
// PI Connectors
  connector_topic: 'nodeq',
  platform_home_url: 'https://ezflow.demo.epsoftinc.com/#/',
  pi_node_jobs: "http://pi-node-jobs-demo:5000",
  projectendpoint_url:'https://ezflow.demo.epsoftinc.com/pcs',
  subscriptionendpoint_url:'https://ezflow.demo.epsoftinc.com/subscriptions',

//BPMN Platform URL
 // bpmnplatformUrl : "http://10.11.0.127:8080",

//DB Connector
  dbConnectorHost: "pgpool",
  dbName: "eiap_demo",

// Data upload path
  data_path:"/usr/share/confluent-ftp-data",

  camunda_url : "https://ezcamunda.demo.epsoftinc.com",

  //BPMN Platform URL
  bpmnplatformUrl : "https://ezcamunda.demo.epsoftinc.com"


 //  * QA ENV URl's
 
 /*
    pi_url: 'http://piqa.epsoftinc.in',
    bps_url: 'http://bpsqa.epsoftinc.in',
    rpa_url: 'http://rpaqa.epsoftinc.in',
    loopback_url: 'http://10.11.0.107:3000',
    idm_url:'http://idmqa.epsoftinc.in',
    pi_node_url: "http://pinodedev.epsoftinc.in:3000",
    auth_url: "http://authqa.epsoftinc.in",

  //  * QA ENV URl's
  
     pi_url: 'http://piqa.epsoftinc.in',
     bps_url: 'http://bpsqa.epsoftinc.in',
     rpa_url: 'http://rpaqa.epsoftinc.in',
     loopback_url: 'http://10.11.0.107:3000',
     idm_url:'http://idmqa.epsoftinc.in',
     pi_node_url: "http://10.11.0.108:3000",
     auth_url: "http://authqa.epsoftinc.in",
     platform_url:'http://apqa.epsoftinc.in',
     schema_registry_url:"http://10.11.0.101:8081",
     alerts_url:'http://alertsqa.epsoftinc.in',
     pi_node_jobs: "http://10.11.0.108:5000",
    

  // Aiotal redirection urls 
    myaccount_url : "http://eiapcloudqa.epsoftinc.in/#/activation",
    logout_url: 'http://eiapcloudqa.epsoftinc.in/#/activation',
   
  // PI Connectors
   connector_topic: 'tyty',


   //DB Connector
    dbConnectorHost: "10.11.0.104",
    dbName: 'eiap_qa',

  
  //BPMN Platform URL
  bpmnplatformUrl : "http://10.11.0.128:8080"*/

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
