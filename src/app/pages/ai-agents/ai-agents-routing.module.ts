import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiAgentsComponent } from './ai-agents.component';
import { AiAgentHomeComponent } from './ai-agent-home/ai-agent-home.component';
import { AiAgentFormComponent } from './ai-agent-form/ai-agent-form.component';
import { PredefinedBotsOrchestrationComponent } from './predefined-bots-orchestration/predefined-bots-orchestration.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { AiAgentSubAgentsComponent } from './ai-agent-sub-agents/ai-agent-sub-agents.component';
import { AiAgentHomeScreenComponent } from './ai-agent-home-screen/ai-agent-home-screen.component';

const routes: Routes = [
  {path:'', component:AiAgentsComponent, children:[
    // {path:'home', component:AiAgentHomeComponent},
    {path:'home', component:AiAgentHomeScreenComponent},
    {path:'inbox', component:PredefinedBotsOrchestrationComponent},
    {path:'form', component:AiAgentFormComponent},
    {path:'details', component:AgentDetailsComponent},
    {path:'sub-agents', component:AiAgentSubAgentsComponent}
  ]
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiAgentsRoutingModule { }
