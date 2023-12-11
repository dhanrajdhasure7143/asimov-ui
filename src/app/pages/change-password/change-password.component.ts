import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../services/rest-api.service';
import { ConfirmationService } from 'primeng/api';
import { CryptoService } from '../services/crypto.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

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
    private confirmationService:ConfirmationService,
    private cryptoService :CryptoService,
    private toastService: ToasterService,
    private toastMessages: toastMessages
    ) { }

  ngOnInit(): void {
  }

  passwordChange(form:NgForm){
    let pswdbody = {
      "confirmPassword": this.cryptoService.encrypt(this.pswdmodel.confirmPassword),
      "currentPassword": this.cryptoService.encrypt(this.pswdmodel.currentPassword),
      "newPassword": this.cryptoService.encrypt(this.pswdmodel.confirmPassword),
      "userId": localStorage.getItem('ProfileuserId')
    }
  this.api.changePassword(pswdbody).subscribe(res => {
  // this.pswdmodel = {};
  if(res.errorMessage === undefined){

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
      this.toastService.showError(this.toastMessages.passwordCheck);


      this.loader.hide(); 
    }else if(res.errorMessage === "The new password must be different from your previous used passwords"){
        this.toastService.showError(res.errorMessage);
      this.loader.hide(); 
    }
    else if(res.errorMessage === "The new password must be different from your current password"){
      this.toastService.showError(res.errorMessage);
      this.loader.hide(); 
    }
  }, err => {
    this.loader.hide();
    // console
    this.toastService.showError(this.toastMessages.passwordCheck);
    
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
