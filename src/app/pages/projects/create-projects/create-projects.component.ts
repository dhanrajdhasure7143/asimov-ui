import { Component, OnInit,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-projects',
  templateUrl: './create-projects.component.html',
  styleUrls: ['./create-projects.component.css']
})
export class CreateProjectsComponent implements OnInit {
  insertForm: FormGroup;
  insertForm2:FormGroup;
  updateForm:FormGroup;
  createprogram:FormGroup;
  userslist:any=[];
  selected_projects:any=[];
  projects_list:any;
  selected_project:any;
  modalRef: BsModalRef;
  constructor(
    private formBuilder: FormBuilder,
    private api:RestApiService, 
    private spinner:NgxSpinnerService,
    private modalService: BsModalService
    ) { }

  ngOnInit() {
    
    this.updateForm=this.formBuilder.group({
      type: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
      initiatives: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
      process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  })
  this.createprogram=this.formBuilder.group({
    programName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    purpose: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    measurablemetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    project: ["", Validators.compose([Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
    })

  this.insertForm2=this.formBuilder.group({
    projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    mapchainvalue: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    enddate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    startdate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    projectpriority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    measurablemetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.maxLength(200)])],

})
    this.resetcreateproject();
    this.getallusers();
    this.getallProjects();
  }


  
   
  getallProjects(){
    this.spinner.show();
    this.api.getAllProjects().subscribe(data1 => {
        this.spinner.hide();
        this.projects_list=data1[1]
      })   
  }




createproject()
  {
    this.spinner.show();
    this.api.createProject(this.insertForm2.value).subscribe(data=>{
      let response:any=data;
      this.spinner.hide();
      if(response.errormessage==undefined)
      {
        Swal.fire("Success",response.message,"success");
        this.resetcreateproject();
        this.getallProjects();
        
      }
      else
        Swal.fire(response.errormessage,"","error");
      
    })
  }



  saveProgram(){​​​​​​​​
   
      this.spinner.show()
      this.api.saveProgram(this.createprogram.value).subscribe( res=>{​​​​​​​​
        this.spinner.hide();
        let response:any=res
        if(response.errormessage==undefined)
        {
          Swal.fire("Success",response.message,"success")
          this.resetcreateprogram();
          this.getallProjects();
        }
        else
        {
          Swal.fire("error",response.errormessage,"error");
        }
      }​​​​​​​​);
    }​​​​​​​​

  resetcreateproject()
  {
        this.insertForm2.reset();
        
        this.insertForm2.get("resources").setValue("");
        this.insertForm2.get("mapchainvalue").setValue("");
        this.insertForm2.get("owner").setValue("");
        this.insertForm2.get("initiatives").setValue("");
        this.insertForm2.get("projectpriority").setValue("");
        this.insertForm2.get("process").setValue("");
        
  }
  resetcreateprogram()
  {
        this.createprogram.reset();
        this.createprogram.get("priority").setValue("");
        this.createprogram.get("initiatives").setValue("");
        this.insertForm2.get("project").setValue("");
  }
  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.userslist=users;
    })
  }


  addproject(template: TemplateRef<any>)
  {
    this.resetcreateproject();
    this.modalRef = this.modalService.show(template,{class:"modal-lg"});
  }



  add_to_selected_projects()
  {
    let project_id=this.selected_project;
    console.log(this.selected_project)
    let project=this.projects_list.find(item=>item.id==project_id);
    if(project!=undefined)
    if(this.selected_projects.length==0)
      this.selected_projects.push(project)
    else
     if(this.selected_projects.find(item=>item.id==project.id)==undefined)
     {
       this.selected_projects.push(project)
     }
     else
     {
       Swal.fire("Warning","This project is already selected","warning");
     }
  }

  remove_project(project)
  {
   if(project!=undefined)
    {
      this.selected_projects.splice(this.selected_projects.indexOf(project),1)
    }
  }
  

  
}