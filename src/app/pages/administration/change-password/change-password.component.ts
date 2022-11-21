import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';

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
  public passwordvalidatemsg: boolean = true;

  constructor( private api:RestApiService, private loader:LoaderService) { }

  ngOnInit(): void {
  }

  passwordChange(form:NgForm){
    this.loader.show()
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
    this.loader.hide();
  }else if(res.errorMessage === "Your current password was incorrect."){
      Swal.fire("Error","Please check your current password!","error");
      this.loader.hide(); 
    }else if(res.errorMessage === "The new password must be different from your previous used passwords"){
      Swal.fire("Error",res.errorMessage,"error");
      this.loader.hide(); 
    }
    else if(res.errorMessage === "The new password must be different from your current password"){
      Swal.fire("Error",res.errorMessage,"error");
      this.loader.hide(); 
    }
  }, err => {
    this.loader.hide();
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
