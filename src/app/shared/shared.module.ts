import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';


import { UploadCreateDropBpmnComponent } from '../shared/upload-create-drop-bpmn/upload-create-drop-bpmn.component';


@NgModule({
  declarations: [UploadCreateDropBpmnComponent],
  imports: [
    CommonModule,
    NgxDropzoneModule
  ],
  providers: [],
  exports: [UploadCreateDropBpmnComponent]
})
export class SharedModule { }
