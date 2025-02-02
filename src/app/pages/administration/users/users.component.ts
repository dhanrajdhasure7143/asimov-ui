import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { APP_CONFIG } from "src/app/app.config";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import { LoaderService } from "src/app/services/loader/loader.service";
import { columnList } from "src/app/shared/model/table_columns";
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { TitleCasePipe } from "@angular/common";
import { DataTransferService } from "src/app/pages/services/data-transfer.service";
import { ConfirmationService } from "primeng/api";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
  providers:[columnList]
})
export class UsersComponent implements OnInit {
  users: any;
  userslist = [];
  loggedinUser: string;
  freetrail: string;
  columns_list:any[]=[];
  table_searchFields:any[]=[];
  userData: any;
  categories: any[]=[];
  allRoles: any[];
  roles = [];
  isdprtDisabled: boolean = false;
  people = [{ name: "test", id: "01" }];
  isdisabled: boolean = true;
  departments:any[] = [];
  role: any;
  depts: any = [];
  errShow: boolean = false;
  emailRequired: boolean = false;
  inviteUserForm: FormGroup;
  public inviteeMail: any;
  hideInvitePopUp:boolean = false;
  department:any
  userRole: any;
  isUpdate:boolean=false;

  constructor(
    private rest_api: RestApiService,
    private router: Router,
    @Inject(APP_CONFIG) private config,
    private loader: LoaderService,
    private columnList: columnList,
    private titlecasePipe:TitleCasePipe,
    private dataTransfer: DataTransferService,
    private confirmationService:ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.freetrail = localStorage.getItem("freetrail");
    this.columns_list = this.columnList.users_columns
    this.table_searchFields=["firstName","email","designation","department","roles","created_at","status"];
    this.getAllCategories();
    this.getRoles();
  }
  getUsers() {
    this.loader.show();
    this.loggedinUser = localStorage.getItem("ProfileuserId");
    let masterTenant=localStorage.getItem("masterTenant")
    let tenantid=localStorage.getItem("tenantName")
    this.rest_api.getuserslist(masterTenant,tenantid)
      .subscribe((resp) => {
        this.users = resp;
        resp.forEach(element => {
          element["user_email"]= element.userId.userId
          element["firstName"]= element.userId.firstName
          element["lastName"]= element.userId.lastName
          element["user_role"] = element.roleID.displayName
          element["fullName"] = this.titlecasePipe.transform(element.userId.firstName)+' '+this.titlecasePipe.transform(element.userId.lastName)
        });
        this.dataTransfer.tenantBasedUsersList(resp)
        this.loader.hide();
        this.userslist = [];
        this.users.forEach((element) => {
          let roles: any;
          let roleslist: any;
          roles = element.rolesEntityList;
          roles.forEach((element1) => {
            roles = element1.name;
          });
          let name = null;
          if (
            element.userId.firstName != null &&
            element.userId.lastName != null
          ) {
            name = element.userId.firstName + " " + element.userId.lastName;
          }
          let userdata = {
            firstName: name,
            email: element.userId.userId,
            designation: element.userId.designation,
            department: element.departmentsList,
            roles: roles,
            created_at: new Date(element.created_at),
            status: this.titlecasePipe.transform(element.user_role_status),
          };
          this.userslist.push(userdata);
        });
      });
  }

  deleteUser(data) {
      this.confirmationService.confirm({
        header:'Are you sure?',
        message:"Do you want to delete this user? This can't be undo.",
        acceptLabel:'Yes',
        rejectLabel:'No',
        rejectButtonStyleClass: ' btn reset-btn',
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        rejectIcon: 'null',
        acceptIcon: 'null',
         accept:()=>{
        this.loader.show();
        this.rest_api.deleteSelectedUser(data.email).subscribe(
          (resp) => {
            let value: any = resp;
            if (value.message === "User Deleted Successfully") {
              this.getUsers();
              this.toastService.showSuccess(this.toastMessages.userDelete,'response');
            } else {
              this.toastService.showError(this.toastMessages.deleteError);
              this.loader.hide();
            }
          },
          (err) => {
            this.toastService.showError(this.toastMessages.deleteError);
            this.loader.hide();
          }
        );
      }
    });
  }

  openInviteUserOverlay(){
    if (this.freetrail == "true") {
      if (this.users.length == this.config.inviteUserfreetraillimit) {
        this.confirmationService.confirm({
          header: 'Error',
          message: 'You have limited access to this product. Please contact the EZFlow support team for more details.',
          acceptLabel: 'Ok',
          acceptButtonStyleClass: 'btn bluebg-button',
          rejectVisible: false,
          defaultFocus: 'none',
          acceptIcon: 'null'
      })
      } else {
        this.router.navigate(["/pages/admin/invite-user"]);
      }
    } else {
      this.hideInvitePopUp = true;
      this.isUpdate=false;
      this.inviteeMail=null;
      this.role=null;
      this.departments=null;
      // this.router.navigate(["/pages/admin/invite-user"]);
    }
  }

  modifyUser(data) {
    if (data.email !== this.loggedinUser){
    let department = [];
    var roles1: any = [];
    this.department = [];
    this.isUpdate=true;
    department = data.department;
    let userroles: any;
    userroles = data.roles;
    this.userData=[];
    this.userData={id:data.email,role: userroles,dept: department}
    this.hideInvitePopUp = true;
    this.allRoles.forEach((x) => {
      if (x.displayName === this.userData.role) {
        roles1.push(x.id);
      }
    });
    if (this.userData.dept.length == 1) {
      this.categories.forEach((x) => {
        if (x.categoryName === this.userData.dept[0]) {
          this.department.push(x.categoryId);
        }
      });
    } else {
      this.userData.dept.forEach((element) => {
        this.categories.forEach((x) => {
          if (x.categoryName === element) {
            this.department.push(x.categoryId);
          }
        });
      });
    }

    if (roles1[0] == "8") {
      this.isdprtDisabled = true;
    }
    this.inviteeMail = data.email;
    this.departments = this.department;
    this.role = roles1[0];
    // this.router.navigate(["/pages/admin/modify-user"], {
    //   queryParams: { id: data.email, role: userroles, dept: depts },
    // });
  }
}

  getreducedValue(value) {
    if (value.length > 15) return value.substring(0, 16) + "...";
    else return value;
  }

  closeOverlay(event) {
    this.hideInvitePopUp= event;
    this.role='';
    this.departments=[];

  }

  getAllCategories() {
    this.rest_api.getDepartmentsList().subscribe((resp) => {
      this.categories = resp.data;
      this.getRoles();
    });
  }
  getRoles() {
    this.rest_api.getAllRoles(2).subscribe((resp) => {
      this.allRoles = resp;
    });
  }

  updateUser() {
    let roles_list = [];
    this.errShow = false;
    roles_list.push(this.role);
    if (this.departments.length == 0) {
      this.errShow = true;
      return;
    }
    let body = {
      userId: this.inviteeMail,
      department: this.departments.toString(),
      rolesList: roles_list,
    };
    this.loader.show();
    this.rest_api.updateUserRoleDepartment(body).subscribe((resp) => {
      if (resp.message ==="Successfuly updated role of an user for particular application") {
        this.toastService.showSuccess(this.toastMessages.userUpdate, 'response');
        this.hideInvitePopUp = false;
        this.getUsers();
      } else {
        this.loader.hide();
        // this.messageService.add({severity:'error',summary:'Error',detail:resp.message})
        this.toastService.showError(resp.message);

      }
    });
  }

  onchangeRole(event) {
    let value = event.value

    if (value == "8") {
      this.departments = [];
      this.categories.forEach((element) => {
        this.departments.push(element.categoryId);
      });
      this.isdprtDisabled = true;
    } else {
      this.departments =undefined;
      //this.departments=this.depts;
      this.isdprtDisabled = false;
    }
  }

  onEmailChange() {
    this.emailRequired = false;
  }

  myemailFunction() {
    this.emailRequired = false;
    $("#email").on("input", function () {
      $(".upload").prop("disabled", true);
      var el = document.getElementById("email");
      el.addEventListener("keydown", function (event) {
        if (event.keyCode == 8) {
          $(".upload").prop("disabled", false);
        }
        if (event.keyCode == 46) {
          $(".upload").prop("disabled", false);
        }
      });
    });
  }

  resetUserInvite(form: NgForm) {
    form.resetForm();
    // this.departments=[];
    // this.role=null;
    form.form.markAsPristine();
    form.form.markAsUntouched();
  }

  inviteUser1(form) {
    this.loader.show();
    let body = {
      inviterMailId: localStorage.getItem("ProfileuserId"),
      inviteeMailId: this.inviteeMail.toLowerCase(),
      departmentId: this.departments.toString(),
      office365User: false,
      userProduct:environment.product,
      redirectionUrl: this.config.platform_home_url,
      tenantId:localStorage.getItem("tenantName"),
      masterTenant:localStorage.getItem("masterTenant"),
      userRoles: [
        {
          id: this.role,
        },
      ],
    };
    var office = localStorage.getItem("officeUser");
    if (office != undefined && office != null && office === "officeUser") {
      body = {
        inviterMailId: localStorage.getItem("ProfileuserId"),
        inviteeMailId: this.inviteeMail.toLowerCase(),
        departmentId: this.departments.toString(),
        office365User: true,
        userProduct:environment.product,
        redirectionUrl: this.config.platform_home_url,
        tenantId:localStorage.getItem("tenantName"),
        masterTenant:localStorage.getItem("masterTenant"),
        userRoles: [
          {
            id: this.role,
          },
        ],
      };
    }
    var domianArr = this.inviteeMail.split("@");
    this.rest_api.getWhiteListedDomain(domianArr[1].toLowerCase()).subscribe((res) => {
        if (res.Message &&res.Message === "White listed domain.. Please proceed with invite") {
          this.rest_api.inviteUserwithoutReg(body).subscribe((resp) => {
            if (resp.message === "User invited Successfully !!") {
              this.toastService.showSuccess(this.toastMessages.userInvite, 'response');
              this.getUsers();
              this.loader.hide();
            this.hideInvitePopUp= false;

            } else {
              this.toastService.showError(this.toastMessages.InviteFail);
            this.loader.hide();
            }
          });
        } else if (res.errorMessage) {
          this.toastService.showError(res.errorMessage);
          this.loader.hide();
          return;
        } else {
          this.loader.hide();
          this.toastService.showError(this.toastMessages.InviteFail);
        }
      });
  }

  onchangeRole1(value) {
    this.departments = [];
    if (value == "8") {
      this.categories.forEach((element) => {
        this.departments.push(element.categoryId);
      });
      this.isdprtDisabled = true;
    } else {
      this.isdprtDisabled = false;
    }
  }
  
}
