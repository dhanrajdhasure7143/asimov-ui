import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';

@Component({
  selector: 'app-project-process-info',
  templateUrl: './project-process-info.component.html',
  styleUrls: ['./project-process-info.component.css']
})
export class ProjectProcessInfoComponent implements OnInit {

  frequency : any[] = [];
  processInfo : FormGroup;
  @Input() process_name : any;
  @Input() project_id : any;
  projectDetails : any = {};
  @Output() customEvent = new EventEmitter<any>();
  isRequired : boolean = false;
  isChange : boolean = false;
  showValidation: boolean;
  @Input() isDashboardOverlay: boolean = false;
  @Input() projectName: string = '';
  @Input() isChecked: boolean = false;
  projects_list:any[]=[];
  selected_project:any;
  isLoading:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private rest: RestApiService,
    private toastService: ToasterService) { 
      this.processInfo=this.formBuilder.group({
        processName: ["",Validators.compose([Validators.required])],
        metricCheck: [false],
        liveDate: [""],
        processFrequency: [""],
        timeSaved: [""],
        days: [""],
        hours: [""],
        minutes: [""],      
        costSaved: ["",Validators.compose([Validators.required])],
        comment: ["",Validators.compose([Validators.required])],
        projectName:[""],
        projectId: [""]
        })
    }

  ngOnInit(): void {
      this.processInfo.get('processName').setValue(this.process_name);
      this.processInfo.get("liveDate").clearValidators();
      this.processInfo.get("liveDate").updateValueAndValidity()
      this.processInfo.get("processFrequency").clearValidators();
      this.processInfo.get("processFrequency").updateValueAndValidity()
      this.processInfo.get("projectName").setValue(this.projectName)
      this.processInfo.get("projectId").setValue(this.project_id)
      this.getFrequency();
  }
  ngOnChanges(){
    if(this.isDashboardOverlay){
      let userRoles = localStorage.getItem("userRole")
      let name = localStorage.getItem("firstName") + " " + localStorage.getItem("lastName")
      let email = localStorage.getItem('ProfileuserId');
      this.getallProjects(userRoles,name,email);
      this.processInfo.get('metricCheck').setValue(true);
      // this.processInfo.controls['metricCheck'].disable();
    }else{
      this.processInfo.get('metricCheck').setValue(false);
      this.getProcessDetails(this.project_id);
    }
  }

  getProcessDetails(project_id){
    this.rest.getProjectDetailsById(project_id).subscribe( res =>{
      this.projectDetails = res;
      this.getProcessInfo();
      if(this.isDashboardOverlay){
        this.process_name = this.projectDetails.roiProcessName?this.projectDetails.roiProcessName:''
        this.projectName = this.projectDetails.projectName
        this.processInfo.get('processName').setValue(this.process_name);
        this.processInfo.get("projectName").setValue(this.projectName)
        this.processInfo.get("projectId").setValue(this.project_id);
        this.addValidators();
        this.processInfo.get("projectId").setValidators([Validators.required]);
        this.processInfo.get("projectId").updateValueAndValidity();
        this.processInfo.get('metricCheck').setValue(true);
        this.isRequired = true
      }
    })
  }

  resetForm(){
    this.processInfo.reset();
    this.processInfo.get('processName').setValue(this.process_name);
  }

  createInfo(){
    let req_body = {
      "roiProcessName": this.processInfo.value.processName,
      "includeForDashboardMetrics": this.processInfo.value.metricCheck,
      "goLiveDate": this.processInfo.value.liveDate,
      "processFrequency": this.processInfo.value.processFrequency,
      "timeSavedForExecution": this.processInfo.value.days + "d " + this.processInfo.value.hours + "h " + this.processInfo.value.minutes + "m",
      "costSavedForExecution":  this.processInfo.value.costSaved,
      "comments": this.processInfo.value.comment
    }

    this.rest.saveProcessInfo(this.project_id,req_body).subscribe((res:any) => {
      if(res.message == "Saved Successfully"){
        this.toastService.showSuccess(this.processInfo.value.processName,'create');
        let message = false;
        this.customEvent.emit(message);
        this.resetForm();
      }
    })
  }

  getProcessInfo(){
    if(!this.isDashboardOverlay) this.processInfo.get('metricCheck').setValue(this.projectDetails.includeForDashboardMetrics)
    this.processInfo.get('liveDate').setValue(this.projectDetails.goLiveDate)
    this.processInfo.get('processFrequency').setValue(this.projectDetails.processFrequency)
    this.processInfo.get('costSaved').setValue(this.projectDetails.costSavedForExecution)
    this.processInfo.get('comment').setValue(this.projectDetails.comments)
    if( this.projectDetails.costSavedForExecution != null){
      this.isChange = true
    } else {
      this.isChange = false
    }

    let days : number;
    let hours : number;
    let minutes : number;

      if(this.projectDetails?.timeSavedForExecution){
        if(this.projectDetails?.timeSavedForExecution!=""){
          const parts = this.projectDetails.timeSavedForExecution.match(/\d+[dhm]/g);
          if (parts) {
            parts.forEach(part => {
              const value = parseInt(part);
              if (part.endsWith('d')) {
                days = value;
              } else if (part.endsWith('h')) {
                hours = value;
              } else if (part.endsWith('m')) {
                minutes = value;
              }
              this.processInfo.get('days').setValue(days)
              this.processInfo.get('hours').setValue(hours)
              this.processInfo.get('minutes').setValue(minutes)
            });
          }
        } 
      }
  }

  updateInfo(){
    let req_body = {
      "roiProcessName": this.processInfo.value.processName,
      "includeForDashboardMetrics": this.processInfo.value.metricCheck,
      "goLiveDate": this.processInfo.value.liveDate,
      "processFrequency": this.processInfo.value.processFrequency,
      "timeSavedForExecution": this.processInfo.value.days + "d " + this.processInfo.value.hours + "h " + this.processInfo.value.minutes + "m",
      "costSavedForExecution":  this.processInfo.value.costSaved,
      "comments": this.processInfo.value.comment
    }

    this.rest.saveProcessInfo(this.project_id,req_body).subscribe((res:any) => {
      if(res.message == "Saved Successfully"){
        this.toastService.showSuccess(this.processInfo.value.processName,'update');
        let message = false;
        this.customEvent.emit(message);
        this.resetForm();
      }
    })
  }

  onCheckboxChange(event : any){
    this.isRequired = event.target.checked
    this.processInfo.get("liveDate").clearValidators();
    this.processInfo.get("processFrequency").clearValidators();
    if(event.target.checked == true){
      this.addValidators();
    } else {
      this.processInfo.get("liveDate").setValidators([]);
      this.processInfo.get("liveDate").updateValueAndValidity();
      this.processInfo.get("processFrequency").setValidators([]);
      this.processInfo.get("processFrequency").updateValueAndValidity();
    }
  }


  getFrequency(){
    this.rest.getProcessFrequencies().subscribe((res : any) => {
      let filterData = res;
      this.frequency = Object.keys(filterData).map((key) => ({
        type: key,
        value: filterData[key],
      }));
      return this.frequency;
    })
  }

  get getTimeSavedPerExecutionValidation(){
      return (this.processInfo.get("days").value=="" && this.processInfo.get("hours").value=="" &&this.processInfo.get("minutes").value=="" )?true:false;
  }

  get getTimeSavedPerExecutionMessageValidation(){
    if(this.processInfo.get("days").touched || this.processInfo.get("hours").touched || this.processInfo.get("minutes").touched  )
    return (this.processInfo.get("days").value=="" && this.processInfo.get("hours").value=="" &&this.processInfo.get("minutes").value=="" )?true:false;
  
  }

  getallProjects(roles, name, email) {
    this.isLoading = true
    this.rest.getAllProjects(roles, name, email).subscribe(data => {
      data[1].forEach(element => {
        if(!element.includeForDashboardMetrics)
        this.projects_list.push(element)
      });
      this.isLoading = false
      console.log(this.projects_list)
    });
  }

  onProjectChange() { 
    this.getProcessDetails(this.processInfo.value.projectId)
    this.project_id = this.processInfo.value.projectId
  }

  addValidators(){
    this.processInfo.get("liveDate").setValidators([Validators.required]);
    this.processInfo.get("liveDate").updateValueAndValidity();
    this.processInfo.get("processFrequency").setValidators([Validators.required]);
    this.processInfo.get("processFrequency").updateValueAndValidity();
  }

}
