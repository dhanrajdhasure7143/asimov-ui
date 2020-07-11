import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessIntelligenceComponent } from './process-intelligence.component';
import { UploadComponent } from './upload/upload.component';
import { DatadocumentComponent } from './datadocument/datadocument.component';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { DataselectionComponent } from './dataselection/dataselection.component';


const routes: Routes = [
  {path:'', component:ProcessIntelligenceComponent, children:[
    {path:'upload', component:UploadComponent},
    {path:'datadocument', component:DatadocumentComponent},
    {path:'flowChart', component:FlowchartComponent},
    {path:'selection', component:DataselectionComponent},
    {path:'**', redirectTo:'/upload', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessIntelligenceRoutingModule { }
