import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CopilotComponent } from './copilot.component';
import { CopilotChatComponent } from './copilot-chat/copilot-chat.component';
import { CopilotChatTwoComponent } from './copilot-chat-two/copilot-chat-two.component';

const routes: Routes = [
  {path:"", component:CopilotComponent, children:[
    {path:"home", component:CopilotChatComponent},
    {path:"chat", component:CopilotChatTwoComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopilotRoutingModule { }
