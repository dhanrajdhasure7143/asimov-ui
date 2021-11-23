import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTabsModule } from '@angular/material';

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
import {Ng2TelInputModule} from 'ng2-tel-input';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule } from 'ngx-pagination';
import {MatExpansionModule} from '@angular/material/expansion';

import { NewSoDashboardComponent } from './service-orchestration/orchestration/new-so-dashboard/new-so-dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { sohints } from './service-orchestration/orchestration/model/new-so-hints';
import { ProgramComponent } from './program/programlandingpage.component';
import { ProgramcreationComponent } from './programcreation/programcreation.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ProcessArchitectComponent } from './dashboards/process-architect/process-architect.component';
import { ProcessOwnerComponent } from './dashboards/process-owner/process-owner.component';
import { MatProgressBarModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { ProcessAnalystComponent } from './dashboards/process-analyst/process-analyst.component';
@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MyLoaderComponent,
    HeaderDropdownOverlayComponent,
    SidebarComponent,
    NewSoDashboardComponent,
    ProgramComponent,
    ProgramcreationComponent,
    ProcessArchitectComponent,
    ProcessOwnerComponent,
    ProcessAnalystComponent,
    
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    Ng2TelInputModule,
    SharedModule,
    MatTabsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    MatExpansionModule,
    MatListModule,MatMenuModule,MatButtonModule,MatIconModule,MatToolbarModule,MatSidenavModule,MatTooltipModule,
     JwtModule.forRoot({
      config: {
        tokenGetter:  () => localStorage.getItem('accesstoken')
      }
    }),
    NgbModule,
    MatProgressBarModule
  ],
  providers: [SharebpmndiagramService, PagesHints,sohints
  //  LoaderService,
  //  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
]
})
export class PagesModule { }
