import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DynamicDashboardComponent } from './dynamic-dashboard/dynamic-dashboard.component';
import { ConfigureDashboardComponent} from './configure-dashboard/configure-dashboard.component'
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
@NgModule({
  declarations: [
    DashboardComponent,
    DynamicDashboardComponent,
    ConfigureDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
   PrimengCustomModule,
   FormsModule,
   ReactiveFormsModule ,
  
  ]
})
export class DashboardModule { }
