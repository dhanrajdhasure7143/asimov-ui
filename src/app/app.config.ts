import { InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';

export let APP_CONFIG = new InjectionToken('app.config');

export interface AsimovAppConfig {
    processIntelligenceEndPoint: string;
    processIntelligenceNodeEndPoint: string;
    bussinessProcessEndPoint: string;
    rpaEndPoint:string;
    loopbackHost: string;
    imagePath: string;
    isProduction: boolean;
    accessTokenEndPoint:string;
    authorizationEndPoint:string;
    aiotalMyAccountRedirectionURL: string;
    logoutRedirectionURL: string;
    piConnector:string;
    dbHostName:string;
    dbName:string;
    platformEndPoint:string;
    schemaRegistryEndPoint:string;
    dataPath:string;
    alertsEndPoint:string;
    bpmPlatfromUrl:string;
    signoutRedirectionURL:any;
    piNodeJobsURL: string;
    platform_home_url:string;
    projectendpoint_url:string;
    camundaUrl:string;
    subscriptionendpoint_url:string;
    pigraphfreetraillimit:number;
    rpabotfreetraillimit:number;
    bpsprocessfreetraillimit:number;
    projectfreetraillimit:number;
}

export const AppConfig: AsimovAppConfig = {
    processIntelligenceEndPoint: environment.pi_url,//pi_url
    processIntelligenceNodeEndPoint: environment.pi_node_url,
    bussinessProcessEndPoint: environment.bps_url,//bps_url
    rpaEndPoint: environment.rpa_url,
    accessTokenEndPoint:environment.idm_url,
    authorizationEndPoint:environment.auth_url,
    loopbackHost: environment.loopback_url,
    imagePath: '', 
    isProduction: true,
    aiotalMyAccountRedirectionURL: environment.myaccount_url,
    logoutRedirectionURL: environment.logout_url,
    piConnector:environment.connector_topic,
    dbHostName:environment.dbConnectorHost,
    dbName:environment.dbName,
    platformEndPoint:environment.platform_url,
    schemaRegistryEndPoint:environment.schema_registry_url,
    dataPath:environment.data_path,
    alertsEndPoint:environment.alerts_url,
    bpmPlatfromUrl:environment.bpmnplatformUrl,
    signoutRedirectionURL: environment.redirectout_url,
    piNodeJobsURL: environment.pi_node_jobs,
    platform_home_url:environment.platform_home_url,
    projectendpoint_url:environment.projectendpoint_url,
    camundaUrl:environment.camunda_url,
    subscriptionendpoint_url:environment.subscriptionendpoint_url,
    pigraphfreetraillimit:1,
    rpabotfreetraillimit:1,
    bpsprocessfreetraillimit:1,
    projectfreetraillimit:1,
};
