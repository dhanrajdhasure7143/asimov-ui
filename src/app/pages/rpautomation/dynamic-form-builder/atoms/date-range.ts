import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'date-range',
    template: `
      <div style='display: flex;' [formGroup]="form">
      </div> 
    `
})
export class DateRangeComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;
    @Input('feilddisable') public feilddisable:boolean;

}