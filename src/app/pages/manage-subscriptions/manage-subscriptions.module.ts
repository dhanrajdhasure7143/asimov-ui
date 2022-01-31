import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSubscriptionsRoutingModule } from './manage-subscriptions-routing.module';
import { ManageSubscriptionsComponent } from './manage-subscriptions.component';
import { CurrentplanComponent } from './currentplan/currentplan.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { BillingAddressComponent } from './billing-address/billing-address.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { MatExpansionModule, MatListModule, MatMenuModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatTooltipModule, MatCard, MatCardModule, MatSortModule, MatPaginatorModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { OrderByPipe } from './pipes/orderby-pipe.pipe';
import { AddcardComponent } from './addcard/addcard.component';


@NgModule({
  declarations: [ManageSubscriptionsComponent, CurrentplanComponent, 
    PaymentMethodsComponent, BillingAddressComponent, PaymentHistoryComponent,
     OrderDetailsComponent,OrderByPipe, AddcardComponent],
  imports: [
    CommonModule,  
    ManageSubscriptionsRoutingModule,
    MatCardModule,MatSortModule,MatPaginatorModule,MatTableModule,
    MatListModule,MatMenuModule,MatButtonModule,MatIconModule,
    MatToolbarModule,MatSidenavModule,MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    DataTablesModule,ReactiveFormsModule,FormsModule,MatSliderModule,
    MatFormFieldModule,NgxPaginationModule,
    ModalModule.forRoot(),
    NgbModule,NgxSpinnerModule
  ],

  providers:[
    BsModalRef
  ]
  
})
export class ManageSubscriptionsModule { }
