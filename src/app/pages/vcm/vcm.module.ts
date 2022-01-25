import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VcmRoutingModule } from './vcm-routing.module';
import { ViewVcmComponent } from './view-vcm/view-vcm.component';
import { CreateVcmComponent } from './create-vcm/create-vcm.component';
import { VcmComponent } from './vcm.component';
import { MatTreeModule, MatListModule, MatMenuModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatTooltipModule, MatCard, MatCardModule, MatSortModule, MatPaginatorModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';



@NgModule({
  declarations: [ViewVcmComponent, CreateVcmComponent, VcmComponent],
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
    MatExpansionModule
  ],
  providers:[]
})
export class VcmModule { }
