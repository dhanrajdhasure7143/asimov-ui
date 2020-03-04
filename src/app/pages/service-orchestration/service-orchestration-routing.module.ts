import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrchestrationComponent } from './orchestration/orchestration.component';
import { ServiceOrchestrationComponent } from './service-orchestration.component';

const routes: Routes = [
  {path:'', component:ServiceOrchestrationComponent, children:[
    {path:'home', component:OrchestrationComponent},
    {path:'**', redirectTo:'/home', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceOrchestrationRoutingModule { }