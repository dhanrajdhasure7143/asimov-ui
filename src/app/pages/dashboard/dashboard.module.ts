import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DynamicDashboardComponent } from './dynamic-dashboard/dynamic-dashboard.component';
import { ConfigureDashboardComponent} from './configure-dashboard/configure-dashboard.component'
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule } from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CreateDashboardComponent } from './create-dashboard/create-dashboard.component';
import {DropdownModule} from 'primeng/dropdown';



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
   MatIconModule,
   MatMenuModule,
   MatButtonModule,
   DropdownModule
 
 
 
  
  
   
  
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DashboardModule { }
