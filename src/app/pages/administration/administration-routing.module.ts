import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAddScreenComponent } from './admin-add-screen/admin-add-screen.component';
import { AdminScreenListComponent } from './admin-screen-list/admin-screen-list.component';
import { AdministrationComponent } from './administration.component';
import { CreateDepartmentComponent } from './departments/create-department/create-department.component';
import { EditDepartmentComponent } from './departments/edit-department/edit-department.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserScreenComponent } from './user-screen/user-screen.component';


const routes: Routes = [
  {path:'', component:AdministrationComponent, children:[
    {path:'user-management', component:UserManagementComponent},
    {path:'create-department', component:CreateDepartmentComponent},
    {path:'edit-department', component:EditDepartmentComponent},
    {path:'admin-screen-list', component:AdminScreenListComponent},
    {path:'admin-screen-create', component:AdminAddScreenComponent},
    {path:'user', component:UserScreenComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }