import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DynamicDashboardComponent } from './dynamic-dashboard/dynamic-dashboard.component';
import { ConfigureDashboardComponent} from './configure-dashboard/configure-dashboard.component'
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { CreateDashboardComponent } from './create-dashboard/create-dashboard.component';
import { MyFilterPipe } from './pipe/my-filter.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ProjectsModule } from '../projects/projects.module';
import { AngularSplitModule } from 'angular-split';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    DynamicDashboardComponent,
    ConfigureDashboardComponent,
    CreateDashboardComponent,
    MyFilterPipe
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
   PrimengCustomModule,
   FormsModule,
   ReactiveFormsModule, 
   BsDropdownModule.forRoot(),
   ProjectsModule,
   AngularSplitModule.forRoot(),
   SharedModule
  ],
  providers: [toastMessages],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DashboardModule { }
