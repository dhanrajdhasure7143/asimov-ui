import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { SharedModule } from '../../shared/shared.module';
import { ProcessIntelligenceRoutingModule } from './process-intelligence-routing.module';
import { ProcessIntelligenceComponent } from './process-intelligence.component';
import { UploadComponent } from './upload/upload.component';
import { DatadocumentComponent } from './datadocument/datadocument.component';
import { ProcessintelligenceComponent } from './processintelligence/processintelligence.component';
import { ProcessintelligencebpmnComponent } from './processintelligencebpmn/processintelligencebpmn.component';
import { PiflowchartComponent } from './piflowchart/piflowchart.component';
import { FilterComponent } from './filter/filter.component'
import { FlowchartComponent } from './flowchart/flowchart.component';
import { SearchPipe } from './pipes/search.pipe';
import { PiHints } from './model/process-intelligence-module-hints';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    ProcessIntelligenceComponent, 
    UploadComponent, 
    DatadocumentComponent, 
    ProcessintelligenceComponent, 
    ProcessintelligencebpmnComponent,
    PiflowchartComponent, 
    FilterComponent,
    FlowchartComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    Ng5SliderModule,
    NgxChartsModule,
    NgxDropzoneModule,
    ProcessIntelligenceRoutingModule,
    SharedModule,
    MatExpansionModule
  ],
  providers:[PiHints]

})
export class ProcessIntelligenceModule {
  
 }
