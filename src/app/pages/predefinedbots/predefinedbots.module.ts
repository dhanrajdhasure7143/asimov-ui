import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredefinedbotsRoutingModule } from './predefinedbots-routing.module';
import { PredefinedbotsComponent } from './predefinedbots.component';
import { PredefinedBotsListComponent } from './predefined-bots-list/predefined-bots-list.component';
import { PredefinedBotsFormsComponent } from './predefined-bots-forms/predefined-bots-forms.component';
import { PredefinedBotsOrchestrationComponent } from './predefined-bots-orchestration/predefined-bots-orchestration.component';


@NgModule({
  declarations: [
    PredefinedbotsComponent,
    PredefinedBotsListComponent,
    PredefinedBotsFormsComponent,
    PredefinedBotsOrchestrationComponent,
  ],
  imports: [
    CommonModule,
    PredefinedbotsRoutingModule
  ]
})
export class PredefinedbotsModule { }
