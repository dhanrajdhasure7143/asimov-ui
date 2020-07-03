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
import {MatInputModule, MatIconModule, MatFormFieldModule, MatOptionModule, MatSelectModule} from '@angular/material';

@NgModule({
  declarations: [BusinessProcessComponent, CreateBpmnDiagramComponent, BpsHomeComponent, UploadProcessModelComponent, ListOfChangesComponent],
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
    MatOptionModule, MatSelectModule
  ],
  providers: [BpsHints]
})
export class BusinessProcessModule { }
