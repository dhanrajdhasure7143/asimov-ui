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
  constructor(private formBuilder: FormBuilder,private spinner:NgxSpinnerService,private api:RestApiService,
    private router: Router,) { }

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
        this.projectDetailsbyId(this.project_id);
        this.createtaskmodalref.hide();
      }) 
        
      }
      else
      Swal.fire("Error",response.message,"error");
      
    })
  }



  projectDetailsbyId(id){

    this.api.getProjectDetailsById(id).subscribe( res =>{
    this.projectdetails=res;
    console.log("project details",this.projectdetails)
    this.navigatetodetailspage(this.projectdetails)
    })
  }


  navigatetodetailspage(detials){
    let encoded=Base64.encode(JSON.stringify(detials));
    let project={id:encoded}
    this.router.navigate(['/pages/projects/projectdetails',project])
  }

  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.userslist=users;
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
