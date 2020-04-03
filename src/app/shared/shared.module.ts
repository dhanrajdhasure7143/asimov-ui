import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';


import { UploadCreateDropBpmnComponent } from '../shared/upload-create-drop-bpmn/upload-create-drop-bpmn.component';
import { BpmnDiagramComponent } from './bpmn-diagram/bpmn-diagram.component';


@NgModule({
  declarations: [UploadCreateDropBpmnComponent, BpmnDiagramComponent],
  imports: [
    CommonModule,
    NgxDropzoneModule
  ],
  providers: [],
  exports: [UploadCreateDropBpmnComponent, BpmnDiagramComponent]
})
export class SharedModule { }
