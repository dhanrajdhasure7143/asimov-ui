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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { XesdocumentComponent } from './xesdocument/xesdocument.component';
import { D3flowchartComponent } from './d3flowchart/d3flowchart.component';
import { ProcessinsightsComponent } from './processinsights/processinsights.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule, MatIconModule, MatFormFieldModule, MatTooltipModule,MatDialogModule} from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

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
    XesdocumentComponent,
    D3flowchartComponent,
    ProcessinsightsComponent
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
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SearchPipeModule,
    NgxSpinnerModule,
    DataTablesModule,
    MatOptionModule,MatSelectModule,
    NgxPaginationModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    }),
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule, MatIconModule, MatFormFieldModule,
    MatTooltipModule,MatDialogModule,
    NgbModule,
    NgxMaterialTimepickerModule
  ],
  providers:[PiHints],

})
export class ProcessIntelligenceModule {
  
 }
