import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CopilotRoutingModule } from './copilot-routing.module';
import { CopilotComponent } from './copilot.component';
import { CopilotChatComponent } from './copilot-chat/copilot-chat.component';


@NgModule({
  declarations: [
    CopilotComponent,
    CopilotChatComponent
  ],
  imports: [
    CommonModule,
    CopilotRoutingModule
  ]
})
export class CopilotModule { }
