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



        
        <div *ngIf="isMultiForm==true">
          <br>
            <button class="btn btn-success"  [disabled]="!form.valid" (click)="Push()" >Add</button>
          <br>
        </div>



        <div class="mt-2" *ngIf="isMultiForm==true">
        <div class="tablmacl">
        <div class="innertabld">
            <table class="table">
                <thead>
                    <th *ngFor="let tableHeader of fields">{{tableHeader.label}}</th>
                    <th>Actions</th>     
               </thead>
                <tbody>
                    <tr *ngFor="let eachObj of fillarray  | paginate: { itemsPerPage: 2,currentPage: q }">
                        
                        <td *ngFor="let field of fields">
                        {{eachObj[field.name+"_"+field.id]}}
                        </td>
                        <td>edit, delete</td>
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
            <button *ngIf="isdisabled==null && isMultiForm==false" type="submit" (click)="onSub()" [disabled]="!form.valid" class="btn btn-primary">Save</button>
            <button *ngIf="isdisabled==true" type="submit" (click)="onSub()" [disabled]="true" class="btn btn-primary">Save</button>
            <button *ngIf="isdisabled==null &&  isMultiForm==true" type="submit" (click)="onSub()" [disabled]="fillarray.length==0"   class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
  `,
})
export class DynamicFormsComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Output() Submit = new EventEmitter();
  @Input() enableMultiForm:any;
  @Input() fields: any[] = [];
  @Input() formheader:any;
  form: FormGroup;
  isdisabled:boolean;
  userRole: string;
  fillarray:any=[]
  isMultiForm:Boolean=false;
  multiFormValue=[];
  constructor() {
   }
  onSub(){

    if(this.enableMultiForm.check==true){
      this.Submit.emit(this.fillarray)
    }
    else{
      this.onSubmit.emit(this.form.value)
    }
   
     
     
  }

  Push(){
    let value=(this.form.value)
    value["id"]=this.idGenerator();
    this.fillarray.push(value);
    console.log(this.fillarray)
    this.form.reset();
  }
  
  idGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  ngOnInit() {
    let fieldsCtrls = {};
    this.isMultiForm=(this.enableMultiForm.check)
    this.multiFormValue=[...this.enableMultiForm.value]

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
