import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  emailRequired: boolean = false;
  inviteUserForm:FormGroup;
  categories: Object;
  allRoles: any;

  constructor(private formBuilder: FormBuilder,private api:RestApiService, private router: Router,private spinner:NgxSpinnerService ) { }

  ngOnInit(): void {
    this.inviteUserForm=this.formBuilder.group({
      inviteeMail: ["", Validators.compose([Validators.required])],
      departments: ["", Validators.compose([Validators.required])],
      role: ["", Validators.compose([Validators.required])]
      })
    this.getAllCategories();
    this.getRoles();
  }

  onEmailChange(){
     this.emailRequired = false;
  }

  myemailFunction()
 {
   this.emailRequired = false;
  // $("#excel").empty();
  // this.selectedFile=null;
  $("#email").on("input", function(){
    // Print entered value in a div box
    $('.upload').prop('disabled', true);
    var el = document.getElementById('email'); 
    el.addEventListener('keydown', function(event) { 
      // Checking for Backspace. 
      if (event.keyCode == 8) { 
          //alert('Backspace is Pressed!'); 
          $('.upload').prop('disabled', false);
      }  
      if (event.keyCode == 46) { 
        $('.upload').prop('disabled', false);
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

getAllCategories(){
  this.api.getDepartmentsList().subscribe(resp => {
    this.categories = resp.data; 
  })
 }
 getRoles(){
  this.api.getAllRoles(2).subscribe(resp => {
    this.allRoles = resp;
  console.log("roles====",this.allRoles)})

 }

 resetUserInvite(){
  this.inviteUserForm.reset();
  this.inviteUserForm.get("departments").setValue("");
  this.inviteUserForm.get("inviteeMail").setValue("");
  this.inviteUserForm.get("role").setValue("");
 }

 inviteUser(){
  this.spinner.show();
   let body = {
    "inviterMailId": localStorage.getItem('ProfileuserId'),
    "inviteeMailId": this.inviteUserForm.value.inviteeMail,
    "departmentId": this.inviteUserForm.value.departments.toString(),
    "userRoles":[
        {
            "id":this.inviteUserForm.value.role
        }
    ]
   }
   this.api.inviteUserwithoutReg(body).subscribe(resp => {
     if(resp.message==="User invited Successfully !!"){
      this.spinner.hide();
      Swal.fire({
        title: 'Success',
        text: "User Invited Successfully !!",
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#007bff',
        heightAuto: false,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
    }).then((result) => {
      this.resetUserInvite();
      this.router.navigate(['/pages/admin/user-management'])
    }) 
    }else {
      Swal.fire("Error",resp.message,"error");
    }
   });
  }
}