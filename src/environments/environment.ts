// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Data upload path
   data_path:"/var/kafka",

//   //  * DEV ENV URl's

  pi_url: 'http://pidev.epsoftinc.in',

  bps_url: 'http://bpsdev.epsoftinc.in',
  rpa_url: 'http://rpadev.epsoftinc.in',
  loopback_url: 'http://10.11.0.107:3000',
  idm_url:'http://idmdev.epsoftinc.in',
  auth_url: "http://authdev.epsoftinc.in",
  //for Auto build
  pi_node_url: "http://10.11.0.107:3000",
  pi_node_jobs: "http://10.11.0.107:5000",
  //for local environment
  //pi_node_url: "http://10.11.0.112:3000",

  platform_url:'http://apdev.epsoftinc.in',
  schema_registry_url:"http://10.11.0.101:8081",
  alerts_url:'http://alertsdev.epsoftinc.in',

 // Aiotal redirection urls
  myaccount_url : "http://eiapclouddev.epsoftinc.in/#/activation",
  logout_url: 'http://eiapclouddev.epsoftinc.in/#/activation',
  redirectout_url: 'http://eiapclouddev.epsoftinc.in/#/signout',
  platform_home_url: 'http://eiapclouddev.epsoftinc.in/#/',
  projectendpoint_url:'http://10.11.0.107:8282',
  subscriptionendpoint_url:'http://subscriptiondev.epsoftinc.in',
// PI Connectors
  connector_topic: 'nodeDev',

//BPMN Platform URL
  bpmnplatformUrl : "http://10.11.0.127:8080",

//DB Connector
  dbConnectorHost: "10.11.0.113",
  dbName: "asimov_aiotal",

//camunda navigation 
camunda_url : "http://10.11.0.127:8080",

  //  * QA ENV URl's
  //   pi_url: 'http://piqa.epsoftinc.in',
  //   bps_url: 'http://bpsqa.epsoftinc.in',
  //   rpa_url: 'http://rpaqa.epsoftinc.in',
  //   loopback_url: 'http://10.11.0.107:3000',
  //   idm_url:'http://10.11.0.108:8888',
  //   pi_node_url: "http://10.11.0.108:3000",
  //     pi_node_jobs: "http://10.11.0.108:5000",
  //   auth_url: "http://authqa.epsoftinc.in",
  //   platform_url:'http://apqa.epsoftinc.in',
  //   schema_registry_url:"http://10.11.0.101:8081",
  //   alerts_url:'http://alertsqa.epsoftinc.in',

  // // Aiotal redirection urls
  //  myaccount_url : "http://eiapcloudqa.epsoftinc.in/#/activation",
  //  logout_url: 'http://eiapcloudqa.epsoftinc.in/#/activation',
  // redirectout_url: 'http://eiapcloudqa.epsoftinc.in/#/signout',
  // platform_home_url: 'http://eiapcloudqa.epsoftinc.in/#/',

  // // PI Connectors
  //  connector_topic: 'nodeq',

  // //DB Connector
  //  dbConnectorHost: "10.11.0.104",
  //  dbName: 'eiap_qa',

  // // BPMN Platform(camunda) URL
  //   bpmnplatformUrl : "http://10.11.0.128:8080",

  //camunda navigation 
  // camunda_url : "http://10.11.0.128:8080",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
