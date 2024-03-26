import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { SuccessPaymentComponent } from './success-payment/success-payment.component';


const routes: Routes = [
  {path:'', component:PagesComponent, children:[
    {path:'home', component:HomeComponent}, 
    
    {path:'dashboard', loadChildren: () => import('././dashboard/dashboard.module').then(m => m.DashboardModule)},
    {path:'businessProcess', loadChildren: () => import('./business-process/business-process.module').then(m => m.BusinessProcessModule)},
    {path:'processIntelligence', loadChildren: () => import('./process-intelligence/process-intelligence.module').then(m => m.ProcessIntelligenceModule)},
    {path:'approvalWorkflow', loadChildren: () => import('./approval-workflow/approval-workflow.module').then(m => m.ApprovalWorkflowModule)},
    {path:'rpautomation', loadChildren: () => import('./rpautomation/rpautomation.module').then(m => m.RpautomationModule)},
    {path:'serviceOrchestration', loadChildren: () => import('./service-orchestration/service-orchestration.module').then(m => m.ServiceOrchestrationModule)},
    {path:'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)},
    {path:'admin', loadChildren:() => import('./administration/administration.module').then(m => m.AdministrationModule)},
    {path:'subscriptions', loadChildren:() => import('./manage-subscriptions/manage-subscriptions.module').then(m => m.ManageSubscriptionsModule)},
    {path:'support', loadChildren:() => import('./support/support.module').then(m => m.SupportModule)},
    {path:'vcm', loadChildren:() => import('./vcm/vcm.module').then(m => m.VcmModule)},
    {path:'copilot', loadChildren: () => import('./copilot/copilot.module').then(m => m.CopilotModule)},
    {path:'success',component:SuccessPaymentComponent},
    {path:'**', redirectTo:'/home', pathMatch:"full"},

  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
