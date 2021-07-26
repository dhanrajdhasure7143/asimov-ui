import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsListScreenComponent } from './projects-list-screen/projects-list-screen.component';
import { ProjectsProgramsTableComponent } from './projects-list-screen/projects-programs-table/projects-programs-table.component';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import { ProjectDetailsScreenComponent } from './project-details-screen/project-details-screen.component';
import { ProjectsDashboardComponent } from './projects-dashboard/projects-dashboard.component';
import { ProjectRepoScreenComponent } from './project-repo-screen/project-repo-screen.component';
import { ProgramDetailsComponent } from './program-details/program-details.component';


const routes: Routes = [
  {path:'', component:ProjectsComponent, children:[
    
    {path:'listOfProjects', component:ProjectsListScreenComponent},
    {path: "projectreposcreen", component:ProjectRepoScreenComponent},
    {path:'createprojects', component:CreateProjectsComponent},
    {path:'projectdetails', component:ProjectDetailsScreenComponent},
    {path:'projectdashboard', component:ProjectsDashboardComponent},
    {path:'programdetails', component:ProgramDetailsComponent},
    {path:'create-projects', component:CreateProjectsComponent},
    {path:"", component:ProjectsProgramsTableComponent},
    {path:'**', redirectTo:'/listOfProjects', pathMatch: 'full'}
    
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }

