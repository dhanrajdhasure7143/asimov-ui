import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: "app-modify-user",
  templateUrl: "./modify-user.component.html",
  styleUrls: ["./modify-user.component.css"],
})
export class ModifyUserComponent implements OnInit {
  userData: any;
  categories: any;
  allRoles: any[];
  roles = [];
  roleObj: any;
  roleIds: any[] = [];
  isdprtDisabled: boolean = false;
  people = [{ name: "test", id: "01" }];
  isdisabled: boolean = true;
  departments = [];
  email: any;
  role: any;
  depts: any = [];
  errShow: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private api: RestApiService,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoaderService
  ) {
    this.route.queryParams.subscribe((data) => {
      this.userData = data;
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.loader.show();
    this.api.getDepartmentsList().subscribe((resp) => {
      this.categories = resp.data;
      this.getRoles();
    });
  }
  getRoles() {
    var roles1: any = [];
    this.depts = [];
    this.api.getAllRoles(2).subscribe((resp) => {
      this.allRoles = resp;
      this.allRoles.forEach((x) => {
        if (x.displayName === this.userData.role) {
          roles1.push(x.id);
        }
      });

      if (this.userData.dept.length == 1) {
        this.categories.forEach((x) => {
          if (x.categoryName === this.userData.dept[0]) {
            this.depts.push(x.categoryId);
          }
        });
      } else {
        this.userData.dept.forEach((element) => {
          this.categories.forEach((x) => {
            if (x.categoryName === element) {
              this.depts.push(x.categoryId);
            }
          });
        });
      }

      if (roles1[0] == "8") {
        this.isdprtDisabled = true;
      }
      this.email = this.userData.id;
      this.departments = this.depts;
      this.role = roles1[0];
      setTimeout(() => {
        this.loader.hide();
      }, 500);
    });
    //  })
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
      userId: this.email,
      department: this.departments.toString(),
      rolesList: roles_list,
    };
    this.loader.show();
    this.api.updateUserRoleDepartment(body).subscribe((resp) => {
      if (
        resp.message ===
        "Successfuly updated role of an user for particular application"
      ) {
        this.loader.hide();
        Swal.fire({
          title: "Success",
          text: "User details updated successfully!",
          position: "center",
          icon: "success",
          showCancelButton: false,
          customClass: {
            confirmButton: 'btn bluebg-button',
            cancelButton:  'btn new-cancelbtn',
          },
          heightAuto: false,
         
          confirmButtonText: "Ok",
        }).then((result) => {
          // this.router.navigate(["/pages/admin/user-management"]);
          this.userManagementUrl();
          
        });
      } else {
        this.loader.hide();
        Swal.fire("Error", resp.message, "error");
      }
    });
  }

  onchangeRole(value) {
    if (value == "8") {
      this.departments = [];
      this.categories.forEach((element) => {
        this.departments.push(element.categoryId);
      });
      this.isdprtDisabled = true;
    } else {
      this.departments = [];
      //this.departments=this.depts;
      this.isdprtDisabled = false;
    }
  }
  userManagementUrl(){
      this.router.navigate(["/pages/admin/user-management"],{
        queryParams:{index:0}
      })

  }
}
