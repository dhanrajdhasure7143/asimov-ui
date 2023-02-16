import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DynamicDashboardComponent } from './dynamic-dashboard/dynamic-dashboard.component';
import { ConfigureDashboardComponent} from './configure-dashboard/configure-dashboard.component'
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { MatIconModule } from '@angular/material/icon';
// import { ChartModule } from 'primeng/chart';

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
   MatIconModule,
  
  
   
  
  ]
})
export class DashboardModule { }
