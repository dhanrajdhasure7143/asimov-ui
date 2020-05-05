import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'radio',
    template: `
      <div style='display: flex;' [formGroup]="form">
        <div class="form-check" *ngFor="let opt of field.options">
          <input class="form-check-input" type="radio" [value]="opt.key" >
          <label style="color: #615f5f;padding: 0px 10px;" class="form-check-label">
            {{opt.label}}
          </label>
        </div>
      </div> 
    `
})
export class RadioComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;
}