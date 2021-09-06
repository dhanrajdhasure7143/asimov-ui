import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';


import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxSpinnerModule } from "ngx-spinner";
import { ModalModule, BsModalRef  } from 'ngx-bootstrap/modal';
import {
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule,
  MatCardModule,
  MatFormFieldModule,
  MatButtonModule} from '@angular/material';
import { MyAccountComponent } from './myaccount/myaccount.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng5SliderModule } from 'ng5-slider';
import {MatSliderModule} from '@angular/material/slider';
import {NgxPaginationModule} from 'ngx-pagination';
import { MatMenuModule } from '@angular/material'; 
import {CustomMatPaginatorIntl} from './../../shared/custom-mat-paginator-int';
import {MatPaginatorIntl} from '@angular/material';
import {Ng2TelInputModule} from 'ng2-tel-input';

const materialModules: any[] = [
    
    
  ];

@NgModule({
  declarations: [AdministrationComponent, MyAccountComponent],
  imports: [
    Ng2TelInputModule,
    CommonModule,
    AdministrationRoutingModule,
    materialModules,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatTooltipModule,
    MatSlideToggleModule,
    DataTablesModule,MatTableModule,ReactiveFormsModule,FormsModule, MatSortModule,MatSliderModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatMenuModule,MatButtonModule,NgxSpinnerModule,NgxPaginationModule,
    ModalModule.forRoot(),
    MatProgressBarModule,NgSelectModule,Ng5SliderModule

    
  ],
  providers:[
    BsModalRef, 
  {
      provide: MatPaginatorIntl, 
      useClass: CustomMatPaginatorIntl
    }

  ]
})
export class AdministrationModule { }
