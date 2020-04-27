import { InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';

export let APP_CONFIG = new InjectionToken('app.config');

export interface AsimovAppConfig {
    processIntelligenceEndPoint: string;
    bussinessProcessEndPoint: string;
    rpaEndPoint:string;
    loopbackHost: string;
    imagePath: string;
    isProduction: boolean;
}

export const AppConfig: AsimovAppConfig = {
    processIntelligenceEndPoint: environment.local_url,//pi_url
    bussinessProcessEndPoint: 'http://bpsdev.epsoftinc.in/',//bps_url
    rpaEndPoint: environment.rpa_url,
    loopbackHost: environment.loopback_url,
    imagePath: '', 
    isProduction: true,
};
