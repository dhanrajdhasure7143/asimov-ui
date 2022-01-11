import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentplanComponent } from './currentplan/currentplan.component';
import { ManageSubscriptionsComponent } from './manage-subscriptions.component';


const routes: Routes = [
  {path:'', component:ManageSubscriptionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSubscriptionsRoutingModule { }
