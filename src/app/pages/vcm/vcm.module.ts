import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VcmRoutingModule } from './vcm-routing.module';
import { ViewVcmComponent } from './view-vcm/view-vcm.component';
import { CreateVcmComponent } from './create-vcm/create-vcm.component';
import { VcmComponent } from './vcm.component';
import { MatTreeModule, MatListModule, MatMenuModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatTooltipModule, MatCard, MatCardModule, MatSortModule, MatPaginatorModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { VcmPropertiesComponent } from './vcm-properties/vcm-properties.component';
import { VcmStructureComponent } from './vcm-structure/vcm-structure.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SharedModule } from '../../shared/shared.module';
import { EditVcmComponent } from './edit-vcm/edit-vcm.component';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
import { VcmFullEditComponent } from './vcm-full-edit/vcm-full-edit.component';
import { VcmPreviewComponent } from './vcm-preview/vcm-preview.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ModalModule, BsModalRef  } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ViewVcmComponent, CreateVcmComponent, VcmComponent, VcmPropertiesComponent, VcmStructureComponent, EditVcmComponent, ViewPropertiesComponent, VcmFullEditComponent, VcmPreviewComponent],
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
    ModalModule.forRoot(),
  ],
  providers:[BsModalRef]
})
export class VcmModule { }
