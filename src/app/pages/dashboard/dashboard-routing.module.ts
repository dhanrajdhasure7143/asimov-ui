import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DynamicDashboardComponent } from './dynamic-dashboard/dynamic-dashboard.component';

const routes: Routes = [
  {path:'', component:DashboardComponent, children:[
    
    {path:'dynamicdashboard', component:DynamicDashboardComponent},
  
  ]}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
