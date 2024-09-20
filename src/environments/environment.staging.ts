export const environment = {
  production: false,
  pi_url: 'https://ezflow.staging.epsoftinc.com/prcintel',
  bps_url: 'https://ezflow.staging.epsoftinc.com/bpstudio',
  rpa_url: 'https://ezflow.staging.epsoftinc.com/wfrpa',
  loopback_url: 'http://10.11.0.107:3000',
  idm_url:'https://ezidm.staging.epsoftinc.com',
  auth_url: "https://ezflow.staging.epsoftinc.com/authservices",
  pi_node_url: "https://ezflow.staging.epsoftinc.com/pinode",
  platform_url:'https://ezflow.staging.epsoftinc.com/aiotalplatform',
  schema_registry_url:"http://schema-registry:8081",
  alerts_url:'https://ezflow.staging.epsoftinc.com/alerts',
  subscriptionendpoint_url:'https://ezflow.staging.epsoftinc.com/subscriptions',

  // Aiotal redirection urls 
  myaccount_url : "https://ezflow.staging.epsoftinc.com/#/activation",
  logout_url: 'https://ezflow.staging.epsoftinc.com/#/activation', 
  redirectout_url: 'https://ezflow.staging.epsoftinc.com/#/signout',
  
  // PI Connectors
  connector_topic: 'nodeq',
  platform_home_url: 'https://ezflow.staging.epsoftinc.com/#/',
  pi_node_jobs: "http://pi-node-jobs:5000",
  projectendpoint_url:'https://ezflow.staging.epsoftinc.com/pcs',
  camunda_url : "https://ezworkflow.staging.epsoftinc.com",
  socialLoginRedirectURL: 'https://ezflow.staging.epsoftinc.com/#/user',
  //A-Square/Copilot
  asquare:"https://ezflow.staging.epsoftinc.com/a-square",

  //DB Connector
  dbConnectorHost: "pg-0",
  dbName: "eiap_uat",

  // Data upload path
  data_path:"/usr/share/confluent-ftp-data",

  //BPMN Platform URL
  bpmnplatformUrl : "https://ezworkflow.staging.epsoftinc.com",
  
  webActionAttrId:580,
  
  //IPCTenant
  ipcTenant:"55d76780-77f1-4f1c-8762-e0c13a0b8613",
  isChatEnable : false,
  isProcessLogsEnable: false,
  isCopilotEnable : false,
  isSubscrptionEnabled : true,
  isSubscriptionModuleEnable:true, // this boolen to enable subscription module in side bar
  isCustomerBots : false,
  environmentName: "staging",
  paymentSuccessURL: "http://epsoftiap.internaluat.ai/#/pages/success",
  paymentFailuerURL: "http://epsoftiap.internaluat.ai/#/",
  cardCancelURL: "http://epsoftiap.internaluat.ai/#/pages/subscriptions?index=3",
  stripeKey:"pk_test_51P0dsYGtSXyupRk8b6KzrZkX2YsNl0HOLhVeZYrL6S12RR4rZd9CGa8O7ckFJLh3kZ3foGrmVdkewcq8cyYTVecj00dG5Dqo2P",
  python_llm:"https://ezflowllm.staging.epsoftinc.com",
  ezaskUrl: "http://ezask.staging.epsoftinc.in",
  ezChatBotKey:"0G+A+Bax5YcLbl1309krz5iqDPQFeJpGwMVTbdKpyRt7y+0a7Yj/5b1HF/JLVSyJver2HkHERDW4jjjHwSK2gczj/QCdMTQYB9o=",
  product:"AiAgents",
  isWebhookEnabled: true,
};