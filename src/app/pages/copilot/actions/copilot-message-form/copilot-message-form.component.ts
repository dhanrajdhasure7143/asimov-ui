import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

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
  userForm:FormGroup;
  constructor(
    private fb: FormBuilder,
    private messageService:MessageService
    ) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    let formData:any ={}
    this.formInputData?.elements.map((element:any)=>{
      let validations:any=[];
      if(element.required) validations.push(Validators.required);
      (element.type=="checkbox")?(formData[element.name]=[],element.options.forEach((optionItem:any) => {
          formData[element.name].push(this.fb.group({[optionItem.value]:(Array.isArray(element.value)?element.value.includes(optionItem.value):false)}));
        }),formData[element.name] = this.fb.array(formData[element.name])):formData[element.name]=new FormControl(element.value , Validators.compose(validations))
    });
    this.userForm = this.fb.group(formData);
  }




  processButtonAction(event:any){
    (event?.type=="submit")?((this.userForm.valid)?this.formAction.emit({message:"submit",data:this.userForm.value}):
    this.messageService.add({severity:'error', summary:'Invalid Data', detail:'Please fill all fields'})):
    this.formAction.emit(event);
  }
  processInputAction(event:any){
    console.log("processInputAction received from child "+event)
    
  }

  processRadioAction(event:any){
    console.log("processInputAction received from child "+event)
  }

}
