
import { Component,Input, OnInit } from '@angular/core';
 
@Component({
selector:'form-builder',
template:`
  <div class="col-md-3 form-group row" [formGroup]="form">
  <div *ngIf ="field.visibility">
  <label style="color:black;padding-right:14px" class="form-control-label" [attr.for]="field.label">
      {{field.label}}
      <strong class="text-danger" *ngIf="field.required">*</strong>
    </label></div>
  <div class="col-md-12 row"> 
    
    <div class="col-md-12" [ngSwitch]="field.type">
    <div *ngIf ="field.visibility">
    <textbox *ngSwitchCase="'text'" [field]="field" [form]="form"></textbox></div>
    <div *ngIf ="field.visibility">
    <textbox *ngSwitchCase="'email'" [field]="field" [form]="form"></textbox></div>
    <div *ngIf ="field.visibility">
    <textbox *ngSwitchCase="'password'" [field]="field" [form]="form"></textbox></div>
    <div *ngIf ="field.visibility">
    <textbox *ngSwitchCase="'number'" [field]="field" [form]="form"></textbox></div>
    <div *ngIf ="field.visibility">
    <textbox *ngSwitchCase="'textarea'" [field]="field" [form]="form"></textbox></div>
    <div *ngIf ="field.visibility">
    <dropdown *ngSwitchCase="'dropdown'" [field]="field" [form]="form"></dropdown></div>
    <div *ngIf ="field.visibility">
    <checkbox *ngSwitchCase="'checkbox'" [field]="field" [form]="form"></checkbox></div>
    <div *ngIf ="field.visibility">
    <radio *ngSwitchCase="'radio'" [field]="field" [form]="form"></radio></div>
    <div *ngIf ="field.visibility">
    <file *ngSwitchCase="'multipart'" [field]="field" [form]="form"></file></div>
      <div style="position:absolute" class="alert alert-danger my-1 p-2 fadeInDown animated" *ngIf="!isValid && isDirty">{{field.label}} is required</div>
    </div>
    </div>
  </div>
  `,
styleUrls: ['./form-builder.component.css']
})
// <file *ngSwitchCase="'file'" [field]="field" [form]="form"></file>
 
export class FormBuilderComponent implements OnInit {
  @Input() field:any;
  @Input() form:any;
  
  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }
 
  constructor() { }
 
  ngOnInit() {
  }
 
}
