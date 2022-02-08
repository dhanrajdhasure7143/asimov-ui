import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateVcmComponent } from './create-vcm/create-vcm.component';
import { VcmPropertiesComponent } from './vcm-properties/vcm-properties.component';
import { VcmComponent } from './vcm.component';
import { ViewVcmComponent } from './view-vcm/view-vcm.component';
const routes: Routes = [
  {
    path:'',component:VcmComponent,children:[
      {
        path:'create-vcm',
        component:CreateVcmComponent
      },
      {
        path:'view-vcm',
        component:ViewVcmComponent
      },
      {
        path:'properties',
        component:VcmPropertiesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VcmRoutingModule { }
