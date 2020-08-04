import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { AppService, UserService } from 'src/app/_services';
import Swal from 'sweetalert2';
// import { element } from '@angular/core/src/render3';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  name: any;
  email: any;
  phone: any;
  role: any;
  hide: boolean = false;
  show: boolean = false;
  iemail: any;
  admin: boolean = true;
  tenantId: any;
  roleName: any;
  inviteeUserId: void;
  result: any = [];
  dbValue: any = [];
  public rolesList: any = [];
  public submitButton: boolean = false
  // public modal_popup_status : boolean = false;
  // @ViewChild('closeModel') closebutton;
  public display = 'none';
  selectedModel: any = {};
  sjdf: any[];
  appSelectedId: any;
  selectedroleId: any;
  resultdemo: any[];
  closeModel: any;
  roleData: any;
  constructor(private route: Router) { }

  ngOnInit() {

    this.tenantId = localStorage.getItem("tenantName")
    this.email = localStorage.getItem("userName");

    // this.userService.getUserApplications().subscribe(data => this.successGetApps(data));



    console.log(this.dbValue);

    this.name = localStorage.getItem("firstName");

    this.phone = localStorage.getItem("phoneNumber");
    this.role = localStorage.getItem("designation");

    //admin based invite visiblity code *********************
    // this.roleName = localStorage.getItem("roleName");

    // if (this.roleName === "Admin") {
    //   this.admin = true
    // }

    if (this.role == "null") {
      this.role = "-- --"
    }


  }
   openTarget(url){
    let isValid = false;
    //logic
    window.open('http://localhost:3000'+url, '_self' );//, '_self'    window.open('http://localhost:3000'+url+'?isValid='+isValid)
  }


  successGetApps(data) {
    console.log("appname", data);
    data.forEach(element => {
      this.dbValue.push(element)

    });


  }
  change(selectedValue) {
    this.submitButton = true
    // console.log("rolesList", this.rolesList);

    console.log(selectedValue);
    this.dbValue.forEach(element => {
      if (element.name == selectedValue) {
        this.appSelectedId = element.appId
        console.log("app selected", this.appSelectedId);
        // this.userService.inviteUsersLimit(selectedValue).subscribe(data => {
        //  // let count = 20;
        //   this.userService.countOfUsersForTenantForProduct(element.appId).subscribe(respData => {this.usersCount(respData, data, element.appId),err=>{
            
        //       Swal.fire({
        //         title: 'NOT_FOUND',
        //         text: "Subscription plan not found for tenat for the product asimov",
        //         type: 'error',
        //         showCancelButton: false,
        //         allowOutsideClick: false
        //       }).then(function () {
        //         //window.location.href = "../Subscription";
        
        //       });
          
        //   }})
         
        // })



      }
    })

  }
  usersCount(respData, data , appID){

    //let user_count = 20;
  let user_count = +respData.users_count;
    if(user_count < +data) {
      // this.userService.getUserRoleForSelectedProduct(appID).subscribe(data => this.userRole(data));
    }else{
      // Swal.fire({
      //   title: 'Error',
      //   text: `You already reached to maximum invitation count...!!`,
      //   type: 'error',
      //   showCancelButton: false,
      //   allowOutsideClick: false
      // }).then(function () {
      //   //window.location.href = "../Subscription";

      // });
    }
      
    
  }
  userRole(data) {
    if (data.message === 'Admin') {
      // this.userService.getSelectedRole(this.appSelectedId).subscribe(data => this.successRoles(data));

      // this.appSelectedId = element.appId
      console.log(this.appSelectedId);
    } else {
      // Swal.fire({
      //   title: 'Error',
      //   text: `You don't have admin role for this product to invite...!!`,
      //   type: 'error',
      //   showCancelButton: false,
      //   allowOutsideClick: false
      // }).then(function () {
      //   //window.location.href = "../Subscription";

      // });
    }
  }



  successRoles(a) {
    this.rolesList = []
    console.log(a);
    this.roleData = a
    a.forEach(ele => {
      this.rolesList.push(ele.name)

      // this.rolesList.forEach(elee =>{


      //   if(elee !== "Admin" ){
      //     // Swal.fire({
      //     //   title: 'Error',
      //     //   text: `You don't have admin role for this product to invite...!!`,
      //     //   type: 'error',
      //     //   showCancelButton: false,
      //     //   allowOutsideClick: false
      //     // })
      //     console.log("dont have permissionnnnnnnnnnn");

      //   }

      // })


    })
  }
  changeRole(e) {
    // this.selectedroleId = []
    this.submitButton = false
    console.log(e);
    this.roleData.forEach(ele => {
      if (ele.name == e) {
        this.selectedroleId = ele.id
      }
    })

  }
  invit(template: TemplateRef<any>) {
    this.selectedModel.roleName = undefined
    this.selectedModel.appName = undefined
    this.submitButton = true;
    // this.modalRef = this.modal.show(template);
    console.log("email", this.iemail);
    console.log("inviteID", this.inviteeUserId);
    // console.log(this.result[0].name);

    // this.selectedModel.appName = this.result[0].name
    this.selectedModel.userId = this.iemail;
    //   this.appSer.invitefriends(inviterMailId, inviteeMailId).subscribe((data:any)=>{
    //   console.log(data);
    //   Swal.fire({
    //     title: 'Success',
    //     text: `Invitation email sent successfully!!`,
    //     type: 'success',
    //     showCancelButton: false,
    //     allowOutsideClick: false
    //   }).then((result) => {
    //     // if (result.value) {

    //     // }
    //   });
    // }, err => {
    //     Swal.fire({
    //       title: 'Error!',
    //       type: 'error',
    //       text: `User already exist`,
    //       allowOutsideClick: false
    //     });
    //   });



  }
  onclickInvite() {
    // this.modal_popup_status = false;
    let inviterMailId = localStorage.getItem("userName");
    let inviteeMailId = this.iemail;
    let reqObj = {
      "id": this.selectedroleId,
      "appliationId": {
        "appId": this.appSelectedId
      }

    }
    // this.appSer.invitefriends(inviterMailId, inviteeMailId, reqObj).subscribe((data: any) => {
    //   console.log("sucess data", data);
    //   Swal.fire({
    //     title: 'Success',
    //     text: `Invitation email sent successfully!!`,
    //     type: 'success',
    //     showCancelButton: false,
    //     allowOutsideClick: false
    //   }).then((result) => {
    //     // if (result.value) {

    //     // }
    //   });
    // }, err => {
    //   Swal.fire({
    //     title: 'Error!',
    //     type: 'error',
    //     text: `User already exist`,
    //     allowOutsideClick: false
    //   });
    // });

  }

  toggle() {
    this.show = !this.show
  }
  invitetoggle() {

    this.hide = !this.hide
  }
  logout(event) {
    // this.appSer.logout();
    this.route.navigate(['/']);
  }
  close() {
    this.submitButton = true
    this.rolesList = []
    this.selectedModel.roleName = undefined
    this.selectedModel.appName = undefined
    // this.modal_popup_status = true;
    // this.modal.hide(template);
    // this.display = "none"

  }
}
