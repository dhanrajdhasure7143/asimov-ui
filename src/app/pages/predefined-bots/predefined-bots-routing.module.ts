import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredefinedBotsComponent } from './predefined-bots.component';
import { PredefinedBotsListComponent } from './predefined-bots-list/predefined-bots-list.component';
import { PredefinedBotsFormsComponent } from './predefined-bots-forms/predefined-bots-forms.component';
import { PredefinedBotsOrchestrationComponent } from './predefined-bots-orchestration/predefined-bots-orchestration.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';

const routes: Routes = [
  {path:'', component:PredefinedBotsComponent, children:[
    {path:'home', component:PredefinedBotsListComponent},
    {path:'list', component:PredefinedBotsOrchestrationComponent},
    {path:'predefinedforms', component:PredefinedBotsFormsComponent},
    {path:'agent-details', component:AgentDetailsComponent}
  ]
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredefinedBotsRoutingModule { }
