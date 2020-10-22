// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  pi_url: 'http://eiapdemoapi.epsoftinc.com:96/prcintel',
  bps_url: 'http://eiapdemoapi.epsoftinc.com:96/bpstudio',
  rpa_url: 'http://eiapdemoapi.epsoftinc.com:96/wfrpa',
  loopback_url: 'http://10.11.0.107:3000',
  idm_url:'http://eiapdemoapi.epsoftinc.com:96/idm',
  auth_url: "http://eiapdemoapi.epsoftinc.com:96/authservices",
  pi_node_url: "http://eiapdemoapi.epsoftinc.com:96/pinode",
  platform_url:'http://eiapdemoapi.epsoftinc.com:96/aiotalplatform',
  schema_registry_url:"http://172.16.0.60:8081",
  
 // Aiotal redirection urls 
  myaccount_url : "http://eiapclouddemo.epsoftinc.com:86/#/activation",
  logout_url: 'http://eiapclouddemo.epsoftinc.com:86/#/activation', 

// PI Connectors
  connector_topic: 'nodeq',

//DB Connector
  dbConnectorHost: "172.16.0.64",
  dbName: "asimov_aiotal",

// Data upload path
  data_path:"/home/applmgr"


 //  * QA ENV URl's
 
 /*
    pi_url: 'http://piqa.epsoftinc.in',
    bps_url: 'http://bpsqa.epsoftinc.in',
    rpa_url: 'http://rpaqa.epsoftinc.in',
    loopback_url: 'http://10.11.0.107:3000',
    idm_url:'http://idmqa.epsoftinc.in',
    pi_node_url: "http://pinodedev.epsoftinc.in:3000",
    auth_url: "http://authqa.epsoftinc.in",

  // Aiotal redirection urls 
  myaccount_url : "http://eiapcloudqa.epsoftinc.in/#/activation",
  logout_url: 'http://eiapcloudqa.epsoftinc.in/#/activation',
   platform_url:'http://apqa.epsoftinc.in',

  // PI Connectors
   connector_topic: 'tyty',

  //DB Connector
   dbConnectorHost: "10.11.0.104",
   dbName: 'eiap_qa'
   */
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

