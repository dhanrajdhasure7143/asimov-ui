import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiAgentsComponent } from './ai-agents.component';
import { AiAgentListComponent } from './ai-agent-home/ai-agent-home.component';
import { AiAgentFormComponent } from './ai-agent-form/ai-agent-form.component';
import { PredefinedBotsOrchestrationComponent } from './predefined-bots-orchestration/predefined-bots-orchestration.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';

const routes: Routes = [
  {path:'', component:AiAgentsComponent, children:[
    {path:'home', component:AiAgentListComponent},
    {path:'inbox', component:PredefinedBotsOrchestrationComponent},
    {path:'form', component:AiAgentFormComponent},
    {path:'details', component:AgentDetailsComponent}
  ]
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiAgentsRoutingModule { }
