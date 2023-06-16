import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { inject } from '@angular/core/testing';
import { APP_CONFIG } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader/loader.service';
import {MessageService ,ConfirmationService} from 'primeng/api'

@Component({
  selector: "app-invite-user",
  templateUrl: "./invite-user.component.html",
  styleUrls: ["./invite-user.component.css"],
})
export class InviteUserComponent implements OnInit {
  emailRequired: boolean = false;
  inviteUserForm: FormGroup;
  categories: any = [];
  allRoles: any;
  public inviteeMail: any;
  public departments: any[] = [];
  public role: any;
  isdprtDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: RestApiService,
    private router: Router,
    private loader: LoaderService,
    @Inject(APP_CONFIG) private config,
    private messageService:MessageService,
    private confirmationService:ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getRoles();
  }

  onEmailChange() {
    this.emailRequired = false;
  }

  myemailFunction() {
    this.emailRequired = false;
    // $("#excel").empty();
    // this.selectedFile=null;
    $("#email").on("input", function () {
      // Print entered value in a div box
      $(".upload").prop("disabled", true);
      var el = document.getElementById("email");
      el.addEventListener("keydown", function (event) {
        // Checking for Backspace.
        if (event.keyCode == 8) {
          //alert('Backspace is Pressed!');
          $(".upload").prop("disabled", false);
        }
        if (event.keyCode == 46) {
          $(".upload").prop("disabled", false);
        }
      });
    });
  }

  //  inputlettersEmail(event): boolean {
  //   var regex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
  //   var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  //     if (!regex.test(key)) {
  //       event.preventDefault();
  //       return false;
  //     }
  // }

  getAllCategories() {
    this.api.getDepartmentsList().subscribe((resp) => {
      this.categories = resp.data;
    });
  }
  getRoles() {
    this.api.getAllRoles(2).subscribe((resp) => {
      this.allRoles = resp;
    });
  }

  resetUserInvite(form: NgForm) {
    form.resetForm();
    form.form.markAsPristine();
    form.form.markAsUntouched();
  }

  inviteUser(form) {
    this.loader.show();
    let body = {
      inviterMailId: localStorage.getItem("ProfileuserId"),
      inviteeMailId: this.inviteeMail.toLowerCase(),
      departmentId: this.departments.toString(),
      office365User: false,
      redirectionUrl: this.config.platform_home_url,
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
        redirectionUrl: this.config.platform_home_url,
        userRoles: [
          {
            id: this.role,
          },
        ],
      };
    }

    var domianArr = this.inviteeMail.split("@");
    this.api
      .getWhiteListedDomain(domianArr[1].toLowerCase())
      .subscribe((res) => {
        if (
          res.Message &&
          res.Message === "White listed domain.. Please proceed with invite"
        ) {
          this.api.inviteUserwithoutReg(body).subscribe((resp) => {
            if (resp.message === "User invited Successfully !!") {
              // Swal.fire({
              //   title: "Success",
              //   text: "User Invited Successfully !!",
              //   position: "center",
              //   icon: "success",
              //   showCancelButton: false,
              //   customClass: {
              //     confirmButton: 'btn bluebg-button',
              //     cancelButton:  'btn new-cancelbtn',
              //   },
              //   heightAuto: false,
               
              //   confirmButtonText: "Ok",
              // }).then((result) => {
                this.confirmationService.confirm({
                  header:'Success',
                  message:'User Invited Successfully !!',
                  icon: "success",
                  acceptLabel:'OK',
                  rejectVisible:false,
                  acceptButtonStyleClass: 'btn bluebg-button',
                  defaultFocus: 'none',
                  acceptIcon: 'null',
                  accept:()=>{
                this.resetUserInvite(form);
                // this.router.navigate(["/pages/admin/user-management"]);
                this.userManagementUrl();
              },
            })
            }
             else {
              // Swal.fire(
              //   "Error",
              //   "Failed to invite! Check if user already exists!!",
              //   "error"
              // );
              this.messageService.add({severity:'error',summary:'Error',detail:'Failed to invite! Check if user already exists RRR!!'})
            }
            this.loader.hide();
          });
        } else if (res.errorMessage) {
          // Swal.fire("Error", res.errorMessage, "error");
          this.messageService.add({severity:'error',summary:'Error',detail:res.errorMessage})
          this.loader.hide();
          return;
        } else {
          this.loader.hide();
          // Swal.fire(
          //   "Error",
          //   "Failed to invite! Check if user already exists!!",
          //   "error"
          // );
          this.messageService.add({severity:'error',summary:'Error',detail:'Failed to invite! Check if user already exists!!'})
        }
      });
  }

  onchangeRole(value) {
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
  userManagementUrl(){
    this.router.navigate(["/pages/admin/user-management"],{
      queryParams:{index:0}
    })
  }
}