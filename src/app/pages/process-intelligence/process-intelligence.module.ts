import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../shared/shared.module';
import { ProcessIntelligenceRoutingModule } from './process-intelligence-routing.module';
import { ProcessIntelligenceComponent } from './process-intelligence.component';
import { UploadComponent } from './upload/upload.component';
import { DatadocumentComponent } from './datadocument/datadocument.component';
import { PiflowchartComponent } from './piflowchart/piflowchart.component';
import { FilterComponent } from './filter/filter.component'
import { FlowchartComponent } from './flowchart/flowchart.component';
import { SearchPipe } from './pipes/search.pipe';
import { PiHints } from './model/process-intelligence-module-hints';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataselectionComponent } from './dataselection/dataselection.component';
import { PibpmnfilterComponent } from './pibpmnfilter/pibpmnfilter.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxSpinnerModule } from 'ngx-spinner';
import {DataTablesModule} from 'angular-datatables';
import {MatOptionModule, MatSelectModule} from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { XesdocumentComponent } from './xesdocument/xesdocument.component';


@NgModule({
  declarations: [
    ProcessIntelligenceComponent, 
    UploadComponent, 
    DatadocumentComponent, 
    PiflowchartComponent, 
    FilterComponent,
    FlowchartComponent,
    SearchPipe,
    DataselectionComponent,
    PibpmnfilterComponent,
    XesdocumentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    Ng5SliderModule,
    NgxChartsModule,
    NgxDropzoneModule,
    ProcessIntelligenceRoutingModule,
    SharedModule,
    MatExpansionModule,
    ModalModule.forRoot(),
    Ng2SearchPipeModule,
    NgxSpinnerModule,
    DataTablesModule,
    MatOptionModule,MatSelectModule,
    NgxPaginationModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    })
  ],
  providers:[PiHints]

})
export class ProcessIntelligenceModule {
  
 }
