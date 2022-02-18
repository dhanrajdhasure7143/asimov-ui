import { Component, OnInit,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Base64 } from 'js-base64';
import { Router,ActivatedRoute } from '@angular/router';
import moment from 'moment';

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
  categories_list:any[]=[];
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
  selectedresources:any;
  username: string;
  mindate: any;
  unassigned_projects:any=[];
  valuechain:any=[];
  valuechainprocesses:any=[];
  public userRoles: any;
  categoriesList:any=[];
  public name: any;
   email: any;
   initiatives: any;
   projectsdata:any;

   loggedInUserId:any;
   descptionFlag: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private api:RestApiService, 
    private spinner:NgxSpinnerService,
    private modalService: BsModalService,
     private router: Router,
    private route:ActivatedRoute
    ) {
      this.route.queryParams.subscribe(data=>{
        this.projectsdata=data.id;
      })
     }

  ngOnInit() {
    
    this.loggedInUserId=localStorage.getItem("ProfileuserId");
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
    measurableMetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    //programHealth: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    programValueChain: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    processOwner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
   // project: ["", Validators.compose([Validators.maxLength(50)])],
    owner: [this.loggedInUserId, Validators.compose([Validators.required, Validators.maxLength(50)])],
   // process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
   // access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.maxLength(200)])],
   // status: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    })

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
    processOwner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.maxLength(200)])],
    access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
   // status: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],

})
this.userRoles = localStorage.getItem("userRole")
this.userRoles = this.userRoles.split(',');
this.name=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName")
this.email=localStorage.getItem('ProfileuserId');

    this.resetcreateproject();
    this.getallusers();
    this.getallProjects(this.userRoles,this.name,this.email);
    this.getprocessnames();
    this.getunassignedprojectslist(this.userRoles,this.name,this.email);
    this.getvalchain();
    this.mindate= moment().format("YYYY-MM-DD");
    this.getInitiatives();
    this.api.getCategoriesList().subscribe(res=> {
      this.categoriesList=res
      this.categories_list=this.categoriesList.data
      // if(this.categories_list.length==1){
      //   this.categoryName=this.categories_list[0].categoryName
      // }
    });
  }


  linkcreateproject(event){
  this.newproject.push(JSON.parse(event))
 
  this.modalRef.hide();
  }
   
  getallProjects(roles,name,email){
    this.spinner.show();
    this.api.getAllProjects(roles,name,email).subscribe(data1 => {
        this.spinner.hide();
        this.projects_list=data1[1]
      })   
  }



