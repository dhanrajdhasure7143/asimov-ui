import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAddScreenComponent } from './admin-add-screen/admin-add-screen.component';
import { AdminScreenListComponent } from './admin-screen-list/admin-screen-list.component';
import { AdministrationComponent } from './administration.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CreateDepartmentComponent } from './departments/create-department/create-department.component';
import { DepartmentsComponent } from './departments/departments.component';
import { EditDepartmentComponent } from './departments/edit-department/edit-department.component';
import { MyAccountComponent } from './myaccount/myaccount.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { InviteUserComponent } from './user-management/users/invite-user/invite-user.component';
import { ModifyUserComponent } from './user-management/users/modify-user/modify-user.component';
import { UserScreenComponent } from './user-screen/user-screen.component';


const routes: Routes = [
  {path:'', component:AdministrationComponent, children:[
    
    {path:'myaccount', component:MyAccountComponent},
    {path:'user-management', component:UserManagementComponent},
    {path:'create-department', component:CreateDepartmentComponent},
    {path:'edit-department', component:EditDepartmentComponent},
    {path:'changepassword', component:ChangePasswordComponent},
    {path:'invite-user', component:InviteUserComponent},
    {path:'modify-user', component:ModifyUserComponent},
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

