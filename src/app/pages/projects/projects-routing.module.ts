import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsListScreenComponent } from './projects-list-screen/projects-list-screen.component';


const routes: Routes = [
  {path:'', component:ProjectsComponent, children:[
    {path:'listOfProjects', component:ProjectsListScreenComponent},
    {path:'**', redirectTo:'/listOfProjects', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
