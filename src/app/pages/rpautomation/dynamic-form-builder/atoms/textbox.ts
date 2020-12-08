import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

// text,email,tel,textarea,password, 
@Component({
    selector: 'textbox',
    template: `
      <div [formGroup]="form">
        <input *ngIf="!field.multiline" autocomplete="off" [required]="field.required==true" [attr.type]="field.type" [attr.placeholder]="field.placeholder" class="form-control"  [id]="field.name" [name]="field.name" [formControlName]="field.name">
        <textarea *ngIf="field.multiline" autocomplete="off" [formControlName]="field.name" [id]="field.name" [required]="field.required==true" 
        rows="9" class="form-control" [placeholder]="field.placeholder"></textarea>
      </div> 
    `,
    styles:[`input{border: none;border-bottom: 1px solid lightgray;border-radius: unset;box-shadow: none;font-size: 12px !important;}
    `
]
})
export class TextBoxComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;
    get isValid() { return this.form.controls[this.field.name].valid; }
    get isDirty() { return this.form.controls[this.field.name].dirty; }
  
    constructor() {

    }
}