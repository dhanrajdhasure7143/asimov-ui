import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PortalModule } from '@angular/cdk/portal';

import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SharebpmndiagramService } from './services/sharebpmndiagram.service';
import { PagesHints } from './model/pages.model';
import { LoaderService } from '../services/loader/loader.service';
import { LoaderInterceptor } from '../helpers/loader-interceptor.service';
import { MyLoaderComponent } from './my-loader/my-loader.component';
import { HeaderDropdownOverlayComponent } from './header-dropdown-overlay/header-dropdown-overlay.component';
import { UserComponent } from './header-dropdown-overlay/user/user.component';
import { SystemComponent } from './header-dropdown-overlay/system/system.component';
import { NotificationComponent } from './header-dropdown-overlay/notification/notification.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MyLoaderComponent,
    HeaderDropdownOverlayComponent,
    UserComponent,
    SystemComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    Ng2TelInputModule,
    SharedModule,
    PortalModule
  ],
  providers: [SharebpmndiagramService, PagesHints,
  //  LoaderService,
  //  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
],
entryComponents:[UserComponent, SystemComponent, NotificationComponent]
})
export class PagesModule { }
