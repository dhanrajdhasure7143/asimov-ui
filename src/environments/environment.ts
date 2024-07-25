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
    // cloud-ui redirection urls
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
    isCopilotEnable : true,
    isSubscrptionEnabled : true,
    isSubscriptionModuleEnable:true, // this boolen to enable subscription module in side bar
    isCustomerBots : true,
    environmentName: "DEV",
    // Asimov-ui URl to redirect from stripe to application
    paymentSuccessURL: "http://epsoftiap.internaldev.ai/#/pages/success",
    paymentFailuerURL: "http://epsoftiap.internaldev.ai/#/pages/subscriptions",
    stripeKey:"pk_test_51K5EsdSGPu394velvnjppO7wSsy1J1RLBGQ9wsHR2r6MnZvZmOXbP8laJ1vVaAgQFayDJeNJea1qyxwJyyWjrS7f00q4AByMTq",

    python_llm:"http://llmpython.dev.epsoftinc.in/",
    ezaskUrl:"http://localhost:51952/",
    ezChatBotKey:"2HWmb5poa3BIcOunc329hfFTLrGHNx2iiXi1UaTGDi4HqdQtGhP8DgCHUG35UpiJ5reRkXfbhLV9qWSUZJGIfm2BB6OQKyAZCNA=",
    product:"AiAgents"
  };