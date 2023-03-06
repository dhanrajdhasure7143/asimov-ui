import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSubscriptionsRoutingModule } from './manage-subscriptions-routing.module';
import { ManageSubscriptionsComponent } from './manage-subscriptions.component';
import { CurrentplanComponent } from './currentplan/currentplan.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { BillingAddressComponent } from './billing-address/billing-address.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
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
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { OverviewComponent } from './overview/overview.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageSubscriptionsComponent, CurrentplanComponent, 
    PaymentMethodsComponent, BillingAddressComponent, PaymentHistoryComponent,
     OrderDetailsComponent,OrderByPipe, AddcardComponent, OverviewComponent],
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
    NgbModule,NgxSpinnerModule,
    PrimengCustomModule,
    Ng2TelInputModule,
    SharedModule
  ],

  providers:[
    BsModalRef
  ]
  
})
export class ManageSubscriptionsModule { }
