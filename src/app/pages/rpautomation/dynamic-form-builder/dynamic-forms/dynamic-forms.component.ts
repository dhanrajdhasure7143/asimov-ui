import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { iter } from '@amcharts/amcharts4/core';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Base64 } from 'js-base64';
@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.css']

})
export class DynamicFormsComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Output() Submit = new EventEmitter();
  @Input() enableMultiForm: any;
  @Input() fields: any[] = [];
  @Input() formheader: any;
  @Input() multiarray: any = []
  form: FormGroup;
  isdisabled: boolean;
  userRole: string;
  fillarray: any = []
  isMultiForm: Boolean = false;
  dragging: boolean;
  multiFormValue = [];
  data: any = []
  id: any;
  selections: any = []
  editfill: boolean = false;
  q = 1
  constructor() {
  }
  onSub() {
    if (this.enableMultiForm.check == true) {
      this.Submit.emit(this.data)
    }
    else {
      this.onSubmit.emit(this.form.value)
    }
  }
  edit(obj) {
    this.editfill = true
    this.id = obj.id;
    let key=Object.keys(obj).find(item=>item.split("_")[0]=="fillValueType")
    let valueKey=Object.keys(obj).find(item=>item.split("_")[0]=="fillValue");
    if(valueKey != undefined && key != undefined) 
      if(obj[key]=="password")
      {
        this.fields.find(item=>item.name=="fillValue").type="password"
        obj[valueKey]=Base64.decode(obj[valueKey]);
      }
    if (obj.Action_525 == 'fill') {
      this.fields.forEach(item => {
        if (item.visibility == false) {
          item.visibility = true;
          item.required = true;
        }
        setTimeout(() => {
          this.form.patchValue(obj)
        }, 100);
      })
    } else if (obj.Action_525 == 'click') {
      this.fields.forEach(item => {
        let hideAttributes: any = item.options.find(item => item.key == obj.Action_525) != undefined ? item.options.find(item => item.key == obj.Action_525).hide_attributes : "";
        let hideAttributesIds: any = hideAttributes != null ? hideAttributes.split(",") : [];
        hideAttributesIds.forEach(item => {
          if (this.fields.find(fieldItem => fieldItem.id == parseInt(item)) != undefined) {
            this.fields.find(fieldItem => fieldItem.id == parseInt(item)).visibility = false;
            this.fields.find(fieldItem => fieldItem.id == parseInt(item)).required = false;
          }
        });
        if(!item.visibility){
          this.form.get([item.name+'_'+item.id]).clearValidators();
         }
         this.form.get([item.name+'_'+item.id]).updateValueAndValidity()
         this.form.patchValue(obj);

      })
    }
    else {
      this.form.patchValue(obj);
    }
  }
  delete(obj) {
    var index = this.fillarray.indexOf(obj);
    this.fillarray.splice(index, 1);
  }
  checkRecord(record, field)
  {
      let key=(Object.keys(record).find((item:any)=>item.split("_")[0]=="fillValueType"))
      if(key!=undefined)
        if(record[key]=="password"&& field.name=="fillValue")
            return true;
      return false;
  }  
  Push() {
    let fillValueTypeId=this.fields.find((item:any)=>item.name=="fillValueType")!=undefined?this.fields.find((item:any)=>item.name=="fillValueType").id:"";
    let fillValueId=this.fields.find((item:any)=>item.name=="fillValue")!=undefined?this.fields.find((item:any)=>item.name=="fillValue").id:"";
    if(this.editfill == true) {
      let value = (this.form.value)
      if(value["fillValueType_"+fillValueTypeId] != undefined)
      {
        if(value["fillValueType_"+fillValueTypeId]=="password")
        {
          value["fillValue_"+fillValueId]=Base64.encode(value["fillValue_"+fillValueId])
        }
      }
      value.id = this.id
      for (let i = 0; i < this.fillarray.length; i++) {
        if (this.fillarray[i].id == this.id) {
          this.fillarray[i] = value;
          this.editfill = false
        }
      }
      this.data = this.fillarray.map(p => {
        let filteredobject = {};
        let sample = (Object.keys(p));
        sample.map(item => {
          if (item != "id")
            filteredobject[item.split("_")[0]] = p[item];
          else
            filteredobject["id"] = p[item];
        })
        return filteredobject;
      })
    }
    else {
      let value = (this.form.value);
      if(value["fillValueType_"+fillValueTypeId] != undefined)
      {
        if(value["fillValueType_"+fillValueTypeId]=="password")
        {
          value["fillValue_"+fillValueId]=Base64.encode(value["fillValue_"+fillValueId])
        }
      }
      this.fillarray.push(value);
      this.fillarray.forEach((item, i) => {
        item.id = i + 1;
      });
      this.data = this.fillarray.map(p => {
        let filteredobject = {};
        let sample = (Object.keys(p));
        sample.map(item => {
          if (item != "id")
            filteredobject[item.split("_")[0]] = p[item];
          else
            filteredobject["id"] = p[item];
        })
        return filteredobject;
      })
    }
    this.form.reset();
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i].type == "dropdown") {
        this.fields[i].value = "";
        this.form.get([this.fields[i].name + '_' + this.fields[i].id]).setValue("")
      }
    } 
  }

  idGenerator() { 
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  ngOnInit() {
    let fieldsCtrls = {};
    this.isMultiForm = (this.enableMultiForm.check)
    if (this.multiarray != undefined) {
      this.multiFormValue = [...this.enableMultiForm.value]
      let modifiedArray: any = [...this.multiarray.map((item: any) => {
        let objectKeys = Object.keys(item);
        let fieldData = {}
        objectKeys.forEach((key: any) => {
          let obj = this.fields.find(field => field.name == key)
          if (obj != undefined)
            fieldData[key + "_" + obj.id] = item[key];
        })
        fieldData["id"] = item.id;
        return fieldData;
      })]
      this.fillarray = modifiedArray;
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
      if (f.type == 'email')
        fieldsCtrls[f.name + '_' + f.id] = new FormControl(f.value || '', f.required && f.dependency == '' ? [Validators.pattern("[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}")] : [Validators.pattern("[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}")])
      else
        fieldsCtrls[f.name + '_' + f.id] = new FormControl(f.value || '', f.required && f.dependency == '' ? [Validators.required] : [])
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
    if (this.userRole == 'Process Owner' || this.userRole == 'RPA Developer') {
      this.isdisabled = null
    }
    else {
      this.isdisabled = true
    }

  }

  drop(event: CdkDragDrop<[]>) {
      moveItemInArray(this.fillarray, (this.q - 1) * 2 + event.previousIndex, (this.q - 1) * 2 + event.currentIndex);
     this.data=this.fillarray
  }
}

