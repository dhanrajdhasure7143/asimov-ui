import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { ProjectsProgramsTableComponent } from '../projects-list-screen/projects-programs-table/projects-programs-table.component';
import { ProjectDetailsScreenComponent } from '../project-details-screen/project-details-screen.component';
@Component({
  selector: 'app-create-tasks',
  templateUrl: './create-tasks.component.html',
  styleUrls: ['./create-tasks.component.css']
})
export class CreateTasksComponent implements OnInit {

  createtaskForm:FormGroup;
  mindate= moment().format("YYYY-MM-DD");
  maxdate= moment().format("YYYY-MM-DD");
  userslist: any;
  pi_process_list: any;
  bpm_process_list: any;
  bot_list: any;
  projectdetails: Object;
  taskcategories: Object;
  approverslist: any=[];
  project_id:number;
  taskDescriptionFlag: boolean = false;
  freetrail: string;
  constructor(private formBuilder: FormBuilder,private spinner:NgxSpinnerService,private api:RestApiService,
    private router: Router, private route:ActivatedRoute) { }

  ngOnInit() {

     this.createtaskForm=this.formBuilder.group({
      taskCategory: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      startDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      correlationID: [""],
      taskName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      timeEstimate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      endDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      approvers: ["",Validators.compose([Validators.maxLength(50)])],
      description: ["", Validators.compose([Validators.maxLength(200)])],
      })

      this.spinner.show();

      this.route.queryParams.subscribe(data=>{
        let response:any=data;
        this.project_id=response.project_id
        this.getallusers();
        this.getTaskCategories();
        this.getallpiprocess();
        this.getallbpmprocess();
        this.getallbots();
      })
      this.getProjectDetails();
      this.freetrail=localStorage.getItem('freetrail')
      if(this.freetrail!='true') {
        this.createtaskForm.get('approvers').setValidators(Validators.required)
      } else {
        this.createtaskForm.get('approvers').clearValidators();
      }

  }

  inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   } 
  }

  savetasks()
  {
    this.spinner.show();
    this.createtaskForm.value.status="New";
    this.createtaskForm.value.percentageComplete=0;
    this.createtaskForm.value.projectId=this.project_id;
    let data=this.createtaskForm.value;
    this.api.createTask(data).subscribe(data=>{
      let response:any=data;
      this.spinner.hide();
      if(response.message!=undefined)
      {
        let status: any= response;
        //this.createtaskmodalref.hide();
        Swal.fire({
          title: 'Success',
          text: "Task Created Successfully !!",
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
      }).then((result) => {
        this.resettask();
        
        this.router.navigate(['/pages/projects/projectdetails'],{queryParams:{id:this.project_id}})
        //this.projectdetailscreen.getTaskandCommentsData();
      }) 
        
      }
      else
      Swal.fire("Error",response.message,"error");
      
    })
  }

  getallbpmprocess(){
    this.api.getprocessnames().subscribe(data =>{
      let response:any=data;
      let resp:any="";
    resp=response.filter(item=>item.status=="APPROVED");
    this.bpm_process_list=resp.sort((a,b) => (a.processName.toLowerCase() > b.processName.toLowerCase() ) ? 1 : ((b.processName.toLowerCase() > a.processName.toLowerCase() ) ? -1 : 0));
    })
  }

  getallpiprocess(){
    this.api.getAlluserProcessPiIds().subscribe(data =>{
      let response:any=data;
      this.pi_process_list=response.data.sort((a,b) => (a.piName.toLowerCase() > b.piName.toLowerCase() ) ? 1 : ((b.piName.toLowerCase() > a.piName.toLowerCase() ) ? -1 : 0));
    })
  }

  getallbots(){
    this.api.getAllActiveBots().subscribe(data =>{
      let response:any=data;
     this.bot_list=response.sort((a,b) => (a.botName.toLowerCase() > b.botName.toLowerCase() ) ? 1 : ((b.botName.toLowerCase() > a.botName.toLowerCase() ) ? -1 : 0));
    })
  }

  getTaskCategories(){
    this.api.getTaskCategories().subscribe(data =>{
      this.taskcategories=data
    })
  }

  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
     // this.userslist=users.sort((a,b) => (a.userId.firstName.toLowerCase() > b.userId.firstName.toLowerCase() ) ? 1 : ((b.userId.firstName.toLowerCase() > a.userId.firstName.toLowerCase() ) ? -1 : 0));
     this.userslist=users;
      for (let index = 0; index < this.userslist.length; index++) {
        let user=this.userslist[index]
        if(user.roleID.displayName==="Process Architect"){
        const element = user;
        this.approverslist.push(element)
      }
      }
      this.spinner.hide();
    })
  }
  
  resettask(){
    this.createtaskForm.reset();
    this.createtaskForm.get("taskCategory").setValue("");
  this.createtaskForm.get("priority").setValue("");
  this.createtaskForm.get("resources").setValue("");
  this.createtaskForm.get("approvers").setValue("");
  this.createtaskForm.get("correlationID").setValue("");
  }
  DateMethod(){
    return false;
  }
  endDateMethod(){
   return false;
  }
  onchangeDate(){
    if(this.createtaskForm.get("endDate").value)
    this.createtaskForm.get("endDate").setValue("0000-00-00");
    this.mindate=this.createtaskForm.get("startDate").value;
  }
  getProjectDetails(){
    this.api.getProjectDetailsById(this.project_id).subscribe(response=>{
      // this.maxdate=response.endDate;
      this.maxdate = moment(response.endDate).format("YYYY-MM-DD")
     
  })
}
taskDescriptionMaxLength(value){
  if(value.length > 150){
  this.taskDescriptionFlag = true;
  }else{
    this.taskDescriptionFlag = false;
  }
   }

}