getunassignedprojectslist(roles,name,email)
{
  this.api.getunassignedprojects(roles,name,email).subscribe(data=>{
    this.unassigned_projects=data;
  })
}
createproject(event)
  {
  
    this.spinner.show();
    let data=JSON.parse(event);
    this.api.createProject(data).subscribe(data=>{
      let response:any=data;
      this.spinner.hide();
      if(response.errorMessage==undefined)
      {
        let status: any= response;
        Swal.fire({
          title: 'Success',
          text:response.message,
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
      }).then((result) => {
        this.resetcreateproject();
        this.getallProjects(this.userRoles,this.name,this.email);
        // this.projectDetails={
        //   description: this.projectcreatedata.description,
        //   endDate: this.projectcreatedata.endDate,
        //   initiatives: this.projectcreatedata.initiatives,
        //   mapValueChain: this.projectcreatedata.mapValueChain,
        //   measurableMetrics: this.projectcreatedata.measurableMetrics,
        //   owner: this.projectcreatedata.owner,
        //   process: this.projectcreatedata.process,
        //   projectName: this.projectcreatedata.projectName,
        //   priority: this.projectcreatedata.priority,
        //   resource: this.projectcreatedata.resources,
        //   startDate: this.projectcreatedata.startDate,
        //   status:this.projectcreatedata.status,
        //   id:response.project.id
        // }
        // this.navigatetodetailspage(this.projectDetails);
        
        this.router.navigate(['/pages/projects/projectdetails'],{queryParams:{id:response.project.id}})
      }) 
        
      }
      else
      Swal.fire("Error",response.errorMessage,"error");
      
    })
  }

  navigatetodetailspage(){
    
  }

  getprocessnames()
{
  this.api.getprocessnames().subscribe(processnames=>{
    let response:any=processnames;
    let resp:any=[]
    //resp=processnames
    //this.selected_process_names=resp.filter(item=>item.status=="APPROVED");
    resp=response.filter(item=>item.status=="APPROVED");
    this.selected_process_names=resp.sort((a,b) => (a.processName.toLowerCase() > b.processName.toLowerCase() ) ? 1 : ((b.processName.toLowerCase() > a.processName.toLowerCase() ) ? -1 : 0));
    
  })
  }

  saveProgram(){​​​​​​​​
    let userfirstname=localStorage.getItem("firstName")
    let userlastname=localStorage.getItem("lastName")
    this.username=userfirstname+" "+userlastname
    this.createprogram.value.createdBy=this.username;
    //this.createprogram.value.programValueChain=this.valuechain.find(item=>item.processGrpMasterId==this.createprogram.value.programValueChain).processName;
    this.createprogram.value.status="New";
    this.createprogram.value.programHealth="Good";
    let data=this.createprogram.value;
    data["project"]=this.newproject
    data["existingprojects"]=this.selected_projects.map(item => {
 return {
   id:item.id
 }
    })
  
      this.spinner.show()
      this.api.saveProgram(data).subscribe( res=>{​​​​​​​​
        this.spinner.hide();
        let response:any=res
        if(response.errorMessage==undefined)
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
          this.resetcreateprogram();
          this.getallProjects(this.userRoles,this.name,this.email);
          
          this.router.navigate(['/pages/projects/programdetails'],{queryParams:{id:response.program.id}})

        }) 
        }
        else
        {
          Swal.fire("error",response.errorMessage,"error");
        }
      }​​​​​​​​);
    }​​​​​​​​

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
  resetcreateprogram()
  {
        this.createprogram.reset();
        this.createprogram.get("owner").setValue(this.loggedInUserId);
        this.createprogram.get("processOwner").setValue("");
        this.createprogram.get("priority").setValue("");
        this.createprogram.get("initiatives").setValue("");
        $('#selectprojects').prop('selectedIndex',0);
  }
  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.userslist=users;
      this.userslist=this.userslist.filter(x=>x.user_role_status=='ACTIVE')
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
     this.selected_project='';
     $('#selectprojects').val('');
  }

  remove_project(project,status)
  {
   if(project!=undefined)
    {
      if(status=='selected')
        this.selected_projects.splice(this.selected_projects.indexOf(project),1)
      else if(status=='new')
        this.newproject.splice(this.selected_projects.indexOf(project),1)
    }
  }
  
  getValueChainProcesses(value)
  {
    // //this.valuechainprocesses=[];
    // console.log(value);
    // console.log(this.valuechain)
  // let processmaster=this.valuechain.find(item=>item.processGrpMasterId==value)
    //console.log("-processMaster-",value)
    this.api.getvaluechainprocess(value).subscribe(data=>{
      let response:any=data;
      this.valuechainprocesses=response;
    })
  }


  getvalchain()
  {
    this.valuechain=[];
    this.api.getvaluechain().subscribe(res=>{
      let response:any=res;
      this.valuechain=response;
    })
  }

  getInitiatives(){
    this.api.getProjectIntitiatives().subscribe(res=>{
      let response:any=res;
      this.initiatives=response;
    })
  }

  descriptionMaxLength(value){
    console.log(value)
 if(value.length > 150){
 this.descptionFlag = true;
 }else{
   this.descptionFlag = false;
 }
  }

  onProcessChange(processId:number)
  {
    let process=this.selected_process_names.find(process=>process.processId==processId);
    if(process!=undefined)
    {
      let processOwner:any=this.userslist.find(item=>(`${item.userId.firstName} ${item.userId.lastName}`==process.createdBy))
      if(processOwner!=undefined)
      {
        this.createprogram.get("processOwner").setValue(processOwner.userId.userId)
      }else
      {
        this.createprogram.get("processOwner").setValue("")
        Swal.fire("Error","Unable to find process owner for selected process","error")
      }
    }
  }
  
}