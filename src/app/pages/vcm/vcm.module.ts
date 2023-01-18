import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VcmRoutingModule } from './vcm-routing.module';
import { ViewVcmComponent } from './view-vcm/view-vcm.component';
import { CreateVcmComponent } from './create-vcm/create-vcm.component';
import { VcmComponent } from './vcm.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { VcmPropertiesComponent } from './vcm-properties/vcm-properties.component';
import { VcmStructureComponent } from './vcm-structure/vcm-structure.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SharedModule } from '../../shared/shared.module';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
import { VcmFullEditComponent } from './vcm-full-edit/vcm-full-edit.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ModalModule, BsModalRef  } from 'ngx-bootstrap/modal';
import { FullEditPropertiesComponent } from './full-edit-properties/full-edit-properties.component';
import {CustomMatPaginatorIntl} from './../../shared/custom-mat-paginator-int';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { NgbModalDraggableModule } from 'ngb-modal-draggable'

@NgModule({
  declarations: [ViewVcmComponent, CreateVcmComponent, VcmComponent, VcmPropertiesComponent, VcmStructureComponent, ViewPropertiesComponent, VcmFullEditComponent, FullEditPropertiesComponent],
  imports: [
    CommonModule,
    VcmRoutingModule,
    MatTreeModule,
    MatIconModule,
    MatCardModule,MatSortModule,MatPaginatorModule,MatTableModule,
    MatListModule,MatMenuModule,MatButtonModule,MatIconModule,
    MatToolbarModule,MatSidenavModule,MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    ReactiveFormsModule,FormsModule,MatSliderModule,
    MatFormFieldModule,
    MatExpansionModule,
    PopoverModule.forRoot(),
    SharedModule,
    NgxDropzoneModule,
    NgbModalDraggableModule,
    ModalModule.forRoot(),
  ],
  providers:[BsModalRef,{
    provide: MatPaginatorIntl, 
    useClass: CustomMatPaginatorIntl
  }]
})
export class VcmModule { }
