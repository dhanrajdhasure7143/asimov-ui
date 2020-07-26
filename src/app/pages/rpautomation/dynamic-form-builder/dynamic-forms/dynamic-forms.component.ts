import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-forms',
  template:`
    <form (ngSubmit)="onSub()" [formGroup]="form" class="form-horizontal">
      <div *ngFor="let field of fields; let i =index ">
          <form-builder [field]="field" [form]="form"></form-builder>
      </div>
      <div class="form-row"></div>
      <div class="form-group row">
        <div class="col-md-3"></div>
        <div class="">
          <button type="submit"  [disabled]="!form.valid" class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
  `,
})
export class DynamicFormsComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() fields: any[] = [];
  form: FormGroup;
  constructor() { }
  onSub(){
    console.log(this.form.value)
    this.onSubmit.emit(this.form.value)
  }
  ngOnInit() {
    let fieldsCtrls = {};
    for (let f of this.fields) {
      if (f.type != 'checkbox') {
        fieldsCtrls[f.name] = new FormControl(f.value || '', f.required && f.dependency == ''  ? Validators.required : [])
      } else {
        let opts = {};
        for (let opt of f.options) {
          opts[opt.key] = new FormControl(opt.value);
        }
        fieldsCtrls[f.name] = new FormGroup(opts)
      }
    }
    this.form = new FormGroup(fieldsCtrls);
  }
 
}
