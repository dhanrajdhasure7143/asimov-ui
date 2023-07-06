import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CopilotComponent } from './copilot.component';
import { CopilotChatComponent } from './copilot-chat/copilot-chat.component';

const routes: Routes = [
  {path:"", component:CopilotComponent, children:[
    {path:"chat", component:CopilotChatComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopilotRoutingModule { }
