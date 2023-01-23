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
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {CustomMatPaginatorIntl} from './../../shared/custom-mat-paginator-int';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { NgbModalDraggableModule } from 'ngb-modal-draggable'

import {MatPaginatorModule} from '@angular/material/paginator';
import{FilterPipe} from './custom_filter.pipe';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover'
import { MatSortModule } from '@angular/material/sort';
import { BpsDataSaveGuard } from 'src/app/guards/bps-data-save.guard';

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
    MatPaginatorModule,
    PopoverModule.forRoot(),
    MatSortModule,
    NgbModalDraggableModule
  ],
  providers: [BpsDataSaveGuard,BpsHints, 
    {
      provide: MatPaginatorIntl, 
      useClass: CustomMatPaginatorIntl
    }
  ]
})
export class BusinessProcessModule { }
