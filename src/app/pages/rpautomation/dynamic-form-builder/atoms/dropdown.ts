import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RpaStudioDesignerworkspaceComponent } from '../../rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';

@Component({
    selector: 'dropdown',
    template: `
      <div [formGroup]="form">
        <select (change)="onChangeEmail($event)" class="form-control" [value]="field.value" [id]="field.name" [formControlName]="field.name+'_'+field.id">
        <option  value="" >--{{field.placeholder}}--</option>
        <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.label}}</option>
        <option   value="New">&nbsp;&nbsp;New</option>
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
export class DropDownComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;

    constructor(private designer:RpaStudioDesignerworkspaceComponent) {

    }

    onChangeEmail(event){
     if(event.target.value=='New'){
          this.designer.createcredentials();
     }
    }
}
