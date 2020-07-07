import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ApprovalWorkflowComponent } from './approval-workflow.component';
import { ApprovalWorkflowRoutingModule } from './approval-workflow-routing.module';
import { BpmnDiagramListComponent } from './bpmn-diagram-list/bpmn-diagram-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ApprovalHomeHints } from './bpmn-diagram-list/model/bpmn_approval_workflow';
import {MatInputModule, MatIconModule, MatFormFieldModule, MatOptionModule, MatSelectModule} from '@angular/material';




@NgModule({
  declarations: [ApprovalWorkflowComponent, BpmnDiagramListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    ApprovalWorkflowRoutingModule,
    MatProgressSpinnerModule,
    MatInputModule, MatIconModule, MatFormFieldModule,
    MatOptionModule, MatSelectModule
  ],
  providers: [ApprovalHomeHints]
})

export class ApprovalWorkflowModule { }
