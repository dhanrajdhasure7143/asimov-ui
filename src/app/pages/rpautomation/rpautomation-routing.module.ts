import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpautomationComponent } from './rpautomation.component';
import { RpaStudioComponent } from './rpa-studio/rpa-studio.component';

const routes: Routes = [
    {path:'', component:RpautomationComponent, children:[
      {path:'home', component:RpaStudioComponent},
      {path:'**', redirectTo:'/home', pathMatch: 'full'}
    ]}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RpautomationRoutingModule { }