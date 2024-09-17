// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
  
    pi_url: "http://pi.dev.epsoftinc.in",
    bps_url: "http://bps.dev.epsoftinc.in",
    rpa_url: "http://rpa.dev.epsoftinc.in",
    loopback_url: "http://10.11.0.107:3000",
    idm_url: "http://idm.dev.epsoftinc.in",
    auth_url: "http://authservices.dev.epsoftinc.in",
    //for Auto build
    pi_node_url: "http://pinode.dev.epsoftinc.in",
    pi_node_jobs: "http://pi-node-jobs:5000",
    platform_url: "http://aiotalplatform.dev.epsoftinc.in",
    schema_registry_url: "http://schemadev-registry:8081",
    alerts_url: "http://alerts.dev.epsoftinc.in",
    // Aiotal redirection urls
    myaccount_url: "http://epsoft.internaldev.ai/#/activation",
    logout_url: "http://epsoft.internaldev.ai/#/activation",
    redirectout_url: "http://epsoft.internaldev.ai/#/signout",
    platform_home_url: "http://epsoft.internaldev.ai/#/",
    projectendpoint_url: "http://pcs.dev.epsoftinc.in",
    subscriptionendpoint_url: "http://subscription.dev.epsoftinc.in",
    // camunda navigation
    camunda_url: "http://ezworkflow.dev.epsoftinc.com",
    //A-Square/Copilot
    asquare:"http://asquare.dev.epsoftinc.in",
    // Data upload path
    data_path: "/usr/share/confluent-ftp-data",
    // PI Connectors
    connector_topic: "nodeDev",
    //DB Connector
    dbConnectorHost: "pgpooldev",
    dbName: "eiap_dev",
    dbPort: "5432",
    //RPA WebActions Action AttrId
    webActionAttrId: 536,
    //IPCTenant
    ipcTenant: "28b22b35-9dc5-4860-b5b5-559855d9618c",
    isChatEnable : true,
    isProcessLogsEnable: true,
    isCopilotEnable : false,
    isSubscrptionEnabled : true,
    isSubscriptionModuleEnable:true, // this boolen to enable subscription module in side bar
    isCustomerBots : false,
    environmentName: "DEV",
    // Asimov-ui URl to redirect from stripe to application
    paymentSuccessURL: "http://epsoftiap.internaldev.ai/#/pages/success",
    paymentFailuerURL: "http://epsoftiap.internaldev.ai/#/",
    cardCancelURL: "http://epsoftiap.internaldev.ai/#/pages/subscriptions?index=3",
    stripeKey:"pk_test_51PjIMqJZCEXZ8Zrct2ntJVGOgqwWLvEBFV7DUJwm7nLEwoNpKClC2GuDs3CPUUedXpv5m0pDTHLJwJKrFQC9fg1I00zKCS3psO",
    python_llm:"http://llmpython.dev.epsoftinc.in",
    ezaskUrl: "http://ezask.dev.epsoftinc.in",
    ezChatBotKey:"1STWkvY7eRPyOmOUq5kHRfGQ4u2rX4+vq6cAXyw3smk+jCjVtj2p9iF9xEfqRLbgDjNn1uM+q4B615AGqG1tIeDpntAvP1MKN38=",
    product:"AiAgents"
  };