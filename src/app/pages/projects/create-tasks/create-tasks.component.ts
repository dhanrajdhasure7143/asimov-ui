import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-create-tasks',
  templateUrl: './create-tasks-new.component.html',
  styleUrls: ['./create-tasks.component.css']
})
export class CreateTasksComponent implements OnInit {

  @Input('users_list') public users_list: any[];
  @Input('params_data') public params_data: any;
  @Input('hiddenPopUp') public hiddenPopUp: boolean;
  @Input('existingUsersList') public existingUsersList: any[];
  @Input('project_name') public project_name: any;
  createtaskForm:FormGroup;
  mindate= moment().format("YYYY-MM-DD");
  maxdate= moment().format("YYYY-MM-DD");
  pi_process_list: any;
  bpm_process_list: any;
  bot_list: any;
  projectdetails: Object;
  taskcategories: Object;
  task_categoriesList: any;
  approverslist: any[]=[];
  project_id:number;
  taskDescriptionFlag: boolean = false;
  freetrail: string;
  _priority:any[]=["High","Medium","Low"];
  optionValue:any;
  emptyList:any[]=[];
  isExist_user:boolean= false;
  position: string;
  invalidText: boolean;

  constructor(private formBuilder: FormBuilder,private spinner:LoaderService,private api:RestApiService,
    private router: Router, private route:ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    
    ) { }

  ngOnInit() {

     this.createtaskForm=this.formBuilder.group({
      taskName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      taskCategory: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      correlationID: [""],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["",Validators.compose([Validators.required])],
      resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      // approvers: ["",Validators.compose([Validators.required,Validators.maxLength(50)])],
      description: ["", Validators.compose([Validators.required])],


      // timeEstimate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      })

      this.spinner.show();

      this.route.queryParams.subscribe(data=>{
        let response:any=data;
        this.project_id=response.project_id
        // this.getallusers();
        this.getTaskCategories();
        this.getTaskCategoriesByProject();
        this.getallpiprocess();
        this.getallbpmprocess();
        this.getallbots();
      })
      this.getProjectDetails();
      this.freetrail=localStorage.getItem('freetrail')
      // if(this.freetrail!='true') {
      //   this.createtaskForm.get('approvers').setValidators(Validators.required)
      // } else {
      //   this.createtaskForm.get('approvers').clearValidators();
      // }

  }

  inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   }
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.users_list && this.users_list.length>0){
      for (let index = 0; index < this.users_list.length; index++) {
        let user=this.users_list[index]
        if(user.roleID.displayName==="Process Architect"){
        const element = user;
        this.approverslist.push(element);
      }
      }
    }
    if(!this.hiddenPopUp)
    setTimeout(() => {
      this.resettask();
    }, 200);
  }

  savetasks()
  {
    this.spinner.show();
    this.createtaskForm.value.status="New";
    this.createtaskForm.value.percentageComplete=0;
    this.createtaskForm.value.projectId=this.project_id;
    let data=this.createtaskForm.value;
    if(this.createtaskForm.value.taskCategory == 'As-Is Process' || this.createtaskForm.value.taskCategory == 'To-Be Process'){
      data["process"] = this.bpm_process_list.find(each=>each.correlationID == this.createtaskForm.value.correlationID).processId
    }
    this.api.createTask(data).subscribe(data=>{
      let response:any=data;
      this.spinner.hide();
      if(response.code == 4200){
        let status: any= response;
        //this.createtaskmodalref.hide();
        
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Task created successfully!"
        })
          //this.resettask();
          this.router.navigate(["/pages/projects/taskDetails"], {
            queryParams: {
              project_id: this.params_data.project_id,
              project_name: this.project_name,
              task_id: response.taskId,
            }
          });
        
      //   Swal.fire({
      //     title: 'Success',
      //     text: "Task Created Successfully !",
      //     position: 'center',
      //     icon: 'success',
      //     showCancelButton: false,
      //     customClass: {
      //       confirmButton: 'btn bluebg-button',
      //       cancelButton:  'btn new-cancelbtn',
      //     },
         
      //     confirmButtonText: 'Ok'
      // }).then((result) => {
      //   this.resettask();
      //   this.router.navigate(["/pages/projects/taskDetails"], {
      //     queryParams: {
      //       project_id: this.params_data.project_id,
      //       project_name: this.project_name,
      //       task_id: response.taskId,
      //     },
      //   });
      //   //this.projectdetailscreen.getTaskandCommentsData();
      // })

      }
      else
        this.messageService.add({ severity: "error", summary: "Error", detail: response.message});
        // Swal.fire("Error",response.message,"error");

    })
  }

  async getallbpmprocess(){
   await this.api.getprocessnames().subscribe(data =>{
      let response:any=data;
      let resp:any="";
    resp=response.filter(item=>item.status=="APPROVED");
    this.bpm_process_list=resp.sort((a,b) => (a.processName.toLowerCase() > b.processName.toLowerCase() ) ? 1 : ((b.processName.toLowerCase() > a.processName.toLowerCase() ) ? -1 : 0));
    })
  }

  getallpiprocess(){
    this.api.getAlluserProcessPiIds().subscribe((data:any) =>{
      let response:any;
      if(Array.isArray(data.data))
        response=data.data.filter((item) => item.status == "Completed");
      this.pi_process_list=response.sort((a,b) => (a.piName.toLowerCase() > b.piName.toLowerCase() ) ? 1 : ((b.piName.toLowerCase() > a.piName.toLowerCase() ) ? -1 : 0));
    })
  }

  async getallbots(){
   await this.api.getAllActiveBots().subscribe(data =>{
      let response:any=data;
     this.bot_list=response.sort((a,b) => (a.botName.toLowerCase() > b.botName.toLowerCase() ) ? 1 : ((b.botName.toLowerCase() > a.botName.toLowerCase() ) ? -1 : 0));
     this.spinner.hide();
    })

    await this.api.getTaskCategories().subscribe(data =>{
      this.taskcategories=data
    })
  }

  getTaskCategories(){
    // this.api.getTaskCategories().subscribe(data =>{
    //   this.taskcategories=data
    // })
  }

  getallusers(){
    let tenantid=localStorage.getItem("masterTenant")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
     // this.userslist=users.sort((a,b) => (a.userId.firstName.toLowerCase() > b.userId.firstName.toLowerCase() ) ? 1 : ((b.userId.firstName.toLowerCase() > a.userId.firstName.toLowerCase() ) ? -1 : 0));
     this.users_list=users;
      for (let index = 0; index < this.users_list.length; index++) {
        let user=this.users_list[index]
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
  // this.createtaskForm.get("approvers").setValue("");
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

   getTaskCategoriesByProject(){
    this.api.getTaskCategoriesByProject(this.project_id).subscribe(res=>{this.task_categoriesList = res
    })
   }
  
   onAssigneeChange(event){
     // this.existingUsersList.find(data=>data.user_email == event.value)?this.isExist_user= true:this.isExist_user = false
    if(this.existingUsersList.find(data=>data.user_email == event.value) == undefined )
    this.confirmationService.confirm({
      message: 'This user is not in this project, Do you want to Invite them?',
      header: 'Are you sure?',
      
      accept: () => {
        this.confirmationService.close();
      },
      reject: (type) => {
        this.createtaskForm.get("resources").setValue("");
      },
      key: "assigneeDialog"
  });
   }
   spaceNotAllow(event: any) {           //initially doesn't allow space
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
    }
  }
  ContainsSpaces(event){                 //initially doesn't allow space 
    var text = event.textValue;
     if (!/\S/.test(text)) {
      this.invalidText= true;
    } else {
      this.invalidText = false;
    }
  }
}
