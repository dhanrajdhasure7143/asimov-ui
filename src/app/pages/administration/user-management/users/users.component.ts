import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { APP_CONFIG } from "src/app/app.config";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import { LoaderService } from "src/app/services/loader/loader.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {

  users: any;
  userslist = [];
  loggedinUser: string;
  freetrail: string;
  columns_list:any[]=[];
  table_searchFields:any[]=[];

  constructor(
    private rest_api: RestApiService,
    private router: Router,
    @Inject(APP_CONFIG) private config,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.freetrail = localStorage.getItem("freetrail");
    this.columns_list = [
      {ColumnName: "firstName",DisplayName: "Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "email",DisplayName: "Email",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "designation",DisplayName: "Designation",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "department",DisplayName: "Department",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "roles",DisplayName: "Roles",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "created_at_modified",DisplayName: "Created At",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
      {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "action",DisplayName: "Action",ShowGrid: true,ShowFilter: false,sort: false},
    ];
    this.table_searchFields=["firstName","email","designation","department","roles","created_at_modified","status"]
  }
  getUsers() {
    this.loader.show();
    this.loggedinUser = localStorage.getItem("ProfileuserId");
    this.rest_api
      .getuserslist(localStorage.getItem("tenantName"))
      .subscribe((resp) => {
        this.users = resp;
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
            created_at: element.created_at,
            created_at_modified: moment(new Date(element.created_at)).format("lll"),
            status: element.user_role_status,
          };
          this.userslist.push(userdata);
        });
      });
  }

  deleteUser(data) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      heightAuto: false,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.loader.show();
        this.rest_api.deleteSelectedUser(data.email).subscribe(
          (resp) => {
            let value: any = resp;
            if (value.message === "User Deleted Successfully") {
              this.getUsers();
              Swal.fire({
                title: "Success",
                text: "User Deleted Successfully!!",
                position: "center",
                icon: "success",
                showCancelButton: false,
                confirmButtonColor: "#007bff",
                cancelButtonColor: "#d33",
                heightAuto: false,
                confirmButtonText: "Ok",
              });
            } else {
              Swal.fire("Error", "Failed to delete user", "error");
              this.loader.hide();
            }
          },
          (err) => {
            Swal.fire("Error", "Failed to delete user", "error");
            this.loader.hide();
          }
        );
      }
    });
  }

  inviteUser() {
    if (this.freetrail == "true") {
      if (this.users.length == this.config.inviteUserfreetraillimit) {
        Swal.fire({
          title: "Error",
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: "center",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#007bff",
          cancelButtonColor: "#d33",
          heightAuto: false,
          confirmButtonText: "Ok",
        });
      } else {
        this.router.navigate(["/pages/admin/invite-user"]);
      }
    } else {
      this.router.navigate(["/pages/admin/invite-user"]);
    }
  }

  modifyUser(data) {
    let depts = [];
    depts = data.department;
    let userroles: any;
    userroles = data.roles;
    this.router.navigate(["/pages/admin/modify-user"], {
      queryParams: { id: data.email, role: userroles, dept: depts },
    });
  }

  getreducedValue(value) {
    if (value.length > 15) return value.substring(0, 16) + "...";
    else return value;
  }

}
