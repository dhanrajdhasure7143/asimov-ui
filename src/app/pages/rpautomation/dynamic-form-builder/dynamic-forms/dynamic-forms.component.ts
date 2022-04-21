import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { object } from '@amcharts/amcharts4/core';
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
            <button class="btn btn-success" *ngIf="editfill==false" [disabled]="!form.valid" (click)="Push()" >Add</button>
            <button class="btn btn-success" *ngIf="editfill==true" [disabled]="!form.valid" (click)="Push()" >Update</button>
          <br><br>
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
                       <td>
                       <button tooltip="Edit" placement="bottom"  (click)="edit(eachObj)"><img src="../../../../assets/images/RPA/icon_latest/edit.svg" alt="" class="testplus">&nbsp;</button>
                     <button tooltip="Delete" placement="bottom"  (click)="delete(eachObj)"><img src="../../../../assets/images/RPA/icon_latest/delete.svg" alt="" class="testplus">&nbsp;</button>
                       <td>
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
  @Input() multiarray:any=[]
  form: FormGroup;
  isdisabled:boolean;
  userRole: string;
  fillarray:any=[]
  isMultiForm:Boolean=false;
  multiFormValue=[];
  data: any=[]
  id: any;
  editfill:boolean=false;

  constructor() {
   }
  onSub(){

    if(this.enableMultiForm.check==true){
      this.Submit.emit(this.data)
    }
    else{
      this.onSubmit.emit(this.form.value)
    }
   
     
     
  }
  edit(obj){
    
    this.editfill=true
this.id=obj.id
this.form.patchValue(obj)
  }
  delete(obj){
    
    var index = this.fillarray.indexOf(obj);

this.fillarray.splice(index, 1); 
    
  }
  Push(){
    
    if(this.editfill==true){
      let value=(this.form.value)
      value.id=this.id

    for(let i=0;i<this.fillarray.length;i++){
      if(this.fillarray[i].id==this.id){
        this.fillarray[i]=value;
        this.editfill=false
      }
    }
    this.data=this.fillarray.map(p=>{
      // return{
      //   "webElementType":p.webElementType_223,
      //   "webElementValue":p.webElementValue_224,
      //   "fillValueType":p.fillValueType_222,
      //   "fillValue":p.fillValue_225,
      //   "id":p.id

      // }
      let filteredobject={};
      let sample=(Object.keys(p));
      sample.map(item=>{
        if(item!="id")
          filteredobject[item.split("_")[0]]=p[item];
        else
          filteredobject["id"]=p[item];
      })    
      console.log("object",filteredobject)
      return filteredobject;
    })
    }
    else{
      let value=(this.form.value)
   
     
      this.fillarray.push(this.form.value);
      this.fillarray.forEach((item, i) => {
        item.id = i + 1;
      });
       
      this.data=this.fillarray.map(p=>{
        
        let filteredobject={};
        let sample=(Object.keys(p));
        sample.map(item=>{
          if(item!="id")
          filteredobject[item.split("_")[0]]=p[item];
          else
          filteredobject["id"]=p[item];
        })    
        console.log("object",filteredobject)
        return filteredobject;
        

        // return{
        //   "webElementType":p.webElementType_223,
        //   "webElementValue":p.webElementValue_224,
        //   "fillValueType":p.fillValueType_222,
        //   "fillValue":p.fillValue_225,
        //   "id":p.id
  
        // }
      })
    }
   
  
   
    this.form.reset();
   
    // console.log(this.fields)
    for(let i=0;i<this.fields.length;i++){
      if(this.fields[i].type=="dropdown"){
        this.fields[i].value="";
        this.form.get([this.fields[i].name+'_'+this.fields[i].id]).setValue("")
      }
    }
    // console.log(this.fields)
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
  

    if(this.multiarray!=undefined){
      this.multiFormValue=[...this.enableMultiForm.value]
      let modifiedArray:any=[...this.multiarray.map((item:any)=>{
          let objectKeys=Object.keys(item);
          let fieldData={}
          objectKeys.forEach((key:any)=>{
            let obj=this.fields.find(field=>field.name==key)
            if(obj!=undefined)
              fieldData[key+"_"+obj.id]=item[key];
          })
          fieldData["id"]=item.id;
          return fieldData;
      })]
      this.fillarray=modifiedArray;
    }

  
    // if(this.multiarray!=undefined){
    //   this.fillarray=this.multiarray.map(p=>{
    
        
    //     let filteredobject={};
    //     let sample=(Object.keys(p));
    //     console.log(sample)
    //     sample.forEach(item=>{
    //       if(item!="id")
    //       {
    //           this.fields.forEach((data,index)=>{
              
    //       //  filteredobject[this.fields[i].name+'_'+this.fields[i].id]=p[item]
    //           filteredobject[this.fields[index].name+'_'+this.fields[index].id]=p[item]
    //        })
    //       }
    //       else
    //         filteredobject["id"]=p[item];
    //     })
    //     console.log("----------------------------", filteredobject)    
    //     return filteredobject;
    //   })
    //   console.log("--------------",this.fillarray)
    //   this.data=this.fillarray;
    // }
    
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
    console.log(this.fields)
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
