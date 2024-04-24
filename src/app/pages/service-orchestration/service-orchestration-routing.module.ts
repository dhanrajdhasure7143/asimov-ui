import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { OrchestrationComponent } from './orchestration/orchestration.component';
import { OrchestrationNewComponent } from './orchestration-new/orchestration-new.component';
import { ServiceOrchestrationComponent } from './service-orchestration.component';

const routes: Routes = [
  {path:'', component:ServiceOrchestrationComponent, children:[
    // {path:'home', component:OrchestrationComponent},
    {path:'home', component:OrchestrationNewComponent},
    {path:'**', redirectTo:'/home', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceOrchestrationRoutingModule { }