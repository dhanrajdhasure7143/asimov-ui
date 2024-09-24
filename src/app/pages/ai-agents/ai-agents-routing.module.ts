import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiAgentsComponent } from './ai-agents.component';
import { AiAgentHomeComponent } from './ai-agent-home/ai-agent-home.component';
import { AiAgentFormComponent } from './ai-agent-form/ai-agent-form.component';
import { PredefinedBotsOrchestrationComponent } from './predefined-bots-orchestration/predefined-bots-orchestration.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { AiAgentSubAgentsComponent } from './ai-agent-sub-agents/ai-agent-sub-agents.component';
import { AiAgentHomeScreenComponent } from './ai-agent-home-screen/ai-agent-home-screen.component';
import { RecruitmentAiSalesPageComponent } from './agent-pages/recruitment-ai-sales-page';
import { RfpAiSalesPageComponent } from './agent-pages/rfp-ai-sales-page';
import { DevAiSalesPageComponent } from './agent-pages/dev-ai-sales-page';
import { TestingAiSalesPageComponent } from './agent-pages/testing-ai-sales-page';
import { CustomerBotAiSalesPageComponent } from './agent-pages/customer-bot-ai-sales-page';
import { AiAgentFormOldComponent } from './ai-agent-form-old/ai-agent-form-old.component';
import { MarketingAiSalesPageComponent } from './agent-pages/marketing-ai-sales-page';
import { ProductOwnerAiSalesPageComponent } from './agent-pages/product-owner-ai-sales-page';

const routes: Routes = [
  {path:'', component:AiAgentsComponent, children:[
    // {path:'home', component:AiAgentHomeComponent},
    {path:'home', component:AiAgentHomeScreenComponent},
    {path:'inbox', component:PredefinedBotsOrchestrationComponent},
    {path:'form', component:AiAgentFormComponent},
    // {path:'form', component:AiAgentFormOldComponent},
    {path:'details', component:AgentDetailsComponent},
    {path:'sub-agents', component:AiAgentSubAgentsComponent},
    {path:'subscription/recruitment',component: RecruitmentAiSalesPageComponent},
    {path:'subscription/rfp',component: RfpAiSalesPageComponent},
    {path:'subscription/dev',component: DevAiSalesPageComponent},
    {path:'subscription/testing',component: TestingAiSalesPageComponent},
    {path:'subscription/chatbot',component: CustomerBotAiSalesPageComponent},
    {path:'subscription/marketing',component: MarketingAiSalesPageComponent},
    {path:'subscription/product-owner',component: ProductOwnerAiSalesPageComponent},
  ]
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiAgentsRoutingModule { }
