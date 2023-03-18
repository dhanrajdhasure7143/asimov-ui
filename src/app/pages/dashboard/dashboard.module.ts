import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DynamicDashboardComponent } from './dynamic-dashboard/dynamic-dashboard.component';
import { ConfigureDashboardComponent} from './configure-dashboard/configure-dashboard.component'
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { CreateDashboardComponent } from './create-dashboard/create-dashboard.component';
import { NgChartsModule } from 'ng2-charts';




@NgModule({
  declarations: [
    DashboardComponent,
    DynamicDashboardComponent,
    ConfigureDashboardComponent,
    CreateDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
   PrimengCustomModule,
   FormsModule,
   ReactiveFormsModule ,
   NgChartsModule

 
 
 
 
  
  
   
  
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DashboardModule { }
