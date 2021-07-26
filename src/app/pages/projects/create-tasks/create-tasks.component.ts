import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  mindate: string;
  @Input('createtaskmodalref') public createtaskmodalref: BsModalRef;
  @Input('project_id') public project_id: BsModalRef;
  userslist: any;
  projectdetails: Object;
  taskcategories: Object;
  approverslist: any=[];
  constructor(private formBuilder: FormBuilder,private spinner:NgxSpinnerService,private api:RestApiService,
    private router: Router,private projectdetailscreen:ProjectDetailsScreenComponent) { }

  ngOnInit() {


    this.createtaskForm=this.formBuilder.group({
      taskCategory: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      startDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      taskName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      timeEstimate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      endDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      approvers: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      description: ["", Validators.compose([Validators.maxLength(200)])],
      })


      this.mindate= moment().format("YYYY-MM-DD");


      this.getallusers();
      this.getTaskCategories();
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
        this.createtaskmodalref.hide();
        Swal.fire({
          title: 'Success',
          text: ""+status.message,
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
      }).then((result) => {
        this.resettask();
        this.projectdetailscreen.getTaskandCommentsData();
      }) 
        
      }
      else
      Swal.fire("Error",response.message,"error");
      
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
      this.userslist=users;

      for (let index = 0; index < this.userslist.length; index++) {
        let user=this.userslist[index]
        if(user.roleID.displayName==="Process Architect"){
        const element = user;
        this.approverslist.push(element)
      }
      }
    })
  }
  
  resettask(){
    this.createtaskForm.reset();
    this.createtaskForm.get("taskCategory").setValue("");
  this.createtaskForm.get("priority").setValue("");
  this.createtaskForm.get("resources").setValue("");
  this.createtaskForm.get("approvers").setValue("");
  }

}
