
import { Component, OnInit, Input } from'@angular/core';
import { FormGroup } from'@angular/forms';

@Component({
selector:'file',
template:`
    <div [formGroup]="form">
      <div  class="drop-container dropzone" dropZone (dropped)="field.onUpload($event,field)" >
        <input class="form-control custom-file-input" type="file" multiple="" [formControlName]="field.name+'_'+field.id" (change)="field.onUpload($event,field)">
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
// styles:[
// `
//     .drop-container {
//       background: #fff;
//       border-radius: 6px;
//       height: 25px;
//       width: 100%;
//       box-shadow: 1px 2px 20px hsla(0,0%,4%,.1);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border: 2px dashed #c0c4c7;
//     }
//     p {
//       font-size: 16px;
//       font-weight: 400;
//       color: #c0c4c7;
//     }
//     .upload-button {
//       background: white !important;
//       display: inline-block;
//       border: none;
//       outline: none;
//       cursor: pointer;
//       color: #5754a3;
//     }
//     .upload-button input {
//       display: none;
//     }
//     .dropzone {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex-direction: column;
//       border-radius: 5px;
//       background: white;
//       margin: 10px 0;
//     }
//     .dropzone.hovering {
//         border: 2px solid #f16624;
//         color: #dadada !important;
//     }
//     progress::-webkit-progress-value {
//       transition: width 0.1s ease;
//     }
//     `
//   ]
})
export class FileComponent {
  @Input() field:any = {};
  @Input() form:FormGroup;
  isHovering;
  toggleHover;
  getisValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
  getisDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }

constructor() {
  }

ngOnChange(){
console.log(this.field.value);

// this.field.value.
  }
}

