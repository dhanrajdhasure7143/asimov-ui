import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { ServiceOrchestrationRoutingModule } from './service-orchestration-routing.module';
import { ServiceOrchestrationComponent } from './service-orchestration.component';
import { OrchestrationComponent } from './orchestration/orchestration.component';
import { BotStatusComponent } from './orchestration/bot-status/bot-status.component';
import { BotManagementComponent } from './orchestration/bot-management/bot-management.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [OrchestrationComponent, BotStatusComponent, BotManagementComponent, ServiceOrchestrationComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ServiceOrchestrationRoutingModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ],
  providers:[]
})
export class ServiceOrchestrationModule { 
}
