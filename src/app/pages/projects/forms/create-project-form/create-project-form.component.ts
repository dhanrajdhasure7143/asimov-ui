import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
@Component({
  selector: 'app-create-project-form',
  templateUrl: './create-project-form.component.html',
  styleUrls: ['./create-project-form.component.css']
})
export class CreateProjectFormComponent implements OnInit {

  constructor(private formBuilder:FormBuilder, private spinner:NgxSpinnerService ) { }
  insertForm2:FormGroup;
  selectedresources:any=[];
  mindate: any;
  @Input('users_list') public users_list: any[];
  @Input('processes') public processes:any[];
  @Output() oncreate = new EventEmitter<String>();
  ngOnInit(): void {
    
  this.insertForm2=this.formBuilder.group({
    projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    resource: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    mapValueChain: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    endDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    startDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    measurableMetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.maxLength(200)])],
    access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    
    projectPurpose: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
   // status: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],

})
this.mindate= moment().format("YYYY-MM-DD");
  }


  createproject()
  {
    if(this.insertForm2.valid)
    {
      let userfirstname=localStorage.getItem("firstName")
      let userlastname=localStorage.getItem("lastName")
      let username=userfirstname+" "+userlastname
      this.insertForm2.value.status="New";
      this.insertForm2.value.createdBy=username;
      let data=this.insertForm2.value;
      data["resource"]=data.resource.map(item=>{ return {resource:item}});
      data["effortsSpent"]=0;      
      data["projectHealth"]="Good";     
      data["projectPercentage"] =0;
      let project=JSON.stringify(data)
      this.oncreate.emit(project);
    }
  }


  
  resetcreateproject()
  {
        this.insertForm2.reset();
        
        this.insertForm2.get("resource").setValue("");
        this.insertForm2.get("mapValueChain").setValue("");
        this.insertForm2.get("owner").setValue("");
        this.insertForm2.get("initiatives").setValue("");
        this.insertForm2.get("priority").setValue("");
        this.insertForm2.get("process").setValue("");
        
  }

}
