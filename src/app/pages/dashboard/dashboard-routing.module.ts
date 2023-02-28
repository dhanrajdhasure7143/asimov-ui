import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigureDashboardComponent } from './configure-dashboard/configure-dashboard.component';
import { DashboardComponent } from './dashboard.component';
import { DynamicDashboardComponent } from './dynamic-dashboard/dynamic-dashboard.component';
import { CreateDashboardComponent } from './create-dashboard/create-dashboard.component';

const routes: Routes = [
  {path:'', component:DashboardComponent, children:[
    
    {path:'dynamicdashboard', component:DynamicDashboardComponent},
    {path:'configure-dashboard', component:ConfigureDashboardComponent},
    {path:'create-dashboard', component:CreateDashboardComponent}
  
  ]}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
