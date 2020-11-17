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
import {MatInputModule, MatIconModule, MatFormFieldModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { SoAutomatedTasksComponent } from './orchestration/so-automated-tasks/so-automated-tasks.component';
import { SoBotManagementComponent } from './orchestration/so-bot-management/so-bot-management.component';
import { SoDashboardComponent } from './orchestration/so-dashboard/so-dashboard.component';
import { CronEditorModule } from 'src/app/shared/cron-editor/cron-editor.module';
@NgModule({
  declarations: [OrchestrationComponent,
    BotStatusComponent,
    BotManagementComponent, ServiceOrchestrationComponent, SoAutomatedTasksComponent, SoBotManagementComponent, SoDashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ServiceOrchestrationRoutingModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    CronEditorModule,
    FormsModule,
    NgxSpinnerModule,
    MatInputModule, MatIconModule, MatFormFieldModule,
    MatProgressSpinnerModule, MatSelectModule
  ],
  providers:[]
})
export class ServiceOrchestrationModule {
}
