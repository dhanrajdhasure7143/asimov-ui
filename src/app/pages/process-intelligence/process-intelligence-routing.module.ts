import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessIntelligenceComponent } from './process-intelligence.component';
import { UploadComponent } from './upload/upload.component';
import { DatadocumentComponent } from './datadocument/datadocument.component';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { DataselectionComponent } from './dataselection/dataselection.component';
import { XesdocumentComponent } from './xesdocument/xesdocument.component';
import { D3flowchartComponent } from './d3flowchart/d3flowchart.component';
import { ProcessinsightsComponent } from './processinsights/processinsights.component';


const routes: Routes = [
  {path:'', component:ProcessIntelligenceComponent, children:[
    {path:'upload', component:UploadComponent},
    {path:'datadocument', component:DatadocumentComponent},
    {path:'flowChart', component:FlowchartComponent},
    {path:'selection', component:DataselectionComponent},
    {path:'xesdocument', component:XesdocumentComponent},
    {path:'flowchartd3', component:D3flowchartComponent},
    {path:'insights', component:ProcessinsightsComponent},
    {path:'**', redirectTo:'/upload', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessIntelligenceRoutingModule { }
