
import { Component, OnInit, Input } from'@angular/core';
import { FormGroup } from'@angular/forms';

@Component({
selector:'file',
template:`
    <div [formGroup]="form">
      <div  class="drop-container dropzone" dropZone (dropped)="field.onUpload($event,field)" >
        <input [attr.disabled]="feilddisable" type="file" pInputText class="form-control custom-file-input" style = "opacity: 1;" [id]="field.id" [formControlName]="field.name+'_'+field.id" (change)="field.onUpload($event,field)">
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
  styles: [
    'input.form-control.custom-file-input {padding-left: 0px !important;}',
    '.custom-file-input::-webkit-file-upload-button { visibility: hidden;}',
    '.custom-file-input::before { text-align: center; content: "Choose File" ; display: inline-block; background: #098de6; border-radius: 6px; padding: 2px 8px; outline: none; color: white; white-space: nowrap; -webkit-user-select: none; cursor: pointer; position: absolute; left: 5px;}',
    '.custom-file-input:hover::before { border-color: none; }'
  ],

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

