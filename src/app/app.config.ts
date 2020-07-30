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
};
