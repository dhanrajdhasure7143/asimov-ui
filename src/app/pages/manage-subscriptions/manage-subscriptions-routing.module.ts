import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentplanComponent } from './currentplan/currentplan.component';
import { ManageSubscriptionsComponent } from './manage-subscriptions.component';
import { AddcardComponent } from './addcard/addcard.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { BillingAddressComponent } from './billing-address/billing-address.component';


const routes: Routes = [
  {path:'', component:ManageSubscriptionsComponent,children:[
    {path:'plan',component:CurrentplanComponent},
    {path:'paymentmethod',component:PaymentMethodsComponent},
    {path:'billinginfo',component:BillingAddressComponent}
  ]},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSubscriptionsRoutingModule { }
