import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { CompareValidatorDirective } from './comparepsw-validator.directive';
import { DepartmentsComponent } from './departments/departments.component';
import { CreateDepartmentComponent } from './departments/create-department/create-department.component';
import { EditDepartmentComponent } from './departments/edit-department/edit-department.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserPipePipe } from './pipes/user-pipe.pipe';
import { UsersComponent } from './users/users.component';
import { UserScreenComponent } from './user-screen/user-screen.component';
import { AdminAddScreenComponent } from './admin-add-screen/admin-add-screen.component';
import { AdminScreenListComponent } from './admin-screen-list/admin-screen-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ManageCustomerBotComponent } from './manage-customer-bot/manage-customer-bot.component';
import { TrainCustomerSupportBotComponent } from './train-customer-support-bot/train-customer-support-bot.component';
import { columnList } from 'src/app/shared/model/table_columns';
import { ViewCustomerBotDetailsComponent } from './view-customer-bot-details/view-customer-bot-details.component';


@NgModule({
  declarations: [
    AdministrationComponent,
    CompareValidatorDirective, 
    DepartmentsComponent, 
    CreateDepartmentComponent, 
    EditDepartmentComponent, 
    UserManagementComponent,
    UserPipePipe,
    UsersComponent,
    UserScreenComponent,
    AdminAddScreenComponent,AdminScreenListComponent, ManageCustomerBotComponent, TrainCustomerSupportBotComponent, ViewCustomerBotDetailsComponent],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PrimengCustomModule,
    Ng2TelInputModule
  ],
  providers:[
    columnList ,
    toastMessages
  ]
})
export class AdministrationModule { }
