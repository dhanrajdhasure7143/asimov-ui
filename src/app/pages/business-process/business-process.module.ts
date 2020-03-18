import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatExpansionModule } from '@angular/material/expansion';
import { NotifierModule } from "angular-notifier";

import { BusinessProcessRoutingModule } from './business-process-routing.module';
import { BusinessProcessComponent } from './business-process.component';
import { CreateBpmnDiagramComponent } from './create-bpmn-diagram/create-bpmn-diagram.component';
import { BpsHomeComponent } from './home/home.component';
import { UploadProcessModelComponent } from './upload-process-model/upload-process-model.component';
@NgModule({
  declarations: [BusinessProcessComponent, CreateBpmnDiagramComponent, BpsHomeComponent, UploadProcessModelComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgxDropzoneModule,
    MatExpansionModule,
    NotifierModule,
    BusinessProcessRoutingModule
  ]
})
export class BusinessProcessModule { }
