import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { ProcessIntelligenceRoutingModule } from './process-intelligence-routing.module';
import { ProcessIntelligenceComponent } from './process-intelligence.component';
import { UploadComponent } from './upload/upload.component';
import { DatadocumentComponent } from './datadocument/datadocument.component';
import { ProcessintelligenceComponent } from './processintelligence/processintelligence.component';
import { ProcessintelligencebpmnComponent } from './processintelligencebpmn/processintelligencebpmn.component';
import { FlowchartComponent } from './flowchart/flowchart.component';

@NgModule({
  declarations: [ProcessIntelligenceComponent, UploadComponent, DatadocumentComponent, ProcessintelligenceComponent, ProcessintelligencebpmnComponent,
                  FlowchartComponent],
  imports: [
    CommonModule,
    FormsModule,
    Ng5SliderModule,
    NgxChartsModule,
    NgxDropzoneModule,
    ProcessIntelligenceRoutingModule
  ]
})
export class ProcessIntelligenceModule {
  
 }
