import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotifierModule, NotifierService } from "angular-notifier";
// import { APP_BASE_HREF } from '@angular/common';
import { APP_CONFIG, AppConfig } from './app.config';
import { ErrorInterceptor, BackendURLProvider } from './helpers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GlobalScript } from './shared/global-script';
import { LoaderService } from './services/loader/loader.service';
import { LoaderInterceptor } from './helpers/loader-interceptor.service';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { UserIdleModule } from 'angular-user-idle';
import { RedirectionComponent } from './rediraction/redirection.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RedirectionComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NotifierModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12,
        },
        vertical: {
          position: 'bottom',
          distance: 20,
          gap: 20,
        },
      },
      behaviour: {
        autoHide: 2000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4,
      },
    
    }),

    BackButtonDisableModule.forRoot(),
    UserIdleModule.forRoot({idle: 1800, timeout: 1, ping: 1740}),
    NgxSpinnerModule,
    ToastrModule.forRoot({timeOut: 5000,disableTimeOut : false,extendedTimeOut:3000,
      positionClass: 'toast-top-full-width',maxOpened:1,autoDismiss:true}), // ToastrModule added
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    BackendURLProvider,
    GlobalScript,
    NotifierService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
