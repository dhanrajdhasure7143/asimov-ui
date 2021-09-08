import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {path:'', component:PagesComponent, children:[
    {path:'home', component:HomeComponent}, 
    {path:'businessProcess', loadChildren: './business-process/business-process.module#BusinessProcessModule'},
    {path:'processIntelligence', loadChildren: './process-intelligence/process-intelligence.module#ProcessIntelligenceModule'},
    {path:'approvalWorkflow', loadChildren: './approval-workflow/approval-workflow.module#ApprovalWorkflowModule'},
    {path:'rpautomation', loadChildren: './rpautomation/rpautomation.module#RpautomationModule'},
    {path:'serviceOrchestration', loadChildren: './service-orchestration/service-orchestration.module#ServiceOrchestrationModule'},
    {path:'projects', loadChildren: './projects/projects.module#ProjectsModule'},
    {path:'admin', loadChildren:'./administration/administration.module#AdministrationModule'},
    {path:'**', redirectTo:'/home', pathMatch:"full"}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
