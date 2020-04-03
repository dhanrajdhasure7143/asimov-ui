import { APP_CONFIG } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BackendURLInterceptor implements HttpInterceptor {

    constructor(@Inject(APP_CONFIG) private config) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.setLocalStorage(req);
        //authentication service logic - post integration with AIOTAL
        req = req.clone({
            url : this.getRequestUrl(req) + req.url,
            body: req.body,
            headers: req.headers,
            // responseType: 'arraybuffer'
        });
        return next.handle(req);
    }

    setLocalStorage(req){
        if (!localStorage.getItem('userName'))
            localStorage.setItem('userName', req.body['username']);
    }

    getRequestUrl(req){
        let url = "";
        if(req.url.indexOf('bpsprocess') > -1)
            url = this.config.bussinessProcessEndPoint + req.url;
        if(req.url.indexOf('bpsprocess') == -1 && req.url.indexOf('upload') > -1)
            url = this.config.bussinessProcessEndPoint + req.url;
        return url;
    }
}

export let BackendURLProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: BackendURLInterceptor,
    multi: true
};
