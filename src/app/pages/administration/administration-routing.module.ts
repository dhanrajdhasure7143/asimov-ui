import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { MyAccountComponent } from './myaccount/myaccount.component';


const routes: Routes = [
  {path:'', component:AdministrationComponent, children:[
    
    {path:'myaccount', component:MyAccountComponent},
      
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }

