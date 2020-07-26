import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import {MatInputModule, MatIconModule, MatFormFieldModule, MatOptionModule, MatSelectModule} from '@angular/material';

import { UploadCreateDropBpmnComponent } from '../shared/upload-create-drop-bpmn/upload-create-drop-bpmn.component';
import { BpmnDiagramComponent } from './bpmn-diagram/bpmn-diagram.component';
import { CronEditorModule } from './cron-editor/cron-editor.module';
import { ProcessCategoryOverlayComponent } from './process-category-overlay/process-category-overlay.component';
import { SearchPipe } from './pipes/search.pipe';


@NgModule({
  declarations: [UploadCreateDropBpmnComponent, BpmnDiagramComponent, ProcessCategoryOverlayComponent, SearchPipe],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    CronEditorModule,
    FormsModule,
    MatInputModule, MatIconModule, MatFormFieldModule,
    MatOptionModule, MatSelectModule
  ],
  providers: [],
  exports: [UploadCreateDropBpmnComponent, BpmnDiagramComponent, ProcessCategoryOverlayComponent, SearchPipe]
})
export class SharedModule { }
