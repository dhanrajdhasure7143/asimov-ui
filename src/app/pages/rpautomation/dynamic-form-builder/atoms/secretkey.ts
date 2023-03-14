import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'Secretkey',
    template: `
      <div  [formGroup]="form">
          <input [attr.disabled]="feilddisable" [hidden]="hideInput" [required]="field.required"  [id]="field.id" [minlength]="field.attributeMin" [maxlength]="field.attributeMax" [value]="field.value"  [attr.placeholder]="field.placeholder" class="form-control"  [name]="field.name" [formControlName]="field.name+'_'+field.id" class="form-control" type="text">
          <input  disabled="true" [hidden]="!hideInput" class='form-control' [value]="maskedString" class="form-control" type="text">
          <span class="suffixIconButton" [hidden]="!hideInput" (click)="addNewSecretKey()"><i class="pi pi-times"></i></span>
      </div> 
    `,
    styles:[`
    .suffixIconButton{
        float: right;
        padding-right:10px;
        margin-top: -27px;
        cursor:pointer;
        position:relative;
      }
    `]
})
export class Secretkey implements OnInit {
    @Input() field:any = {};
    @Input() form:FormGroup;
    @Input('feilddisable') public feilddisable:boolean;
    hideInput:Boolean=true;
    maskedString:String="";
    key:String=""
    ngOnInit()
    {
        let inputString = new String(this.field.value);
        (inputString=="")?this.hideInput=false:this.hideInput=true;
        this.key=new String(this.field.value);
        if(inputString.length>4)
            this.maskedString= inputString.substr(0, 2) +("x").repeat(inputString.length-4) +inputString.substr(inputString.length-2, inputString.length);
        else 
            this.maskedString=inputString;
    }

    addNewSecretKey()
    {
        this.form.get(this.field.name+"_"+this.field.id).setValue("");
        this.hideInput=false;
    }
}