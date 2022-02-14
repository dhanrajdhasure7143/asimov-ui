import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-forms',
  template:`
    <form (ngSubmit)="onSub()" [formGroup]="form" class="form-horizontal">
      <div class="container m-contanier form-body">
        <div class="col-md-12 p-0 form-group"  [id]="field.id+'_form_data'"  *ngFor="let field of fields; let i =index ">
            <form-builder [field]="field" [form]="form"></form-builder>
        </div>
        <div class="form-footer" *ngIf="!feilddisable">
            <button *ngIf="isdisabled==null" type="submit"  [disabled]="!form.valid" class="btn btn-primary">Save</button>
            <button *ngIf="isdisabled==true" type="submit"  [disabled]="true" class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
  `,
})
export class DynamicFormsComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() fields: any[] = [];
  form: FormGroup;
  isdisabled:boolean;
  userRole: string;
  constructor() { }
  onSub(){
    this.onSubmit.emit(this.form.value)
  }
  ngOnInit() {
    let fieldsCtrls = {};
    for (let f of this.fields) {
    //  if (f.type != 'checkbox') {
        fieldsCtrls[f.name+'_'+f.id] = new FormControl(f.value || '', f.required && f.dependency == ''  ? Validators.required : [])
      //  console.log(f);
     /* } else {
        let opts = {};
        for (let opt of f.options) {
          opts[opt.key] = new FormControl(opt.value);
        }
        fieldsCtrls[f.name] = new FormGroup(opts)
      }*/
    }
    this.form = new FormGroup(fieldsCtrls);
    this.userRole = localStorage.getItem("userRole");
      if(this.userRole=='Process Owner'){
        this.isdisabled=null
      }
      else{
        this.isdisabled=true
      }
  }

}
 // <div class="form-row"></div>
 // <div class="col-md-3"></div>
