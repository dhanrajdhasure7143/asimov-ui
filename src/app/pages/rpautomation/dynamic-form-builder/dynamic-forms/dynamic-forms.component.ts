import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dynamic-forms',
  template:`
    <form  [formGroup]="form" class="form-horizontal">
      <div class="container m-contanier form-body">
        <div class="col-md-12 p-0 form-group"  [id]="field.id+'_form_data'"  *ngFor="let field of fields; let i =index ">
            <form-builder [field]="field" [form]="form"></form-builder>
        </div>
        <div>
        <button class="btn btn-success"  [disabled]="!form.valid" (click)="Push()" *ngIf="formheader=='Web Automation - Fill'">Add</button>
        </div>
        <div class="mt-2" *ngIf="formheader=='Web Automation - Fill'">
        <div class="tablmacl">
        <div class="innertabld">
            <table class="table">
                <thead>
                   
                    <th>Web Element Type</th>
                    <th>Web Element Value</th>
                    <th>Value Type</th>
                    <th>Value</th>
                   
                </thead>
                <tbody>
                    <tr *ngFor="let i of fillarray  | paginate: { itemsPerPage: 2,currentPage: q }">
                        
                        <td>{{i.webElementType_223}}</td>
                        <td>{{i.webElementValue_224}}</td>
                        <td>{{i.fillValueType_222}}</td>
                        <td>{{i.fillValue_225}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="pagicl float-right">
    <pagination-controls (pageChange)="q = $event"></pagination-controls>
</div>
        
        </div>
        <div class="form-footer" *ngIf="!feilddisable">
            <button *ngIf="isdisabled==null && formheader!='Web Automation - Fill'" type="submit" (click)="onSub()" [disabled]="!form.valid" class="btn btn-primary">Save</button>
            <button *ngIf="isdisabled==true" type="submit" (click)="onSub()" [disabled]="true" class="btn btn-primary">Save</button>
            <button *ngIf="isdisabled==null && formheader=='Web Automation - Fill'" type="submit" (click)="onSub()" [disabled]="fillarray.length==0"   class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
  `,
})
export class DynamicFormsComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Output() Submit = new EventEmitter();
  @Input() fields: any[] = [];
  @Input() formheader:any;
  form: FormGroup;
  isdisabled:boolean;
  userRole: string;
  fillarray:any=[]
  
  
  constructor() { }
  onSub(){

    if(this.formheader=='Web Automation - Fill'){
      this.Submit.emit(this.fillarray)
    }
    else{
      this.onSubmit.emit(this.form.value)
    }
   
     
     
  }

  Push(){
    this.fillarray.push(this.form.value)
    this.form.reset()
    
  }
  ngOnInit() {
    let fieldsCtrls = {};
    console.log("formheader",this.formheader)
    for (let f of this.fields) {
    //  if (f.type != 'checkbox') {
      if(f.type=='email')
        fieldsCtrls[f.name+'_'+f.id] = new FormControl(f.value || '', f.required && f.dependency == ''  ? [Validators.pattern("[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}")] : [Validators.pattern("[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}")])
      else
        fieldsCtrls[f.name+'_'+f.id] = new FormControl(f.value || '', f.required && f.dependency == ''  ? [Validators.required] : [])
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
      if(this.userRole=='Process Owner' || this.userRole=='RPA Developer'){
        this.isdisabled=null
      }
      else{
        this.isdisabled=true
      }
  }

}
 // <div class="form-row"></div>
 // <div class="col-md-3"></div>
