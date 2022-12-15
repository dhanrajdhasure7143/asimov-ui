import { Component,OnInit, Input } from '@angular/core';
import { DynamicFormsComponent } from '../dynamic-forms/dynamic-forms.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'checkbox',
    template: `
      <div [formGroup]="form" *ngIf="field.type=='checkbox'">
        <div style="display:flex"  >
          <div  class="form-check form-check">
             <input [attr.disabled]="feilddisable" (change)="updateFields()" [formControlName]="field.name+'_'+field.id" class="form-check-input" type="checkbox" [id]="field.id"  [checked]="field.value==true || field.value=='true'" />
             &nbsp;<span>{{field.label}}</span>
          </div>
        </div>
      </div>
      <div [formGroup]="form" *ngIf="field.type=='checkboxToggle'">
      <div style="display:flex"  >
        <div  class="form-check form-check">
           <input [attr.disabled]="feilddisable" [formControlName]="field.name+'_'+field.id" class="form-check-input" type="checkbox" [id]="field.id" (click)="change()" [checked]="field.value==true || field.value=='true'" />
           &nbsp;<span>{{field.label}}</span>
        </div>
      </div>
    </div>
    `
 
})
export class CheckBoxComponent implements OnInit  {
    @Input() field:any = {};
    @Input() form:FormGroup;
    
    get isValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
    get isDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
    fields:any=[];
    @Input('feilddisable') public feilddisable:boolean;
    constructor(private dynamic_forms:DynamicFormsComponent){

    }
    ngOnInit() {
      this.fields=this.dynamic_forms.fields;
     

      if(this.field.value=="true" && this.field.name=="isDownloadClick")
      {
        
        let downloadRefField=this.dynamic_forms.fields.find((item:any)=>item.name=="downloadedRef")
        downloadRefField.visibility=true;
        downloadRefField.required=true;
        this.form.get([downloadRefField.name + '_' + downloadRefField.id]).setValidators(Validators.required);
        this.form.get([downloadRefField.name + '_' + downloadRefField.id]).updateValueAndValidity();
      }
      let dependencydata:any=this.field.dependency;
      let dependency1=dependencydata.split(",")[0].split(":");
      let dependency2=dependencydata.split(",")[1].split(":");
      if(this.field.value=="true" || this.field.value==true)
      {
        
        setTimeout(()=>{
          $("#"+dependency1[0]+"_form_data").show();
          $("#"+dependency2[0]+"_form_data").hide();
          
          this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).value="";
        },500);
     
       
      }
      else
      {
        setTimeout(()=>{

          $("#"+dependency2[0]+"_form_data").show();
          $("#"+dependency1[0]+"_form_data").hide();
          
          this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).value="";
        },500)
     

      }

    }
    
    change()
    {
      this.fields=this.dynamic_forms.fields;
      let dependencydata:any=this.field.dependency;
      let dependency1=dependencydata.split(",")[0].split(":");
      let dependency2=dependencydata.split(",")[1].split(":");

      let check:any=document.getElementById(this.field.id);
      let value=check.checked;
      if(value==true)
      {
        
        $("#"+dependency1[0]+"_form_data").show();
        $("#"+dependency2[0]+"_form_data").hide();
        
        this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).value="";
     
       
      }
      else
      {
        
        $("#"+dependency2[0]+"_form_data").show();
        $("#"+dependency1[0]+"_form_data").hide();
        this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).value="";
      

      }
     
      
        
    }
    updateFields()
    {
      let check:any=document.getElementById(this.field.id);
      let value=check.checked;
      if(this.field.name=="isDownloadClick")
      {
        let downloadRefField=this.dynamic_forms.fields.find((item:any)=>item.name=="downloadedRef")
        if(downloadRefField!=undefined)
        {
          if(value==true)
          {
            downloadRefField.visibility=true;
            downloadRefField.required=true;
            this.form.get([downloadRefField.name + '_' + downloadRefField.id]).setValidators(Validators.required);
            this.form.get([downloadRefField.name + '_' + downloadRefField.id]).updateValueAndValidity();
          }
          else
          {
            downloadRefField.visibility=false;
            downloadRefField.required=false;
            this.form.get([downloadRefField.name + '_' + downloadRefField.id]).clearValidators();
            this.form.get([downloadRefField.name + '_' + downloadRefField.id]).updateValueAndValidity();
          }
        }
      }
    }
}
