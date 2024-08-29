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
import { UserIdleModule } from 'angular-user-idle';
import { RedirectionComponent } from './rediraction/redirection.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TitleCasePipe } from '@angular/common';
import { MentionModule } from 'angular-mentions';
import { ApprovalsComponent } from './approvals/approvals.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SharedModule } from './shared/shared.module';
import { ToastModule } from "primeng/toast";
import { toastMessages } from './shared/model/toast_messages';
import { SoApprovalComponent } from './so-approval/so-approval.component';
import {StepsModule} from 'primeng/steps';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RedirectionComponent,
    ApprovalsComponent,
    SoApprovalComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
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
    UserIdleModule.forRoot({idle: 7200, timeout: 1, ping: 1740}),
    NgxSpinnerModule,
    MentionModule,
    MatToolbarModule,
    SharedModule,
    ToastModule,
    StepsModule,
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    BackendURLProvider,
    GlobalScript,
    NotifierService,
    TitleCasePipe,
    toastMessages
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
