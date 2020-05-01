import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { SharedModule } from '../../shared/shared.module';
import { ApprovalWorkflowComponent } from './approval-workflow.component';
import { ApprovalWorkflowRoutingModule } from './approval-workflow-routing.module';
import { BpmnDiagramListComponent } from './bpmn-diagram-list/bpmn-diagram-list.component';



@NgModule({
  declarations: [ApprovalWorkflowComponent, BpmnDiagramListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule,
    ApprovalWorkflowRoutingModule
  ]
})
export class ApprovalWorkflowModule { }
