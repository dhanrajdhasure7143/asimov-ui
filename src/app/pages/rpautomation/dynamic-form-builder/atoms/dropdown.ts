import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { RpaStudioDesignerworkspaceComponent } from '../../rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';

@Component({
    selector: 'dropdown',
    template: `
      <div [formGroup]="form">
        <select [attr.disabled]="feilddisable" [required]="field.required==true" (change)="onChangeEmail($event,field.options, field)" class="form-control" [value]="field.value" [id]="field.id" [formControlName]="field.name+'_'+field.id">
        <option  value="" hidden disabled>{{field.placeholder}}</option>
        <option  value="null" hidden disabled>{{field.placeholder}}</option>
        <option  value="undefined"  hidden disabled>{{field.placeholder}}</option>
        <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.label}}</option>
        <option  *ngIf="field.label=='Email'" value="New">New</option>
        <option *ngIf="field.name=='fillValueType'" value="password">Password</option>
       
        </select>
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
    `],
})
export class DropDownComponent implements OnInit {
    @Input() field:any = {};
    @Input() fields:any;
    @Input() form:FormGroup;
    optionfields:any=[]
    @Input('feilddisable') public feilddisable:boolean;
    @Output() newItemEvent = new EventEmitter();
    constructor(private designer:RpaStudioDesignerworkspaceComponent) {
    }
    public fieldsWithRef:any=[];
    public fieldsWithoutRef:any=[];
    ngOnInit(){
      this.fieldsWithRef=this.designer.fields;
      this.fieldsWithoutRef=[...this.designer.fields];
    }

  onChangeEmail(event, options, field) {
    if (event.target.value == 'New') {
      this.designer.createcredentials();
    }
    if (event.target.value == 'fill' || event.target.value == 'click') {
      debugger
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
        if (item1.id != 536) {
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
      }
      else
      {
        this.fieldsWithRef.find((item:any)=>item.name=="fillValue").type="textarea"
      }
    }

  }
   
    }

