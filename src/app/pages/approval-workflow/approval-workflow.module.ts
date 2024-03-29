import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ApprovalWorkflowComponent } from './approval-workflow.component';
import { ApprovalWorkflowRoutingModule } from './approval-workflow-routing.module';
import { BpmnDiagramListComponent } from './bpmn-diagram-list/bpmn-diagram-list.component';
import { ApprovalHomeHints } from './bpmn-diagram-list/model/bpmn_approval_workflow';
import { OrderByPipe } from './oerderby-pipe';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { toastMessages } from 'src/app/shared/model/toast_messages';


@NgModule({
  declarations: [
    ApprovalWorkflowComponent, 
    BpmnDiagramListComponent, 
    OrderByPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ApprovalWorkflowRoutingModule,
    PrimengCustomModule
  ],
  providers: [ApprovalHomeHints,toastMessages],
  
})

export class ApprovalWorkflowModule { }
