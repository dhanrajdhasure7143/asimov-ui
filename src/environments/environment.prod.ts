export const environment = {
  production: false,

  pi_url: "https://ezflow.epsoftinc.com/prcintel",
  bps_url: "https://ezflow.epsoftinc.com/bpstudio",
  rpa_url: "https://ezflow.epsoftinc.com/wfrpa",
  loopback_url: "http://10.11.0.107:3000",
  idm_url: "https://ezflow.idm.epsoftinc.com",
  auth_url: "https://ezflow.epsoftinc.com/authservices",
  pi_node_url: "https://ezflow.epsoftinc.com/pinode",
  platform_url: "https://ezflow.epsoftinc.com/aiotalplatform",
  schema_registry_url: "http://schema-registry:8081",
  alerts_url: "https://ezflow.epsoftinc.com/alerts",
  subscriptionendpoint_url: "https://ezflow.epsoftinc.com/subscriptions",
  // Aiotal redirection urls
  myaccount_url: "https://ezflow.epsoftinc.com/#/activation",
  logout_url: "https://ezflow.epsoftinc.com/#/activation",
  redirectout_url: "https://ezflow.epsoftinc.com/#/signout",
  platform_home_url: "https://ezflow.epsoftinc.com/#/",
  pi_node_jobs: "http://pi-node-jobs:5000",
  projectendpoint_url: "https://ezflow.epsoftinc.com/pcs",
  socialLoginRedirectURL: "https://ezflow.epsoftinc.com/#/user",
  // camunda navigation
  camunda_url: "https://ezworkflow.dev.epsoftinc.com",
  //A-Square/Copilot
  asquare:"https://ezflow.epsoftinc.com/a-square",
  // Data upload path
  data_path: "/usr/share/confluent-ftp-data",
  // PI Connectors
  connector_topic: "nodeq",
  //DB Connector
  dbConnectorHost: "pg-0",
  dbName: "eiap_prod",
  dbPort: "5432",
  //RPA WebActions Action AttrId
  webActionAttrId: 580,
  //IPCTenant
  ipcTenant: "55d76780-77f1-4f1c-8762-e0c13a0b8613",
  isChatEnable : false,
  isProcessLogsEnable: false,
  isCopilotEnable : false,
  isSubscrptionEnabled : true,
  isSubscriptionModuleEnable:false, // this boolen to enable subscription module in side bar
  isCustomerBots : false,
  environmentName: "PROD",
  paymentSuccessURL: "http://epsoftiap.internal.ai/#/pages/success",
  paymentFailuerURL: "http://epsoftiap.internal.ai/#/",
  cardCancelURL: "http://epsoftiap.internal.ai/#/pages/subscriptions?index=3",
  stripeKey:"pk_test_51P0dtDEOiwtmEOoZ8Gxk01D1Lk5WhvdU6YgegYEiUHrmjLqfGLouxVbhwYgjWDylLK8kZ7LLaiDeKqKs15DAfIpB00KPmGpaAo",
  python_llm:"https://ezflowllm.epsoftinc.com",
  ezaskUrl: "http://ezask.epsoftinc.in",
  ezChatBotKey:"0G+A+Bax5YcLbl1309krz5iqDPQFeJpGwMVTbdKpyRt7y+0a7Yj/5b1HF/JLVSyJver2HkHERDW4jjjHwSK2gczj/QCdMTQYB9o=",
  product:"AiAgents",
  isWebhookEnabled: true,
};
