import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-process-info',
  templateUrl: './project-process-info.component.html',
  styleUrls: ['./project-process-info.component.css']
})
export class ProjectProcessInfoComponent implements OnInit {

  frequency : any[] = [];
  processInfo : FormGroup;
  @Input() process_name : any;
  @Output() customEvent = new EventEmitter<any>();
  isRequired: boolean = false;

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.frequency = ["Daily","Weekly","Monthly","Quarterly","Yearly"];

    this.processInfo=this.formBuilder.group({
      processName: ["",Validators.compose([Validators.required])],
      metricCheck: [""],
      liveDate: [""],
      processFrequency: [""],
      timeSaved: ["",Validators.compose([Validators.required])],
      costSaved: ["",Validators.compose([Validators.required])],
      comment: ["",Validators.compose([Validators.required])]
      })

      this.processInfo.get('processName').setValue(this.process_name);
  }

  resetForm(){
    this.processInfo.reset();
    this.processInfo.get('processName').setValue(this.process_name);
  }

  createInfo(){
    // If form created successfully
    let message = false;
    this.customEvent.emit(message);
  }

  onCheckboxChange(event : any){
    this.isRequired = event.target.checked
    this.processInfo.get("liveDate").clearValidators();
    this.processInfo.get("processFrequency").clearValidators();
    if(event.target.checked == true){
      this.processInfo.get("liveDate").setValidators([Validators.required]);
      this.processInfo.get("liveDate").updateValueAndValidity();
      this.processInfo.get("processFrequency").setValidators([Validators.required]);
      this.processInfo.get("processFrequency").updateValueAndValidity();
    } else {
      this.processInfo.get("liveDate").setValidators([]);
      this.processInfo.get("liveDate").updateValueAndValidity();
      this.processInfo.get("processFrequency").setValidators([]);
      this.processInfo.get("processFrequency").updateValueAndValidity();
    }
  }

  onlyNumbersAllowed(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9",,"Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   }
  }

}
