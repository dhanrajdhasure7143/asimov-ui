import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';

import { UploadCreateDropBpmnComponent } from '../shared/upload-create-drop-bpmn/upload-create-drop-bpmn.component';
import { BpmnDiagramComponent } from './bpmn-diagram/bpmn-diagram.component';
import { CronEditorModule } from './cron-editor/cron-editor.module';


@NgModule({
  declarations: [UploadCreateDropBpmnComponent, BpmnDiagramComponent],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    CronEditorModule,
    FormsModule
  ],
  providers: [],
  exports: [UploadCreateDropBpmnComponent, BpmnDiagramComponent]
})
export class SharedModule { }
