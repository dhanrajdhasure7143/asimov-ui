
import { Component,Input, OnInit } from '@angular/core';

@Component({
selector:'form-builder',
template:`
  <div [formGroup]="form">
    <div *ngIf ="field.visibility">
      <label *ngIf="field.type!='checkbox'" class="label-control" [attr.for]="field.label">
        {{field.label}}
        <span class="star" *ngIf="field.required==true">*</span>
      </label>
    </div>
    <div class="col-md-12 p-0" [ngSwitch]="field.type">
        <div *ngIf ="field.visibility">
          <textbox [feilddisable]="isdisabled" *ngSwitchCase="'text'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <textbox [feilddisable]="isdisabled" *ngSwitchCase="'email'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <textbox [feilddisable]="isdisabled" *ngSwitchCase="'password'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <textbox [feilddisable]="isdisabled" *ngSwitchCase="'number'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <textbox [feilddisable]="isdisabled" *ngSwitchCase="'textarea'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <dropdown [feilddisable]="isdisabled" *ngSwitchCase="'dropdown'" (newItemEvent)="getfields($event)" [fields]="fields"  [field]="field" [form]="form"></dropdown>
        </div>
        <div *ngIf ="field.visibility">
          <dropdown [feilddisable]="isdisabled" *ngSwitchCase="'restapi'" [fields]="fields"  [field]="field" [form]="form"></dropdown>
        </div>
        <div *ngIf ="field.visibility">
          <checkbox [feilddisable]="isdisabled" *ngSwitchCase="'checkbox'" [field]="field" [form]="form"></checkbox>
        </div>
        <div *ngIf ="field.visibility">
          <checkbox [feilddisable]="isdisabled" *ngSwitchCase="'checkboxToggle'" [field]="field" [form]="form"></checkbox>
        </div>
        <div *ngIf ="field.visibility">
          <radio [feilddisable]="isdisabled" *ngSwitchCase="'radio'" [field]="field" [form]="form"></radio>
        </div>
        <div *ngIf ="field.visibility">
          <file [feilddisable]="isdisabled" *ngSwitchCase="'multipart'" [field]="field" [form]="form"></file>
        </div>
       
        <div *ngIf="!isValid && (isDirty || istouched)">
          <span *ngIf="isRequired" class="errspan required">{{field.label}} is required</span>
          <span *ngIf="isEmail" class="errspan required">Enter valid email address</span>
          
        </div>
        

      
    </div>
  </div>
 
  `,
styleUrls: ['./form-builder.component.css']
})
// <file *ngSwitchCase="'file'" [field]="field" [form]="form"></file>

export class FormBuilderComponent implements OnInit {
  @Input() field:any;
  @Input() fields:any;
  @Input() form:any;
  isdisabled:boolean;
  userRole: string;
  fieldinput:any;
  get isValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
  get isDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
  get istouched() { return this.form.controls[this.field.name+"_"+this.field.id].touched; }
  get isRequired() {return this.form.controls[this.field.name+"_"+this.field.id].errors.required?true:false}
  get isEmail() {return this.form.controls[this.field.name+"_"+this.field.id].errors.pattern}

  constructor() { }

  ngOnInit() {
    this.userRole = localStorage.getItem("userRole");
      if(this.userRole=='Process Owner' || this.userRole=='RPA Developer'){
        this.isdisabled=null
      }
      else{
        this.isdisabled=true
      }
  }
  getfields(event){
     console.log("event",event)
  }
}

// <div class="col-md-12 row"></div>
// style="position:absolute" class="alert alert-danger my-1 p-2 fadeInDown animated"
