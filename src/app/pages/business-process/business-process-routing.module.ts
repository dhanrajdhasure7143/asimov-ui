import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateBpmnDiagramComponent } from './create-bpmn-diagram/create-bpmn-diagram.component';
import { BusinessProcessComponent } from './business-process.component';
import { BpsHomeComponent } from './home/home.component';
import { UploadProcessModelComponent } from './upload-process-model/upload-process-model.component';
import { BpsDataSaveGuard } from 'src/app/guards/bps-data-save.guard';

const routes: Routes = [
  {path:'', component:BusinessProcessComponent, children:[
    {path:'home', component:BpsHomeComponent},
    {path:'createDiagram', component:CreateBpmnDiagramComponent},//, canDeactivate:[BpsDataSaveGuard]
    {path:'uploadProcessModel', component:UploadProcessModelComponent},
    {path:'**', redirectTo:'/home', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessProcessRoutingModule { }
