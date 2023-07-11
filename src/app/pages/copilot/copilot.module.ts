import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CopilotRoutingModule } from './copilot-routing.module';
import { CopilotComponent } from './copilot.component';
import { CopilotChatComponent } from './copilot-chat/copilot-chat.component';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { CopilotChatTwoComponent } from './copilot-chat-two/copilot-chat-two.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CopilotComponent,
    CopilotChatComponent,
    CopilotChatTwoComponent
  ],
  imports: [
    CommonModule,
    CopilotRoutingModule,
    PrimengCustomModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CopilotModule { }
