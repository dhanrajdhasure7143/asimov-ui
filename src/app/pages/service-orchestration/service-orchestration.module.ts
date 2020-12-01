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
import {MatInputModule, MatIconModule, MatFormFieldModule, MatNativeDateModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { SoAutomatedTasksComponent } from './orchestration/so-automated-tasks/so-automated-tasks.component';
import { SoBotManagementComponent } from './orchestration/so-bot-management/so-bot-management.component';
import { SoDashboardComponent, FilterBy } from './orchestration/so-dashboard/so-dashboard.component';
import { CronEditorModule } from 'src/app/shared/cron-editor/cron-editor.module';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { SoSchedulerComponent } from './orchestration/so-scheduler/so-scheduler.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  declarations: [OrchestrationComponent,
    BotStatusComponent,
    FilterBy,
    BotManagementComponent, ServiceOrchestrationComponent, SoAutomatedTasksComponent, SoBotManagementComponent, SoDashboardComponent, SoSchedulerComponent],
  imports: [
    CommonModule,
    FormsModule,
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
    FormsModule,
    NgbTimepickerModule,
    NgxSpinnerModule,
    MatInputModule, MatIconModule, MatFormFieldModule,MatButtonModule,
    MatProgressSpinnerModule, MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    NgxChartsModule,
    MatMenuModule,
    MatDialogModule
  ],
  entryComponents: [FilterBy],
  providers:[MatDatepickerModule],
})
export class ServiceOrchestrationModule {
}
