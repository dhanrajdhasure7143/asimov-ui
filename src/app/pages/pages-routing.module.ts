import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {path:'', component:PagesComponent, children:[
    {path:'home', component:HomeComponent}, 
    {path:'businessProcess', loadChildren: './business-process/business-process.module#BusinessProcessModule'},
    {path:'processIntelligence', loadChildren: './process-intelligence/process-intelligence.module#ProcessIntelligenceModule'},
    {path:'rpautomation', loadChildren: './rpautomation/rpautomation.module#RpautomationModule'},
    {path:'serviceOrchestration', loadChildren: './service-orchestration/service-orchestration.module#ServiceOrchestrationModule'},
    {path:'**', redirectTo:'/home', pathMatch:"full"}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
