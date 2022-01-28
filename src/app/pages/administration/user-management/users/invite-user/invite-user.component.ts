import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
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
  categories: any=[];
  allRoles: any;
  public inviteeMail:any;
  public departments:any[]=[];
  public role:any;
  isdprtDisabled:boolean=false;

  constructor(private formBuilder: FormBuilder,private api:RestApiService, private router: Router,private spinner:NgxSpinnerService ) { }

  ngOnInit(): void {
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
    console.log()
  })
 }
 getRoles(){
  this.api.getAllRoles(2).subscribe(resp => {
    this.allRoles = resp;
 })

 }

 resetUserInvite(form:NgForm){
   
  //  this.inviteeMail='';
  //  this.role=undefined;
  //  this.departments=[];
 form.resetForm();
 form.form.markAsPristine();
form.form.markAsUntouched();
  // this.inviteUserForm.reset();
  // this.inviteUserForm.get("departments").setValue("");
  // this.inviteUserForm.get("inviteeMail").setValue("");
  // this.inviteUserForm.get("role").setValue("");
 }

 inviteUser(form){
  this.spinner.show();
   let body = {
    "inviterMailId": localStorage.getItem('ProfileuserId'),
    "inviteeMailId": this.inviteeMail,
    "departmentId": this.departments.toString(),
    "userRoles":[
        {
            "id":this.role
        }
    ]
   }
   var domianArr = this.inviteeMail.split('@');
   console.log(domianArr[1]);
   this.api.getWhiteListedDomain(domianArr[1]).subscribe(res => {
     if(res.Message && res.Message === "White listed domain.. Please proceed with invite"){
      this.api.inviteUserwithoutReg(body).subscribe(resp => {
        if(resp.message==="User invited Successfully !!"){
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
         this.resetUserInvite(form);
         this.router.navigate(['/pages/admin/user-management'])
       }) 
       }else {
         Swal.fire("Error","Failed to invite! Check if user already exists!!","error");
       }
       this.spinner.hide();
      });
     }else if(res.errorMessage){
      Swal.fire("Error",res.errorMessage,"error");
      this.spinner.hide();
      return;
     }else{
      this.spinner.hide();
      Swal.fire("Error","Failed to invite! Check if user already exists!!","error");
     }
   })
   
  }

  onchangeRole(value){
    console.log(value)
    this.departments=[];
    if(value== '8'){
      this.categories.forEach(element => {
        this.departments.push(element.categoryId)
      });
      this.isdprtDisabled=true;
    }else{
      this.isdprtDisabled=false;
    }
  }

}