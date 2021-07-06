import { Component, OnInit,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';

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
  selected_process_names: any;
  programdescription: string = '';
  projectDetails: any;
  projectcreatedata: any;
  projectdetailsEncode: any;
  project: { id: any; };
  projectselection:any=[];
  newproject: any=[];
  constructor(
    private formBuilder: FormBuilder,
    private api:RestApiService, 
    private spinner:NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router
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
   // project: ["", Validators.compose([Validators.maxLength(50)])],
    owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.maxLength(200)])],
    })

  this.insertForm2=this.formBuilder.group({
    projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    mapValueChain: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    endDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    startDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    measurableMetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.maxLength(200)])],
    access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],

})
    this.resetcreateproject();
    this.getallusers();
    this.getallProjects();
    this.getprocessnames();
  }


  linkcreateproject(){
  this.newproject.push(this.insertForm2.value)
  console.log("link",this.newproject)
  this.modalRef.hide();
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
      this.projectcreatedata=this.insertForm2.value
      if(response.errormessage==undefined)
      {
        Swal.fire("Success",response.message,"success");
        this.resetcreateproject();
        this.getallProjects();

        this.projectDetails={
          description: this.projectcreatedata.description,
          enddate: this.projectcreatedata.endDate,
          initiatives: this.projectcreatedata.initiatives,
          mapchainvalue: this.projectcreatedata.mapValueChain,
          measurablemetrics: this.projectcreatedata.measurableMetrics,
          owner: this.projectcreatedata.owner,
          process: this.projectcreatedata.process,
          projectName: this.projectcreatedata.projectName,
          priority: this.projectcreatedata.priority,
          resources: this.projectcreatedata.resources,
          startdate: this.projectcreatedata.startDate

        }
        this.navigatetodetailspage(this.projectDetails);
        
      }
      else
        Swal.fire(response.errormessage,"","error");
      
    })
  }

  navigatetodetailspage(detials){
    this.projectdetailsEncode=Base64.encode(JSON.stringify(detials));
          this.project={id:this.projectdetailsEncode}
          console.log("details",this.project)
          this.router.navigate(['/pages/projects/projectdetails',this.project])
  }

  getprocessnames()
{
  this.api.getprocessnames().subscribe(processnames=>{
    let resp:any=[]
    resp=processnames
    this.selected_process_names=resp.filter(item=>item.status=="APPROVED");
  })
  }

  saveProgram(){​​​​​​​​
    let data=this.createprogram.value;
    data["project"]=this.newproject
    data["existingprojects"]=this.selected_projects.map(item => {
 return {
   id:item.id
 }
    })
    console.log("data",data)
      this.spinner.show()
      this.api.saveProgram(data).subscribe( res=>{​​​​​​​​
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
        this.insertForm2.get("mapValueChain").setValue("");
        this.insertForm2.get("owner").setValue("");
        this.insertForm2.get("initiatives").setValue("");
        this.insertForm2.get("priority").setValue("");
        this.insertForm2.get("process").setValue("");
        
  }
  resetcreateprogram()
  {
        this.createprogram.reset();
        this.createprogram.get("priority").setValue("");
        this.createprogram.get("initiatives").setValue("");
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