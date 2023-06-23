import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../services/rest-api.service';
import { ConfirmationService, MessageService } from 'primeng/api';

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
  public passwordvalidatemsg: boolean = false;
  isFormOverlay: boolean = false;
  @Output() valueChange = new EventEmitter();

  constructor( private api:RestApiService, 
    private loader:LoaderService,
    private messageService:MessageService,
    private confirmationService:ConfirmationService
    ) { }

  ngOnInit(): void {
  }

  passwordChange(form:NgForm){
    let pswdbody = {
      "confirmPassword": this.pswdmodel.confirmPassword,
      "currentPassword": this.pswdmodel.currentPassword,
      "newPassword":this.pswdmodel.confirmPassword,
      "userId": localStorage.getItem('ProfileuserId')
    }
  this.api.changePassword(pswdbody).subscribe(res => {
  // this.pswdmodel = {};
  if(res.errorMessage === undefined){
    // Swal.fire({
    //   title: "Success",
    //   text: "Password Updated successfully!",
    //   position: 'center',
    //   icon: 'success',
    //   showCancelButton: false,
    //   customClass: {
    //     confirmButton: 'btn bluebg-button',
    //     cancelButton:  'btn new-cancelbtn',
    //   },

    //   confirmButtonText: 'Ok'
    // });

    this.loader.hide();
    this.confirmationService.confirm({
     header:'Success',
     message:'Password updated successfully!',
     acceptLabel:'Ok',
     rejectVisible:false,
     acceptButtonStyleClass:'btn bluebg-button',
     defaultFocus:'none',
    accept:()=>{
      this.valueChange.emit(this.isFormOverlay);
       form.resetForm();
    }})
  }else if(res.errorMessage === "Your current password was incorrect."){
      // Swal.fire("Error","Please check your current password!","error");
      this.messageService.add({severity:'error',summary:'Error',detail:'Please check your current password!'})

      this.loader.hide(); 
    }else if(res.errorMessage === "The new password must be different from your previous used passwords"){
      // Swal.fire("Error",res.errorMessage,"error");
        this.messageService.add({severity:'error',summary:'Error',detail:res.errorMessage})
      this.loader.hide(); 
    }
    else if(res.errorMessage === "The new password must be different from your current password"){
      // Swal.fire("Error",res.errorMessage,"error");
      this.messageService.add({severity:'error',summary:'Error',detail:res.errorMessage})
      this.loader.hide(); 
    }
  }, err => {
    this.loader.hide();
    // console
    // Swal.fire("Error","Please check your current password!","error");
    this.messageService.add({severity:'error',summary:'Error',detail:'Please check your current password!'})
  })
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
