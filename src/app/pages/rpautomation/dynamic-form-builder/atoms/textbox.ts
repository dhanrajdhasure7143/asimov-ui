import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

// text,email,tel,textarea,password,
@Component({
    selector: 'textbox',
    template: `
      <div [formGroup]="form">



      <input [attr.disabled]="feilddisable" autocomplete="off" [required]="field.required" *ngIf="field.type=='password'"  [id]="field.id" [minlength]="field.attributeMin" [maxlength]="field.attributeMax" [value]="field.value" [attr.type]="showpassword==true?'text':'password'" [attr.placeholder]="field.placeholder" class="form-control"  [name]="field.name" [formControlName]="field.name+'_'+field.id">
          <span type="button" class="password-btn" *ngIf="field.type=='password'" (click)="showpassword==true?showpassword=false:showpassword=true;">
          </span>

          <input [attr.disabled]="feilddisable" *ngIf="!field.multiline && field.type!='password' && field.type!='textarea'" [id]="field.id" [minlength]="field.attributeMin" [maxlength]="field.attributeMax" (keydown)="stope($event)" autocomplete="off" [required]="field.required==true"  [value]="field.value" [attr.type]="field.type" [attr.placeholder]="field.placeholder" class="form-control" [name]="field.name" [formControlName]="field.name+'_'+field.id">
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
      margin-top: -24px;
      cursor:pointer;
    }
    `
]
})
export class TextBoxComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;
    showpassword:Boolean=false;
    get isValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
    get isDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
    @Input('feilddisable') public feilddisable:boolean;
    constructor() {

    }
    stope(event)
    {
      if(this.field.type=='number')
      return event.keyCode !== 69
    }
}
