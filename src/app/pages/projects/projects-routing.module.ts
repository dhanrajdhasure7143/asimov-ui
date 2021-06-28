import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsListScreenComponent } from './projects-list-screen/projects-list-screen.component';
import { ProjectsProgramsTableComponent } from './projects-list-screen/projects-programs-table/projects-programs-table.component';
import { CreateProjectsComponent } from './create-projects/create-projects.component';


const routes: Routes = [
  {path:'', component:ProjectsComponent, children:[
    
    {path:'listOfProjects', component:ProjectsListScreenComponent},
    
    {path:'createprojects', component:CreateProjectsComponent},
    {path:"", component:ProjectsProgramsTableComponent},
    {path:'**', redirectTo:'/listOfProjects', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }

