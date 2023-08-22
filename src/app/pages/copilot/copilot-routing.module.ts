import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CopilotComponent } from './copilot.component';
import { CopilotHomeComponent } from './copilot-home/copilot-home.component';
import { CopilotChatComponent } from './copilot-chat/copilot-chat.component';

const routes: Routes = [
  {path:"", component:CopilotComponent, children:[
    {path:"home", component:CopilotHomeComponent},
    {path:"chat", component:CopilotChatComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopilotRoutingModule { }
