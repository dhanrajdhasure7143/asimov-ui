// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  pi_url: "http://pi.qa.epsoftinc.in",
  bps_url: "http://bps.qa.epsoftinc.in",
  rpa_url: "http://rpa.qa.epsoftinc.in",
  loopback_url: "http://10.11.0.107:3000",
  idm_url: "http://idm.qa.epsoftinc.in",
  auth_url: "http://authservices.qa.epsoftinc.in",
  //for Auto build
  pi_node_url: "http://pinode.qa.epsoftinc.in",
  pi_node_jobs: "http://pi-node-jobs:5000",
  platform_url: "http://aiotalplatform.qa.epsoftinc.in",
  schema_registry_url: "http://schema-registry:8081",
  alerts_url: "http://alerts.qa.epsoftinc.in",
  // Aiotal redirection urls
  myaccount_url: "http://ezflow.qa.epsoftinc.in/#/activation",
  logout_url: "http://ezflow.qa.epsoftinc.in/#/activation",
  redirectout_url: "http://ezflow.qa.epsoftinc.in/#/signout",
  platform_home_url: "http://ezflow.qa.epsoftinc.in/#/",
  projectendpoint_url: "http://pcs.qa.epsoftinc.in",
  subscriptionendpoint_url: "http://subscription.qa.epsoftinc.in",
  //BPMN Platform URL
  bpmnplatformUrl: "http://ezworkflow.qa.epsoftinc.com",
  // camunda navigation
  camunda_url: "http://ezworkflow.qa.epsoftinc.com",
  //A-Square/Copilot
  asquare:"http://asquare.qa.epsoftinc.in",
  // Data upload path
  data_path: "/usr/share/confluent-ftp-data",
  // PI Connectors
  connector_topic: "nodeq",
  //DB Connector
  dbConnectorHost: "pgpoolqa",
  dbName: "eiap_qa",
  dbPort: "5432",
  //RPA WebActions Action AttrId
  webActionAttrId: 580,
  //IPCTenant
  ipcTenant: "c5611383-58c1-4677-839c-a337c9fb102c",
  isChatEnable : true,
  isProcessLogsEnable: true,
  isCopilotEnable : true,
  isSubscrptionEnabled : true,
  isSubscriptionModuleEnable:true, // this boolen to enable subscription module in side bar
  isCustomerBots : true,
  environmentName: "QA",
      // Asimov-ui URl to redirect from stripe to application
  paymentSuccessURL: "http://eziap.qa.epsoftinc.in/#/pages/success",
  paymentFailuerURL: "http://eziap.qa.epsoftinc.in/#/",
  stripeKey:"pk_test_51MnxmQIGBQXHW84IJAWLNX28SJ2JOgyWYhAfZ5Y8mKQzKOZ7SrfQ1ZNmDEcVRrLT3lJti7Qo5jBBxM5AP6n5xVbQ00b9w1UMfK",
  // python_llm:"http://ezflowllm.qa.epsoftinc.com",
  python_llm:"http://10.11.0.77:5006",
  ezaskUrl: "http://ezask.qa.epsoftinc.in",
  ezChatBotKey:"0RsxA5iDRyJg2kIJF91sHykOFng0qfQo5WnfLahWspb+C7QCS5JXREVmQoNxazwVDgcsKyI+2/zjdI5p9GgnxYHS91V+NBNXtNg=",
  product:"AiAgents"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
