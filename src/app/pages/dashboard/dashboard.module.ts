import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ProcessOwnerComponent } from './process-owner/process-owner.component';
import { DashboardComponent } from './dashboard.component';
import { MatProgressBarModule } from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { ProcessAnalystComponent } from './process-analyst/process-analyst.component';
import { ProcessArchitectComponent } from './process-architect/process-architect.component';
import {MatSidenavModule} from '@angular/material/sidenav';


@NgModule({
  declarations: [
      ProcessOwnerComponent,
      DashboardComponent,
      ProcessAnalystComponent,
      ProcessArchitectComponent
    ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatProgressBarModule,
    NgxPaginationModule,
    NgbModule,
    MatSidenavModule,
    JwtModule.forRoot({
      config: {
        tokenGetter:  () => localStorage.getItem('accesstoken')
      }
    }),
  ]
})
export class DashboardModule { }
