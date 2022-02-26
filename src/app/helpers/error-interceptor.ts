import { Injectable,Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services';
import { Router } from '@angular/router';
import { APP_CONFIG } from 'src/app/app.config';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService,private router: Router,
        @Inject(APP_CONFIG) private config) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
        //    console.log(err);
           this.checkErrorCodes(err, request)
           
           const error = err.error.message || err.statusText;
           //console.log(error);
           return throwError(err);
        }));
    }

    checkErrorCodes(err, reqUrl?){
        var _self = this;
        //   console.log(err);
        if (reqUrl.url.indexOf('/api/login/beta/accessToken') < 0 && err.message.indexOf('oauth') < 0 && err.status === 401) {
            if(err.error.errorMessage){
                this.authenticationService.logout();
                //  _self.router.navigate(['/timeout']);
                location.reload();
                 window.location.href=this.config.platform_home_url+'timeout'
            } 
       } else if (err.status === 502 || err.status === 503 || err.status === 504)  {
            this.authenticationService.logout();
            location.reload();
            // window.location.href="http://eiapclouddev.epsoftinc.in/#/badgateway"
            window.location.href=this.config.platform_home_url+'badgateway'
       } else if (err.status === 403) {
            this.authenticationService.logout();
            _self.router.navigate(['/redirect']);
       } else if(err.status === 405) {
            Swal.fire({
                title: 'Error',
                text: "Method Not Allowed.",
                icon: 'error',
                showCancelButton: false,
                allowOutsideClick: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
            }).then((result) => {
                this.authenticationService.logout();
                _self.router.navigate(['/redirect']);
            })   
       }      
    }

    // checkErrorCodes(err,reqUrl?){
    //     if (err.status === 401) {//err.message.indexOf('oauth') < 0 && 
    //         this.authenticationService.logout();
    //         this.authenticationService.loginExpired();
    //     } if (err.status === 504)  {
    //         this.authenticationService.logout();
    //         this.authenticationService.backendServerDown();
    //     } if (err.status === 403)  {
    //         this.authenticationService.logout();
    //         this.authenticationService.forbiddenAccess();
    //     }
    // }
}
