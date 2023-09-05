import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-copilot-message-form',
  templateUrl: './copilot-message-form.component.html',
  styleUrls: ['./copilot-message-form.component.css']
})
export class CopilotMessageFormComponent implements OnInit {
  @Input()
  formInputData: any;
  @Output()
  formAction= new EventEmitter<any>();
  formId = 'form-'+new Date().getTime();

  userForm:FormGroup; // variable is created of type FormGroup is created
  constructor( private fb: FormBuilder) {
    // Form element defined below
    let form:any ={}
    this.formInputData?.elements.map((i:any)=>{
      form[i.name]= i.value
    })
    this.userForm = this.fb.group(form);
  }
  // fb: FormBuilder= new FormBuilder();

  ngOnInit() {
    
   // Form element defined below
   let form:any ={}
   this.formInputData?.elements.map((i:any)=>{
     form[i.name]= i.value
   })
   this.userForm = this.fb.group(form);
  }

  processButtonAction(event:any){
    console.log("processButtonAction received from child "+event)
    console.log(event.target.value)
    console.log(this.userForm)
    
  }
  processInputAction(event:any){
    console.log("processInputAction received from child "+event)
    
  }

  processRadioAction(event:any){
    console.log("processInputAction received from child "+event)
    
  }
}
