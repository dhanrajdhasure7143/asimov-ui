import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessIntelligenceComponent } from './process-intelligence.component';
import { UploadComponent } from './upload/upload.component';
import { DatadocumentComponent } from './datadocument/datadocument.component';
import { ProcessintelligenceComponent } from './processintelligence/processintelligence.component';
import { ProcessintelligencebpmnComponent } from './processintelligencebpmn/processintelligencebpmn.component';
import { FlowchartComponent } from './flowchart/flowchart.component';


const routes: Routes = [
  {path:'', component:ProcessIntelligenceComponent, children:[
    {path:'upload', component:UploadComponent},
    {path:'datadocument', component:DatadocumentComponent},
    {path:'processIntelligence', component:ProcessintelligenceComponent},
    {path:'processintelligencebpmn', component:ProcessintelligencebpmnComponent},
    {path:'flowChart', component:FlowchartComponent},
    {path:'**', redirectTo:'/upload', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessIntelligenceRoutingModule { }
