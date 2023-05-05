import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { RpaStudioDesignerworkspaceComponent } from '../../rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';

@Component({
    selector: 'dropdown',
    template: `
      <div [formGroup]="form">
        <select [attr.disabled]="feilddisable" [required]="field.required==true" (change)="onChangeEmail($event, field.options, field)" class="form-control" [value]="field.value" [id]="field.id" [formControlName]="field.name+'_'+field.id">
        <option  value="" hidden disabled>{{field.placeholder}}</option>
        <option  value="null" hidden disabled>{{field.placeholder}}</option>
        <option  value="undefined"  hidden disabled>{{field.placeholder}}</option>
        <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.label}}</option>
        <option *ngIf="field.label=='Email'" value="New">New</option>
        <option *ngIf="field.name=='fillValueType'" value="password">Password</option>
        </select>
      </div>
    `,

    //-------------Sap Automation DropDown Values-------------
    // <option *ngIf="field.label=='Action'" value='VerticalScrollbarPosition'>Vertical Scrollbar Position</option>
    // <option *ngIf="field.label=='Action'" value='Close'>Close</option>
    styles:[`
    .form-control
    {
      border-radius:0px;
      border-top:none;
      border-right:none;
      border-left:none;
      box-shadow:none;
    }
    `],
})
export class DropDownComponent implements OnInit {
    @Input() field:any = {};
    @Input() fields:any;
    @Input() form:FormGroup;
    optionfields:any=[]
    @Input('feilddisable') public feilddisable:boolean;
    @Output() newItemEvent = new EventEmitter();
    passwordValue: any = "";
    constructor(private designer:RpaStudioDesignerworkspaceComponent) {
    }
    public fieldsWithRef:any=[];
    public fieldsWithoutRef:any=[];
    ngOnInit(){
      this.fieldsWithRef=this.designer.fields;
      this.fieldsWithoutRef=[...this.designer.fields];
      if(this.field.name=="fillValueType")
      {
        if(this.field.value=='Radio Button')
        {
          
          let tenant=localStorage.getItem('tenantName');
          if(environment.ipcTenant==tenant){
            this.fieldsWithRef.find((item:any)=>item.name=="fillValue").type="ipc-checkbox"
          }
        }
      }
      if(this.field.name=="username")
      {
        let email=this.field.options.find((item:any)=>item.key==this.field.value).label;
        let emailRef=this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef");
        if(!(this.isEmail(email)))
        {
          this.form.get("emailRef_"+emailRef.id).clearValidators();
          this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef").visibility=true;
          this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef").required=true;
          this.form.get("emailRef_"+emailRef.id).updateValueAndValidity();
        }
        else
        {
          this.form.get("emailRef_"+emailRef.id).clearValidators();
          this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef").visibility=false;  
          this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef").required=false;
          this.form.get("emailRef_"+emailRef.id).updateValueAndValidity();
        
        }
      }
    }

      onChangeEmail(event, options , field) {
        if (event.target.value == 'New') {
          this.designer.openCreateCredential();
        }
        if(field.name=="username")
        {
          let email=this.field.options.find((item:any)=>item.key==event.target.value).label;
          let emailRef=this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef");
          if(!(this.isEmail(email)))
          {

            this.form.get("emailRef_"+emailRef.id).reset();
            this.form.get("emailRef_"+emailRef.id).clearValidators();
            this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef").visibility=true;
            this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef").required=true;
            this.form.get("emailRef_"+emailRef.id).updateValueAndValidity();
          }
          else
          {
            this.form.get("emailRef_"+emailRef.id).reset();
            this.form.get("emailRef_"+emailRef.id).clearValidators();
            this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef").visibility=false;  
            this.fields.find((fieldItem:any)=>fieldItem.name=="emailRef").required=false;
            this.form.get("emailRef_"+emailRef.id).updateValueAndValidity();
          
          }
        }
        if (event.target.value == 'fill' || event.target.value == 'click') {
          this.fieldsWithoutRef = [...this.designer.fields];
          let hideAttributes: any = options.find(item => item.key == event.target.value) != undefined ? options.find(item => item.key == event.target.value).hide_attributes : "";
          let hideAttributesIds: any = hideAttributes != null ? hideAttributes.split(",") : [];
          hideAttributesIds.forEach(item => {
            if (this.fieldsWithRef.find(fieldItem => fieldItem.id == parseInt(item)) != undefined) {
              this.fieldsWithRef.find(fieldItem => fieldItem.id == parseInt(item)).visibility = false;
              this.fieldsWithRef.find(fieldItem => fieldItem.id == parseInt(item)).required = false;
            }
          });
          this.fieldsWithRef.forEach((item1, i) => {
            if (!item1.visibility) {
              this.form.get([this.fieldsWithRef[i].name + '_' + this.fieldsWithRef[i].id]).clearValidators();
            }
            if (item1.id != environment.webActionAttrId) {
              this.form.get([this.fieldsWithRef[i].name + '_' + this.fieldsWithRef[i].id]).reset();
            }
          })
          this.fieldsWithoutRef.forEach(item => {
            if (!hideAttributesIds.includes(String(item.id))) {
              this.fieldsWithRef.find(item2 => item2.id == item.id).visibility = true;
              this.fieldsWithRef.find(item2 => item2.id ==  item.id).required = true;
            }
          })
        
  
        }
        if(field.name=="fillValueType")
        {
          if(event.target.value=="password")
          {
            this.fieldsWithRef.find((item:any)=>item.name=="fillValue").type="password"
            let formValue= this.fieldsWithRef.find((item:any)=>item.name=="fillValue")
            this.form.get(formValue.name + "_" + formValue.id).setValue(this.passwordValue)
          }
          else if(event.target.value=="Radio Button")
          {
            let tenant=localStorage.getItem('tenantName');
            if(environment.ipcTenant==tenant){
              this.fieldsWithRef.find((item:any)=>item.name=="fillValue").type="ipc-checkbox"
              this.fieldsWithRef.find((item:any)=>item.name=="fillValue").value=''
            }
            else{
              this.fieldsWithRef.find((item:any)=>item.name=="fillValue").type="textarea"
            }
          }
          else
          {
            let formValue= this.fieldsWithRef.find((item:any)=>item.name=="fillValue")
            if(formValue.type == "password"){
            this.passwordValue= this.form.get(formValue.name + "_" + formValue.id).value;
            } 
            this.fieldsWithRef.find((item:any)=>item.name=="fillValue").type="textarea"
            this.form.get(formValue.name + "_" + formValue.id).setValue("")
          }
        }
      }

      isEmail(email:any)
      {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
      }
   
    }



