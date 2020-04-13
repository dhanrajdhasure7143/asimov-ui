import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalWorkflowComponent } from './approval-workflow.component';
import { BpmnDiagramListComponent } from './bpmn-diagram-list/bpmn-diagram-list.component';

const routes: Routes = [
  {path:'', component:ApprovalWorkflowComponent, children:[
    {path:'home', component:BpmnDiagramListComponent},
    {path:'**', redirectTo:'/home', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalWorkflowRoutingModule { }
