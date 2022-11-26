
import { Component, OnInit, Input } from'@angular/core';
import { FormGroup } from'@angular/forms';

@Component({
selector:'file',
template:`
    <div [formGroup]="form">
      <div  class="drop-container dropzone" dropZone (dropped)="field.onUpload($event,field)" >
        <input [attr.disabled]="feilddisable" class="form-control custom-file-input" type="file" [id]="field.id" multiple="" [formControlName]="field.name+'_'+field.id" (change)="field.onUpload($event,field)">
      </div>
      <div *ngIf="field.value!=''">
      {{field.value}}
        <!-- <button type="button" class="btn btn-primary">Change</button> -->
       <!-- <div class="card">
          <img class="card-img-top" style='filter: none; width:20px;' [src]="field.value">
        </div>-->
      </div>
    </div>
  `,
})
export class FileComponent {
  @Input() field:any = {};
  @Input() form:FormGroup;
  isHovering;
  toggleHover;
  getisValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
  getisDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
  @Input('feilddisable') public feilddisable:boolean;
constructor() {
  }

ngOnChange(){


// this.field.value.
  }
}

