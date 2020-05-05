import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpautomationComponent } from './rpautomation.component';
import { RpaStudioComponent } from './rpa-studio/rpa-studio.component';
import { RpautomationRoutingModule } from './rpautomation-routing.module';
import { DndModule } from 'ngx-drag-drop';
import {  ContextMenuModule } from 'ngx-contextmenu';
import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';





@NgModule({
  declarations: [RpautomationComponent, RpaStudioComponent],
  imports: [
    CommonModule,
    RpautomationRoutingModule,
    DndModule,
    ContextMenuModule.forRoot(),
    DynamicFormBuilderModule
  ]
})
export class RpautomationModule { }
