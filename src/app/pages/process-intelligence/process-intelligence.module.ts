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
import { FilterComponent } from './filter/filter.component'
import { FlowchartComponent } from './flowchart/flowchart.component';
import { SearchPipe } from './pipes/search.pipe';
import { PiHints } from './model/process-intelligence-module-hints';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataselectionComponent } from './dataselection/dataselection.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { XesdocumentComponent } from './xesdocument/xesdocument.component';
import { D3flowchartComponent } from './d3flowchart/d3flowchart.component';
import { ProcessinsightsComponent } from './processinsights/processinsights.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { ComboChartComponent } from './processinsights/combo-chart/combo-chart.component';
import { ComboSeriesVerticalComponent } from './processinsights/combo-chart/combo-series-vertical.component';
import {CustomMatPaginatorIntl} from './../../shared/custom-mat-paginator-int';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BusinessInsightsComponent } from './business-insights/business-insights.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';

@NgModule({
  declarations: [
    ProcessIntelligenceComponent, 
    UploadComponent, 
    DatadocumentComponent, 
    FilterComponent,
    FlowchartComponent,
    SearchPipe,
    DataselectionComponent,
    XesdocumentComponent,
    D3flowchartComponent,
    ProcessinsightsComponent,
    ComboChartComponent, 
    ComboSeriesVerticalComponent,
    BusinessInsightsComponent,
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
    NgxPaginationModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    }),
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgbModule,
    NgxMaterialTimepickerModule,
    MatTabsModule,
    MatMenuModule,
    PopoverModule.forRoot(),
    PrimengCustomModule
  ],
  providers:[PiHints, 
    {
      provide: MatPaginatorIntl, 
      useClass: CustomMatPaginatorIntl
    }]

})
export class ProcessIntelligenceModule {
  
 }
