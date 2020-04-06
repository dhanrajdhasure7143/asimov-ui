import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
           this.checkErrorCodes(err);
            return throwError(err);
        }));
    }

    checkErrorCodes(err){
        if (err.status === 401) {//err.message.indexOf('oauth') < 0 && 
            this.authenticationService.logout();
            this.authenticationService.loginExpired();
        } if (err.status === 504)  {
            this.authenticationService.logout();
            this.authenticationService.backendServerDown();
        } if (err.status === 403)  {
            this.authenticationService.logout();
            this.authenticationService.forbiddenAccess();
        }
    }
}
