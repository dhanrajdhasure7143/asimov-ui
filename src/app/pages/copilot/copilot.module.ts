import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopilotRoutingModule } from './copilot-routing.module';
import { CopilotComponent } from './copilot.component';
import { CopilotHomeComponent } from './copilot-home/copilot-home.component';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { CopilotChatComponent } from './copilot-chat/copilot-chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { CopilotMessageComponent } from './copilot-message/copilot-message.component';
import { CopilotMessageButtonComponent } from './actions/copilot-message-button/copilot-message-button.component';
import { CopilotMessageFormComponent } from './actions/copilot-message-form/copilot-message-form.component';
import { CopilotMessageListComponent } from './actions/copilot-message-list/copilot-message-list.component';
import { CopilotMessageCardComponent } from './actions/copilot-message-card/copilot-message-card.component';
import { CopilotMessageCardItemComponent } from './actions/copilot-message-card-item/copilot-message-card-item.component';
import { RpautomationModule } from '../rpautomation/rpautomation.module';
import { ProcessIntelligenceModule } from '../process-intelligence/process-intelligence.module';
//import { LoaderService } from 'src/app/services/loader/loader.service';


@NgModule({
  declarations: [
    CopilotComponent,
    CopilotHomeComponent,
    CopilotChatComponent,
    CopilotMessageComponent,
    CopilotMessageButtonComponent,
    CopilotMessageFormComponent,
    CopilotMessageListComponent,
    CopilotMessageCardComponent,
    CopilotMessageCardItemComponent,
  ],
  imports: [
    CommonModule,
    CopilotRoutingModule,
    PrimengCustomModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengCustomModule,
    FormsModule,
    RpautomationModule,
    ProcessIntelligenceModule
    
    //LoaderService
  ],
  providers:[LoaderService]
})
export class CopilotModule { }
