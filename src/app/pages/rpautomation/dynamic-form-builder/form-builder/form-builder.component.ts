
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
          <textbox *ngSwitchCase="'text'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <textbox *ngSwitchCase="'email'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <textbox *ngSwitchCase="'password'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <textbox *ngSwitchCase="'number'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <textbox *ngSwitchCase="'textarea'" [field]="field" [form]="form"></textbox>
        </div>
        <div *ngIf ="field.visibility">
          <dropdown *ngSwitchCase="'dropdown'" [field]="field" [form]="form"></dropdown>
        </div>
        <div *ngIf ="field.visibility">
          <dropdown *ngSwitchCase="'restapi'" [field]="field" [form]="form"></dropdown>
        </div>
        <div *ngIf ="field.visibility">
          <checkbox *ngSwitchCase="'checkbox'" [field]="field" [form]="form"></checkbox>
        </div>
        <div *ngIf ="field.visibility">
          <checkbox *ngSwitchCase="'checkboxToggle'" [field]="field" [form]="form"></checkbox>
        </div>
        <div *ngIf ="field.visibility">
          <radio *ngSwitchCase="'radio'" [field]="field" [form]="form"></radio>
        </div>
        <div *ngIf ="field.visibility">
          <file *ngSwitchCase="'multipart'" [field]="field" [form]="form"></file>
        </div>
        <div *ngIf="!isValid && (isDirty || istouched) ">
          <span class="errspan required">{{field.label}} is required</span>
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

  get isValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
  get isDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
  get istouched() { return this.form.controls[this.field.name+"_"+this.field.id].touched; }

  constructor() { }

  ngOnInit() {
  }

}

// <div class="col-md-12 row"></div>
// style="position:absolute" class="alert alert-danger my-1 p-2 fadeInDown animated"
