import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CopilotComponent } from './copilot.component';
import { CopilotHomeComponent } from './copilot-home/copilot-home.component';
import { CopilotChatTwoComponent } from './copilot-chat-two/copilot-chat-two.component';

const routes: Routes = [
  {path:"", component:CopilotComponent, children:[
    {path:"home", component:CopilotHomeComponent},
    {path:"chat", component:CopilotChatTwoComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopilotRoutingModule { }
