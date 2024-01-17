import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { MatTableModule } from '@angular/material/table';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxSpinnerModule } from "ngx-spinner";
import { ModalModule, BsModalRef  } from 'ngx-bootstrap/modal';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyAccountComponent } from './myaccount/myaccount.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng5SliderModule } from 'ng5-slider';
import {MatSliderModule} from '@angular/material/slider';
import {NgxPaginationModule} from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu'; 
import {CustomMatPaginatorIntl} from './../../shared/custom-mat-paginator-int';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { CompareValidatorDirective } from './comparepsw-validator.directive';
import { DepartmentsComponent } from './departments/departments.component';
import { CreateDepartmentComponent } from './departments/create-department/create-department.component';
import { EditDepartmentComponent } from './departments/edit-department/edit-department.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserPipePipe } from './pipes/user-pipe.pipe';
import { UsersComponent } from './user-management/users/users.component';
import { InviteUserComponent } from './user-management/users/invite-user/invite-user.component';
import { ModifyUserComponent } from './user-management/users/modify-user/modify-user.component';
import { UserScreenComponent } from './user-screen/user-screen.component';
import { AdminAddScreenComponent } from './admin-add-screen/admin-add-screen.component';
import { AdminScreenListComponent } from './admin-screen-list/admin-screen-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScreenGenerationDynamicFormComponent } from 'src/app/shared/screen-generation-dynamic-form/screen-generation-dynamic-form.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ManageCustomerBotComponent } from './manage-customer-bot/manage-customer-bot.component';
import { TrainCustomerSupportBotComponent } from './train-customer-support-bot/train-customer-support-bot.component';
import { columnList } from 'src/app/shared/model/table_columns';
import { ViewCustomerBotDetailsComponent } from './view-customer-bot-details/view-customer-bot-details.component';

const materialModules: any[] = [
    
    
  ];

@NgModule({
  declarations: [AdministrationComponent, MyAccountComponent,CompareValidatorDirective, DepartmentsComponent, CreateDepartmentComponent, EditDepartmentComponent, UserManagementComponent, ChangePasswordComponent, UserPipePipe, UsersComponent, InviteUserComponent, ModifyUserComponent,
    UserScreenComponent,
    AdminAddScreenComponent,AdminScreenListComponent, ManageCustomerBotComponent, TrainCustomerSupportBotComponent, ViewCustomerBotDetailsComponent],
  imports: [
    Ng2TelInputModule,
    CommonModule,
    AdministrationRoutingModule,
    materialModules,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatTableModule,ReactiveFormsModule,FormsModule, MatSortModule,MatSliderModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatMenuModule,MatButtonModule,NgxSpinnerModule,NgxPaginationModule,
    ModalModule.forRoot(),
    MatProgressBarModule,NgSelectModule,Ng5SliderModule,
    SharedModule,
    PrimengCustomModule
  ],
  providers:[
    BsModalRef, 
    columnList ,
  {
      provide: MatPaginatorIntl, 
      useClass: CustomMatPaginatorIntl
    },
    toastMessages

  ]
})
export class AdministrationModule { }
