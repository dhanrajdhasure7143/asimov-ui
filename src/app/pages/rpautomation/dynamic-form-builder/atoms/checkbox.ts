import { Component,OnInit, Input } from '@angular/core';
import { DynamicFormsComponent } from '../dynamic-forms/dynamic-forms.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'checkbox',
    template: `
      <div [formGroup]="form" *ngIf="field.type=='checkbox'">
        <div style="display:flex"  >
          <div  class="form-check form-check">
             <input  [formControlName]="field.name+'_'+field.id" class="form-check-input" type="checkbox" [id]="field.id"  [checked]="field.value==true || field.value=='true'" />
             &nbsp;<span>{{field.label}}</span>
          </div>
        </div>
      </div>
      <div [formGroup]="form" *ngIf="field.type=='checkboxToggle'">
      <div style="display:flex"  >
        <div  class="form-check form-check">
           <input  [formControlName]="field.name+'_'+field.id" class="form-check-input" type="checkbox" [id]="field.id" (click)="change()" [checked]="field.value==true || field.value=='true'" />
           &nbsp;<span>{{field.label}}</span>
        </div>
      </div>
    </div>
    `
    /*
      <div [formGroup]="form">
        <div style="display:flex" [formGroupName]="field.name" >
          <div *ngFor="let opt of field.options" class="form-check form-check">
          <label style="color: #615f5f;padding: 0px 10px;" class="form-check-label">
             <input  [formControlName]="opt.key" class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
             {{opt.label}}</label>
          </div>
        </div>
      </div>
    */
})
export class CheckBoxComponent implements OnInit  {
    @Input() field:any = {};
    @Input() form:FormGroup;
    get isValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
    get isDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
    fields:any=[];
    constructor(private dynamic_forms:DynamicFormsComponent){

    }
    ngOnInit() {
      this.fields=this.dynamic_forms.fields;
      console.log(this.fields)
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
      //  let disablefield:any= this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0]));
      //   this.form.removeControl(disablefield.name+"_"+disablefield.id)
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).required=false;
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).value="";
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).visibility=false;
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).visibility=true;
        //let enablefield:any=this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0]));
        //this.form.addControl(enablefield.name+"_"+enablefield.id,new FormControl(enablefield.value || '', enablefield.required && enablefield.dependency == ''  ? Validators.required : []));
       
      }
      else
      {
        setTimeout(()=>{

          $("#"+dependency2[0]+"_form_data").show();
          $("#"+dependency1[0]+"_form_data").hide();
          
          this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).value="";
        },500)
        //let disablefield:any= this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0]));
        //this.form.removeControl(disablefield.name+"_"+disablefield.id)
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).value="";
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).visibility=false;
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).visibility=true;
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).required=false;
        //let enablefield:any=this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0]));
        //this.form.addControl(enablefield.name+"_"+enablefield.id,new FormControl(enablefield.value || '', enablefield.required && enablefield.dependency == ''  ? Validators.required : []));

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
<<<<<<< HEAD
=======
        
>>>>>>> 97a4260938c6933f985942092d3a54f004d03dc2
        $("#"+dependency1[0]+"_form_data").show();
        $("#"+dependency2[0]+"_form_data").hide();
        
        this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).value="";
      //  let disablefield:any= this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0]));
      //   this.form.removeControl(disablefield.name+"_"+disablefield.id)
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).required=false;
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).value="";
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).visibility=false;
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).visibility=true;
        //let enablefield:any=this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0]));
        //this.form.addControl(enablefield.name+"_"+enablefield.id,new FormControl(enablefield.value || '', enablefield.required && enablefield.dependency == ''  ? Validators.required : []));
       
      }
      else
      {
        
        $("#"+dependency2[0]+"_form_data").show();
        $("#"+dependency1[0]+"_form_data").hide();
        this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).value="";
<<<<<<< HEAD
        
    
=======
>>>>>>> 97a4260938c6933f985942092d3a54f004d03dc2
        //let disablefield:any= this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0]));
        //this.form.removeControl(disablefield.name+"_"+disablefield.id)
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).value="";
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).visibility=false;
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0])).visibility=true;
        // this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency1[0])).required=false;
        //let enablefield:any=this.dynamic_forms.fields.find(data=>parseInt(data.id)==parseInt(dependency2[0]));
        //this.form.addControl(enablefield.name+"_"+enablefield.id,new FormControl(enablefield.value || '', enablefield.required && enablefield.dependency == ''  ? Validators.required : []));

      }
        
    }
}
