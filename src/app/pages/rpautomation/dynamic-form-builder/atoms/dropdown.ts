import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'dropdown',
    template: `
      <div [formGroup]="form">
        <select class="form-control" [value]="field.value" [id]="field.name"  [required]="field.required"  [formControlName]="field.name">
        <option  [value]="" >--select {{field.name}}--</option>  
        <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.label}}</option>
        </select>
      </div> 
    `
})
export class DropDownComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;

    constructor() {

    }
}