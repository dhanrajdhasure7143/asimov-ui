import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpautomationComponent } from './rpautomation.component';
import { RpaStudioComponent } from './rpa-studio/rpa-studio.component';
import { RpautomationRoutingModule } from './rpautomation-routing.module';
import { DndModule } from 'ngx-drag-drop';
import {  ContextMenuModule } from 'ngx-contextmenu';
import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';
import { RpaStudioTabsComponent } from './rpa-studio-tabs/rpa-studio-tabs.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RpaStudioWorkspaceComponent } from './rpa-studio-workspace/rpa-studio-workspace.component';
import { RpaStudioActionsComponent } from './rpa-studio-actions/rpa-studio-actions.component';





@NgModule({
  declarations: [RpautomationComponent, RpaStudioComponent, RpaStudioTabsComponent, RpaStudioWorkspaceComponent, RpaStudioActionsComponent],
  imports: [
    CommonModule,
    RpautomationRoutingModule,
    DndModule,
    NgbModule,
    ContextMenuModule.forRoot(),
    DynamicFormBuilderModule,
    FormsModule
  ]
})
export class RpautomationModule { }
