import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { OrchestrationComponent } from './orchestration/orchestration.component';
import { OrchestrationNewComponent } from './orchestration-new/orchestration-new.component';
import { ServiceOrchestrationComponent } from './service-orchestration.component';
import { PredefinedBotsFormComponent } from './predefined-bots-form/predefined-bots-form.component';
import { DynamicFromNewComponent } from './dynamic-from-new/dynamic-from-new.component';
import { PredefinedBotListComponent } from './predefined-bot-list/predefined-bot-list.component';

const routes: Routes = [
  {path:'prdefinedForm', component:PredefinedBotsFormComponent},

  {path:'dynamicForm', component: DynamicFromNewComponent},
  {path:'', component:ServiceOrchestrationComponent, children:[
    // {path:'home', component:OrchestrationComponent},
    {path:'home', component:OrchestrationNewComponent},
    {path:'predefinedBots', component: PredefinedBotListComponent},
    {path:'**', redirectTo:'/home', pathMatch: 'full'},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceOrchestrationRoutingModule { }