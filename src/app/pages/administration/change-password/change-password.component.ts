import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  pswdmodel:any = {};
  public eyeshow: boolean = true;
  public neweyeshow: boolean = true;
  public confeyeshow: boolean = true;

  constructor( private api:RestApiService, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
  }

  passwordChange(form:NgForm){
    this.spinner.show()
    let pswdbody = {
      "confirmPassword": this.pswdmodel.confirmPassword,
      "currentPassword": this.pswdmodel.currentPassword,
      "newPassword":this.pswdmodel.confirmPassword,
      "userId": localStorage.getItem('ProfileuserId')
    }
  this.api.changePassword(pswdbody).subscribe(res => {
  // this.pswdmodel = {};
  if(res.errorMessage === undefined){
    Swal.fire({
      title: "Success",
      text: "Password Updated successfully!",
      position: 'center',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    });
    this.spinner.hide();
  }else if(res.errorMessage === "Your current password was incorrect."){
      Swal.fire("Error","Please check your current password!","error");
      this.spinner.hide(); 
    }else if(res.errorMessage === "The new password must be different from your previous used passwords"){
      Swal.fire("Error",res.errorMessage,"error");
      this.spinner.hide(); 
    }
    else if(res.errorMessage === ""){
      Swal.fire("Error",res.errorMessage,"error");
      this.spinner.hide(); 
    }
  }, err => {
    this.spinner.hide();
    // console
    Swal.fire("Error","Please check your current password!","error");})
 form.resetForm();
  }

  curreyetoggle() {
    this.eyeshow = !this.eyeshow;
  }
  neweyetoggle() {
    this.neweyeshow = !this.neweyeshow;
  }
  confeyetoggle() {
    this.confeyeshow = !this.confeyeshow;
  }

}
