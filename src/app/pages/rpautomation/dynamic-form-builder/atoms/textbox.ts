import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

// text,email,tel,textarea,password,
@Component({
    selector: 'textbox',
    template: `
      <div [formGroup]="form">



      <input [attr.disabled]="feilddisable" autocomplete="off" [required]="field.required" *ngIf="field.type=='password'"  [id]="field.id" [minlength]="field.attributeMin" [maxlength]="field.attributeMax" [value]="field.value" [attr.type]="showpassword==true?'text':'password'" [attr.placeholder]="field.placeholder" class="form-control"  [name]="field.name" [formControlName]="field.name+'_'+field.id">
      <span type="button" class="password-btn" *ngIf="field.type=='password' && field.name!='fillValue'" (click)="showpassword==true?showpassword=false:showpassword=true;">
        <i *ngIf="showpassword==false" class="pi pi-eye"></i>
        <i *ngIf="showpassword==true" class="pi pi-eye-slash"></i>
      </span>

          <input [attr.disabled]="feilddisable" [hidden]="field.name=='loggedUser'" *ngIf="!field.multiline && field.type!='password' && field.type!='textarea'" [id]="field.id" [minlength]="field.attributeMin" [maxlength]="field.attributeMax" (keydown)="stope($event)" autocomplete="off" [required]="field.required==true"  [value]="field.value" [attr.type]="field.type" [attr.placeholder]="field.placeholder" class="form-control" [name]="field.name" [formControlName]="field.name+'_'+field.id">
          <textarea [attr.disabled]="feilddisable" [minlength]="field.attributeMin" [maxlength]="field.attributeMax"  [id]="field.id"  *ngIf="field.type=='textarea' && field.type!='password'" autocomplete="off" [formControlName]="field.name+'_'+field.id" [required]="field.required==true" rows="4" class="form-control" [placeholder]="field.placeholder">{{field.value}}</textarea>

      </div>
    `,
    styles:[`
    .form-control
      {
        border-radius:0px;
        border-top:none;
        border-right:none;
        border-left:none;
        box-shadow:none;
     }
    .password-btn{
      float: right;
      padding-right:5px;
      margin-top: -28px;
      cursor:pointer;
    }
    `
]
})
export class TextBoxComponent  implements OnInit  {
    @Input() field:any = {};
    @Input() form:FormGroup;
    showpassword:Boolean=false;
    get isValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
    get isDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
    @Input('feilddisable') public feilddisable:boolean;
    constructor() {

    }


    ngOnInit(): void {
      if(this.field.name=="loggedUser")
      {
        let loggedUserDetails=JSON.stringify({loggedUser:localStorage.getItem("ProfileuserId"), tenantId:localStorage.getItem("tenantName")})
        this.form.get(this.field.name+"_"+this.field.id).setValue(loggedUserDetails);
      }
    }
    stope(event)
    {
      if(this.field.type=='number')
      return event.keyCode !== 69
    }
}
