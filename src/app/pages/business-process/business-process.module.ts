import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatExpansionModule } from '@angular/material/expansion';
import { NotifierModule } from "angular-notifier";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AngularSplitModule } from 'angular-split';
import { SharedModule } from '../../shared/shared.module';
import { BusinessProcessRoutingModule } from './business-process-routing.module';
import { BusinessProcessComponent } from './business-process.component';
import { CreateBpmnDiagramComponent } from './create-bpmn-diagram/create-bpmn-diagram.component';
import { BpsHomeComponent } from './home/home.component';
import { UploadProcessModelComponent } from './upload-process-model/upload-process-model.component';
import { BpsHints } from './model/bpmn-module-hints';
import { ListOfChangesComponent } from './list-of-changes/list-of-changes.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule, MatIconModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatTooltipModule,MatDialogModule, MatTabsModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';

import {MatPaginatorModule} from '@angular/material/paginator';
import{FilterPipe} from './custom_filter.pipe';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import 'highlightjs-line-numbers.js';
// import hljs from 'highlight.js/lib/core';
// import xml from 'highlight.js/lib/languages/xml';
// hljs.registerLanguage('xml', xml);
// import hljs from '../../../../node_modules/highlight.js/lib/core';
// document.defaultView['hljs'] = hljs;

@NgModule({
  declarations: [BusinessProcessComponent, CreateBpmnDiagramComponent, BpsHomeComponent, UploadProcessModelComponent, ListOfChangesComponent,FilterPipe],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgxDropzoneModule,
    MatExpansionModule,
    NotifierModule,
    BusinessProcessRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSplitModule.forRoot(),
    NgxPaginationModule,
    Ng2SearchPipeModule,
    MatProgressSpinnerModule,
    MatInputModule, MatIconModule, MatFormFieldModule,
    MatOptionModule, MatSelectModule, MatTooltipModule, MatDialogModule, MatTabsModule, MatMenuModule,
    ModalModule.forRoot(),
    MatPaginatorModule
    // HighlightModule
  ],
  providers: [
    // {
    //   provide: HIGHLIGHT_OPTIONS,
    //   useValue: {
    //     coreLibraryLoader: () => import('highlight.js/lib/core'),
    //     lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
    //     languages: {
    //       xml: () => import('highlight.js/lib/languages/xml')}
    //   }
    // },
    BpsHints
  ]
})
export class BusinessProcessModule { }
