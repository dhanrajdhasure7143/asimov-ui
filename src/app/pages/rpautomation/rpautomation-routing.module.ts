import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpautomationComponent } from './rpautomation.component';
import { RpaStudioComponent } from './rpa-studio/rpa-studio.component';
import { RpaenvironmentsComponent } from './rpa-environments/rpa-environments.component';
import { RpaWorkspaceComponent } from './rpa-workspace/rpa-workspace.component'

const routes: Routes = [
    {path:'', component:RpautomationComponent, children:[
      {path:'home', component:RpaStudioComponent},
      {path:'environments',  component:RpaenvironmentsComponent},
      {path:'workspace',  component:RpaWorkspaceComponent},
      {path:'**', redirectTo:'/home', pathMatch: 'full'}
    ]}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RpautomationRoutingModule { }