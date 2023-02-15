import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DynamicDashboardComponent } from './dynamic-dashboard/dynamic-dashboard.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DynamicDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
