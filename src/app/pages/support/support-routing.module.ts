import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { SupportComponent } from './support.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';

const routes: Routes = [
  {path:'', component:SupportComponent, children:[
    {path:'ticket-list', component:TicketListComponent},
    {path:'create-ticket', component:CreateTicketComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
