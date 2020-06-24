import { APP_CONFIG } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BackendURLInterceptor implements HttpInterceptor {

    constructor(@Inject(APP_CONFIG) private config) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // this.setLocalStorage(req);
        //authentication service logic - post integration with AIOTAL
        req = req.clone({
            url : this.getRequestUrl(req),
            body: req.body,
            headers:  new HttpHeaders({'Authorization': 'Bearer '+localStorage.getItem("accessToken")})
        });
        return next.handle(req);
    }

    setLocalStorage(req){
        if (!localStorage.getItem('userName'))
            localStorage.setItem('userName', req.body['username']);
    }

    getRequestUrl(req){
        let url = "";
        if(req.url.indexOf('rpa-service') > -1)
            url = this.config.rpaEndPoint + req.url;
        else if(req.url.indexOf('bpsprocess') > -1)
            url = this.config.bussinessProcessEndPoint + req.url;
        else if(req.url.indexOf('processintelligence') > -1)
            url = this.config.processIntelligenceEndPoint + req.url;
        else if(req.url.indexOf('ReddisCopy') > -1)
        url = this.config.processIntelligenceNodeEndPoint + req.url;
        else if(req.url.indexOf('accessToken') > -1)
            url = this.config.accessTokenEndPoint + req.url;
        return url;
    }
}

export let BackendURLProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: BackendURLInterceptor,
    multi: true
};
