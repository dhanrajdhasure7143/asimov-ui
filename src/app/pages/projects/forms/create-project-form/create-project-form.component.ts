import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-project-form',
  templateUrl: './create-project-form.component.html',
  styleUrls: ['./create-project-form.component.css']
})
export class CreateProjectFormComponent implements OnInit {

  constructor(private formBuilder:FormBuilder,private notifier:NotifierService, private spinner:NgxSpinnerService, private rest:RestApiService ) { }
  insertForm2:FormGroup;
  selectedresources:any=[];
  valuechain:any=[];
  valuechainprocesses:any=[];
  mindate= moment().format("YYYY-MM-DD");
  @Input('users_list') public users_list: any[];
  @Input('processes') public processes:any[];
  @Input('initiatives_list') public initiatives_list:any[];
  selected_process_names:any=[];
  @Output() oncreate = new EventEmitter<String>();
  date = new Date();
  loggedInUserId:any;
  categories_list:any[]=[];
  categoriesList:any=[];
  freetrail: string;
  processOwner:boolean;
  resources_list:any[]=[];
  ngOnInit(): void {
    this.loggedInUserId=localStorage.getItem("ProfileuserId")
    this.insertForm2=this.formBuilder.group({
      projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      resource: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: [this.loggedInUserId, Validators.compose([Validators.required, Validators.maxLength(50)])],
      mapValueChain: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      endDate: [""],
      startDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      measurableMetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      process: ["", Validators.compose([Validators.maxLength(50)])],
      processOwner: [""],
     
      // description: ["", Validators.compose([Validators.maxLength(200)])],
     // access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      
      projectPurpose: ["", Validators.compose([Validators.required, Validators.maxLength(150)])],
      // status: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],

    })

    // this.getvalchain();
    this.getprocessnames();
    this.freetrail=localStorage.getItem('freetrail')

    if(this.freetrail!='true') {
      this.insertForm2.get('process').setValidators(Validators.required)
      this.insertForm2.get('processOwner').setValidators(Validators.required)
    } else {
      this.insertForm2.get('process').clearValidators();
      this.insertForm2.get('processOwner').clearValidators();
    }
    this.rest.getCategoriesList().subscribe(res=> {
      this.categoriesList=res
      this.categories_list=this.categoriesList.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
      // if(this.categories_list.length==1){
      //   this.categoryName=this.categories_list[0].categoryName
      // }
    });
   
  }


  getprocessnames()
  {
    this.rest.getprocessnames().subscribe(processnames=>{
      let response:any=processnames;
      let resp:any=[]
      //resp=processnames
      //this.selected_process_names=resp.filter(item=>item.status=="APPROVED");
      resp=response.filter(item=>item.status=="APPROVED");
      this.selected_process_names=resp.sort((a,b) => (a.processName.toLowerCase() > b.processName.toLowerCase() ) ? 1 : ((b.processName.toLowerCase() > a.processName.toLowerCase() ) ? -1 : 0));
      // this.selected_process_names =[...this.selected_process_names.map(process=>

      //   {
      //     let userdata=this.users_list.find(userData=>userData.userId.userId==process.ProcessOwner)
      //     if(userdata!=undefined){
      //       process["processOwnerName"]=userdata.firstName +" "+  userdata.lastName; 
            
      //     }
      //     return process;})]
    })
  }

  ngOnChanges(){
    this.users_list.forEach((element)=>{  
      if(element.userId.userId!=this.loggedInUserId)
     this.resources_list.push(element)
   });
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
      //this.insertForm2.value.mapValueChain=this.valuechain.find(item=>item.processGrpMasterId==this.insertForm2.value.mapValueChain).processName;
      let data=this.insertForm2.value;
      data["resource"]=data.resource.map(item=>{ return {resource:item}});
      data["effortsSpent"]=0;      
      data["projectHealth"]="Good";     
      data["projectPercentage"] =0;
      let project=JSON.stringify(data)
      this.oncreate.emit(project);
    }
  }
  onProcessChange(processId:number)
  {
    
    let process=this.selected_process_names.find(process=>process.processId==processId);
    if(process!=undefined)
    {
    
      let processOwner:any=this.users_list.find(item=>(item.userId.userId==process.ProcessOwner))
      if(processOwner!=undefined)
      {
        this.insertForm2.get("processOwner").setValue(processOwner.userId.userId);
        this.processOwner=false
      }else
      {
        this.insertForm2.get("processOwner").setValue("")
        Swal.fire("Error","Unable to find process owner for selected process","error")
      }
    }
  }

  
  resetcreateproject()
  {
        this.insertForm2.reset();
        
        this.insertForm2.get("resource").setValue("");
        this.insertForm2.get("mapValueChain").setValue("");
        this.insertForm2.get("owner").setValue(this.loggedInUserId);
        
        this.insertForm2.get("processOwner").setValue("");
        this.insertForm2.get("initiatives").setValue("");
        this.insertForm2.get("priority").setValue("");
        this.insertForm2.get("process").setValue("");
        
  }


  getValueChainProcesses(value)
  {
    this.rest.getvaluechainprocess(value).subscribe(data=>{
      let response:any=data;
      this.valuechainprocesses=response;
    })
  }


  getvalchain()
  {
    this.valuechain=[];
    this.rest.getvaluechain().subscribe(res=>{
      let response:any=res;
      this.valuechain=response;
    })
  }
  DateMethod(){
    return false;
  }
  endDateMethod(){
   return false;
  }
  
  onchangeDate(){
    if(this.insertForm2.get("endDate").value)
    this.insertForm2.get("endDate").setValue("0000-00-00");
    this.mindate=this.insertForm2.get("startDate").value;
  }

}
