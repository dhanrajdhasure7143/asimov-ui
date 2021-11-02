import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedModule } from '../../shared/shared.module';
import { ServiceOrchestrationRoutingModule } from './service-orchestration-routing.module';
import { ServiceOrchestrationComponent } from './service-orchestration.component';
import { OrchestrationComponent } from './orchestration/orchestration.component';
import { BotStatusComponent } from './orchestration/bot-status/bot-status.component';
import { BotManagementComponent } from './orchestration/bot-management/bot-management.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule, MatIconModule, MatFormFieldModule, MatNativeDateModule, MatSlideToggleModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
// import { SoAutomatedTasksComponent,Checkbotslist,Checkhumanslist } from './orchestration/so-automated-tasks/so-automated-tasks.component';
// import { SoBotManagementComponent } from './orchestration/so-bot-management/so-bot-management.component';
import { Category,SoDashboardComponent,Slicedate, FilterBy } from './orchestration/so-dashboard/so-dashboard.component';
import { CronEditorModule } from 'src/app/shared/cron-editor/cron-editor.module';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { SoSchedulerComponent, Envname, Reverse } from './orchestration/so-scheduler/so-scheduler.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {NgxChartsModule } from '@swimlane/ngx-charts';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatDialogModule} from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SoProcesslogComponent } from './orchestration/so-processlog/so-processlog.component';

import {sohints} from './orchestration/model/new-so-hints';
import { SoInboxComponent } from './orchestration/so-inbox/so-inbox.component'


import { NewSoDashboardComponent } from './orchestration/new-so-dashboard/new-so-dashboard.component'
import { NewSoBotsComponent } from './orchestration/new-so-bots/new-so-bots.component';
import { NewSoManagementComponent } from './orchestration/new-so-management/new-so-management.component';
import { SoEnvironmentsComponent} from './orchestration/so-environments/so-environments.component';
import { SoHealthStatusComponent } from './orchestration/so-health-status/so-health-status.component';
import { SoEnvBlueprismComponent } from './orchestration/so-env-blueprism/so-env-blueprism.component';
import { SoEnvUipathComponent } from './orchestration/so-env-uipath/so-env-uipath.component';
import { SoEnvEpsoftComponent ,ipcustompipecreation } from './orchestration/so-env-epsoft/so-env-epsoft.component';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalModule, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SlicedateUpdate, SoUpdatedDashboardComponent,CategoryUpdate } from './orchestration/so-updated-dashboard/so-updated-dashboard.component';
import { Checkbotslist, Checkhumanslist, NewSoAutomatedTasksComponent } from './orchestration/new-so-automated-tasks/new-so-automated-tasks.component';
import { BotlistbycatPipe } from './orchestration/new-so-automated-tasks/botlistbycat.pipe';
import { HumanlistbycatPipe } from './orchestration/new-so-automated-tasks/humanlistbycat.pipe';
import { NewSoBotManagementComponent } from './orchestration/new-so-bot-management/new-so-bot-management.component';
import { StatisticsComponent } from './orchestration/new-so-bots/statistics/statistics.component';
import { MonitoringComponent } from './orchestration/new-so-bots/monitoring/monitoring.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SoMonitoringComponent } from './orchestration/so-monitoring/so-monitoring.component';
import { ScheduledBotsComponent } from './orchestration/scheduled-bots/scheduled-bots.component';
import { BotsComponent } from './orchestration/scheduled-bots/bots/bots.component';
import { ProcessesComponent } from './orchestration/scheduled-bots/processes/processes.component';
import { CheckResourcePipe } from './orchestration/new-so-automated-tasks/check-resource.pipe';
@NgModule({
  declarations: [OrchestrationComponent,ipcustompipecreation,
    BotStatusComponent,
    FilterBy,
    Category,
    Reverse,
    Slicedate,
    BotManagementComponent, ServiceOrchestrationComponent, SoDashboardComponent, SoSchedulerComponent, SoProcesslogComponent, BotlistbycatPipe, HumanlistbycatPipe, Envname, SoInboxComponent,
  NewSoBotsComponent,
  NewSoManagementComponent,
  NewSoAutomatedTasksComponent,
  SoEnvironmentsComponent,
  SoHealthStatusComponent,
  SoEnvBlueprismComponent,
  SoEnvUipathComponent,
  SoEnvEpsoftComponent,
    Checkbotslist,
    Checkhumanslist,
    SlicedateUpdate,
    CategoryUpdate,
    NewSoBotManagementComponent,
    StatisticsComponent,
    MonitoringComponent,
    SoMonitoringComponent,
    BotsComponent,
    ProcessesComponent,
    ScheduledBotsComponent,
    CheckResourcePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ServiceOrchestrationRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    CronEditorModule,
    MatNativeDateModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    NgbTimepickerModule,
    NgxSpinnerModule,
    MatInputModule, MatIconModule, MatFormFieldModule,MatButtonModule,MatSlideToggleModule,MatTooltipModule,MatProgressBarModule,
    MatProgressSpinnerModule, MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    NgxChartsModule,
    MatMenuModule,
    MatDialogModule,
    NgxPaginationModule,
    ModalModule.forRoot(),

  ],
  bootstrap: [SoDashboardComponent],
  entryComponents: [FilterBy],
  providers:[MatDatepickerModule,sohints, BsModalRef, BsModalService],
})
export class ServiceOrchestrationModule {
}