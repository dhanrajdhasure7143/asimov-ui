import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AiAgentsRoutingModule } from './ai-agents-routing.module';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { AiAgentsComponent } from './ai-agents.component';
import { AiAgentFormComponent } from './ai-agent-form/ai-agent-form.component';
import { AiAgentHomeComponent } from './ai-agent-home/ai-agent-home.component';
import { PredefinedBotsOrchestrationComponent } from './predefined-bots-orchestration/predefined-bots-orchestration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AiAgentSchedulerComponent } from './ai-agent-scheduler/ai-agent-scheduler.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CronEditorModule } from 'src/app/shared/cron-editor/cron-editor.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { AiAgentLogsComponent } from './ai-agent-logs/ai-agent-logs.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { columnList } from 'src/app/shared/model/table_columns';
import { AiAgentCronComponent } from './ai-agent-scheduler/ai-agent-cron/ai-agent-cron.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { AiAgentSubAgentsComponent } from './ai-agent-sub-agents/ai-agent-sub-agents.component';
import { AiAgentAddAgentsDialogComponent } from './ai-agent-add-agents-dialog/ai-agent-add-agents-dialog.component';
import { AiAgentHomeScreenComponent } from './ai-agent-home-screen/ai-agent-home-screen.component';
import { AiAgentFormOldComponent } from './ai-agent-form-old/ai-agent-form-old.component';



@NgModule({
  declarations: [
    AiAgentsComponent,
    AiAgentFormComponent,
    AiAgentHomeComponent,
    PredefinedBotsOrchestrationComponent,
    AiAgentSchedulerComponent,
    AiAgentLogsComponent,
    AiAgentCronComponent,
    AgentDetailsComponent,
    AiAgentSubAgentsComponent,
    AiAgentAddAgentsDialogComponent,
    AiAgentHomeScreenComponent,
    AiAgentFormOldComponent,
  ],
  imports: [
    CommonModule,
    AiAgentsRoutingModule,
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
    SharedModule,
    NgxStripeModule.forRoot(environment.stripeKey)
  ],
  providers: [toastMessages, BsModalRef, BsModalService, columnList, DatePipe]
}) 
export class AiAgentsModule { }
