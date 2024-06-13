import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PredefinedBotsRoutingModule } from './predefined-bots-routing.module';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { PredefinedBotsComponent } from './predefined-bots.component';
import { PredefinedBotsFormsComponent } from './predefined-bots-forms/predefined-bots-forms.component';
import { PredefinedBotsListComponent } from './predefined-bots-list/predefined-bots-list.component';
import { PredefinedBotsOrchestrationComponent } from './predefined-bots-orchestration/predefined-bots-orchestration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PredefinedSchedulerComponent } from './predefined-scheduler/predefined-scheduler.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CronEditorModule } from 'src/app/shared/cron-editor/cron-editor.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { PredefinedBotsLogsComponent } from './predefined-bots-logs/predefined-bots-logs.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { columnList } from 'src/app/shared/model/table_columns';
import { PredefinedCronComponent } from './predefined-scheduler/predefined-cron/predefined-cron.component';



@NgModule({
  declarations: [
    PredefinedBotsComponent,
    PredefinedBotsFormsComponent,
    PredefinedBotsListComponent,
    PredefinedBotsOrchestrationComponent,
    PredefinedSchedulerComponent,
    PredefinedBotsLogsComponent,
    PredefinedCronComponent
  ],
  imports: [
    CommonModule,
    PredefinedBotsRoutingModule,
    PrimengCustomModule,
    FormsModule,
    ReactiveFormsModule,
    CronEditorModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMaterialTimepickerModule,
    NgxPaginationModule,
    NgbTimepickerModule,
    MatDatepickerModule,
    SharedModule
  ],
  providers: [toastMessages, BsModalRef, BsModalService, columnList, DatePipe]
}) 
export class PredefinedBotsModule { }
