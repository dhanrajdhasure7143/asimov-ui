import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsListScreenComponent } from './projects-list-screen/projects-list-screen.component';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import { ProjectDetailsScreenComponent } from './project-details-screen/project-details-screen.component';
import { ProjectsDashboardComponent } from './projects-dashboard/projects-dashboard.component';
import { ProjectRepoScreenComponent } from './project-repo-screen/project-repo-screen.component';
import { ProgramDetailsComponent } from './program-details/program-details.component';
import { CreateTasksComponent } from './create-tasks/create-tasks.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { BacklogsListComponent } from './backlogs-list/backlogs-list.component';
import { BacklogsCreateComponent } from './backlogs-create/backlogs-create.component';
import { ProjectRpaDesignComponent } from './project-rpa-design/project-rpa-design.component';
import { ProjectTaskListComponent } from './project-details-screen/project-task-list/project-task-list.component';
import { ProjectsDocumentComponent } from './project-details-screen/projects-document/projects-document.component';


const routes: Routes = [
  {path:'', component:ProjectsComponent, children:[
    
    {path:'listOfProjects', component:ProjectsListScreenComponent},
    {path: "projectreposcreen", component:ProjectRepoScreenComponent},
    {path:'createprojects', component:CreateProjectsComponent},
    {path:'projectdetails', component:ProjectDetailsScreenComponent},
    {path:'projectdashboard', component:ProjectsDashboardComponent},
    {path:'programdetails', component:ProgramDetailsComponent},
    {path:'create-projects', component:CreateProjectsComponent},
    {path:'create-task', component:CreateTasksComponent},
    {path:'edit-task', component:EditTaskComponent},
    {path:'backlogsList', component:BacklogsListComponent},
    {path:'createBacklog', component:BacklogsCreateComponent},
    {path:'repdesign',component:ProjectRpaDesignComponent},
    {path:'tasks',component:ProjectTaskListComponent},
    {path:'document',component:ProjectsDocumentComponent},
    {path:'**', redirectTo:'/listOfProjects', pathMatch: 'full'}
    
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }

