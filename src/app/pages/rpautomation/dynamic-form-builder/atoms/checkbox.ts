import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'checkbox',
    template: `
      <div [formGroup]="form">
        <div style="display:flex"  >
          <div  class="form-check form-check">
          <label style="color: #615f5f;padding: 0px 10px;" class="form-check-label">
             <input  [formControlName]="field.name+'_'+field.id" class="form-check-input" type="checkbox" id="inlineCheckbox1"  [checked]="field.value==true || field.value=='true'" />
             &nbsp;&nbsp;{{field.label}}</label>
          </div>
        </div>
      </div>
    `
    /*
      <div [formGroup]="form">
        <div style="display:flex" [formGroupName]="field.name" >
          <div *ngFor="let opt of field.options" class="form-check form-check">
          <label style="color: #615f5f;padding: 0px 10px;" class="form-check-label">
             <input  [formControlName]="opt.key" class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
             {{opt.label}}</label>
          </div>
        </div>
      </div>
    */
})
export class CheckBoxComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;
    get isValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
    get isDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
}
