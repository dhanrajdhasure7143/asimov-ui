import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CopilotRoutingModule } from './copilot-routing.module';
import { CopilotComponent } from './copilot.component';
import { CopilotHomeComponent } from './copilot-home/copilot-home.component';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { CopilotChatTwoComponent } from './copilot-chat-two/copilot-chat-two.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
//import { LoaderService } from 'src/app/services/loader/loader.service';


@NgModule({
  declarations: [
    CopilotComponent,
    CopilotHomeComponent,
    CopilotChatTwoComponent
  ],
  imports: [
    CommonModule,
    CopilotRoutingModule,
    PrimengCustomModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengCustomModule
    //LoaderService
  ],
  providers:[LoaderService]
})
export class CopilotModule { }
