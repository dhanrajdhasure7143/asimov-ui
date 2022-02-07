import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { DataTransferService } from '../../services/data-transfer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import {ProjectsProgramsTableComponent} from './projects-programs-table/projects-programs-table.component'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { query } from '@angular/animations';
import { APP_CONFIG } from 'src/app/app.config';

@Component({
  selector: 'app-projects-list-screen',
  templateUrl: './projects-list-screen.component.html',
  styleUrls: ['./projects-list-screen.component.css']
})
export class ProjectsListScreenComponent implements OnInit {

  projects_toggle:Boolean=false;
  projects_list:any=[];
  users_list:any=[];
  processes:any=[];
  selected_tab:any;
  search:any="";
  count:any={
    New:0,
    Inprogress:0,
    OnHold:0,
    Pipeline:0,
    Rejected:0,
    Inreview:0,
    Approved:0,
    Closed:0,
    Deployed:0

  }

  @ViewChild(ProjectsProgramsTableComponent,{static:false}) projecttable:ProjectsProgramsTableComponent;
  public isButtonVisible = false;
  public userRole:any = [];
  customUserRole: any;
  enablecreateproject: boolean=false;
  viewallprojects: boolean=false;
  public userRoles: any;
 public name: any;
 email:any;
 create_Tabs:any;
 projectsresponse:any=[];
  freetrail: string;
  constructor(private dt:DataTransferService, private api:RestApiService, 
    private spinner:NgxSpinnerService,private router:Router,
    @Inject(APP_CONFIG) private config){}

  ngOnInit() {
    localStorage.setItem('project_id',null);
    localStorage.setItem('bot_id',null);
    this.dt.changeParentModule({"route":"/pages/projects/projects-list-screen", "title":"Projects"});
    this.dt.changeChildModule(undefined);

    this.api.getCustomUserRole(2).subscribe(role=>{
      this.customUserRole=role;
      let element=[]
     for (let index = 0; index < this.customUserRole.message.length; index++) {
      element = this.customUserRole.message[index].permission;
       element.forEach(element1 => {
        if(element1.permissionName.includes('Project_Create')){
          this.enablecreateproject=true;
        }
       });
     }
    
        })

        this.userRoles = localStorage.getItem("userRole")
        this.userRoles = this.userRoles.split(',');
        this.name=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName")
        this.email=localStorage.getItem('ProfileuserId');
    this.getallProjects(this.userRoles,this.name,this.email);

    this.getallusers();
    this.getallprocesses();
    this.freetrail=localStorage.getItem('freetrail')
  }


  
  getallProjects(roles,name,email){
    this.spinner.show();
    this.api.getAllProjects(roles,name,email).subscribe(res=>{
      let response:any=res;
      this.projectsresponse=response
      this.projects_list=[...response[0].map(data=>{
      return {
        id:data.id,
        projectName:data.programName,
        access:data.access,
        initiatives:data.initiatives,
        process:data.process,
        type:data.type,
        owner:data.owner,
        priority:data.priority,
        createdBy:data.createdBy,
        status:data.status==null?"New":data.status,
        resources:data.resources,
        mapValueChain:data.mapValueChain,
        measurableMetrics:data.measurableMetrics,
        purpose:data.purpose
      }
    }),...response[1].map(data=>{
        return {
          id:data.id,
          projectName:data.projectName,
          access:data.access,
          initiatives:data.initiatives,
          process:data.process,
          type:(data.type==null?"Project":data.type),
          owner:data.owner,
          status:data.status==null?"New":data.status,
          priority:data.priority,
          createdBy:data.createdBy,
          resources:data.resources,
          mapValueChain:data.mapValueChain,
          measurableMetrics:data.measurableMetrics,
          startDate:data.startDate,
          endDate:data.endDate
        }
    })];
    this.spinner.hide();
    this.count.New=this.projects_list.filter(item=>item.status=="New").length
    this.count.Inprogress=this.projects_list.filter(item=>item.status=="In Progress").length
    this.count.Pipeline=this.projects_list.filter(item=>item.status=="Pipeline").length
    this.count.OnHold=this.projects_list.filter(item=>item.status=="On Hold").length
    this.count.Rejected=this.projects_list.filter(item=>item.status=="Rejected").length    
    this.count.Inreview=this.projects_list.filter(item=>item.status=="In Review").length
    this.count.Approved=this.projects_list.filter(item=>item.status=="Approved").length
    this.count.Closed=this.projects_list.filter(item=>item.status=="Closed").length
    this.count.Deployed=this.projects_list.filter(item=>item.status=="Deployed").length
    setTimeout(()=>{
     this.selected_tab=0;
    },100)
    })
    //document.getElementById("filters").style.display='block'; 
}



  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.users_list=users;
    })
  }

  getallprocesses()
  {
    this.api.getprocessnames().subscribe(processnames=>{
      let resp:any=[]
      resp=processnames
      this.processes=resp.filter(item=>item.status=="APPROVED");
    })
  }
  
  createNew(){

    if(this.freetrail=='true'){
     if(this.projectsresponse[1].length==0){
      this.create_Tabs="projects"
    }else if(this.projectsresponse[1].length==this.config.projectfreetraillimit){
      Swal.fire({
        title: 'Error',
        text: "You have limited access to this product. Please contact EZFlow support team for more details.",
        position: 'center',
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        heightAuto: false,
        confirmButtonText: 'Ok'
    })
     return 
    }else if(this.projectsresponse[1].length>=1){
      this.create_Tabs="projects"
    }
  }else{
    this.create_Tabs="projects&programs"
  }
    this.router.navigate(["/pages/projects/create-projects"],{queryParams:{id:this.create_Tabs}})
  }

  getprojectsList(event){
   
   this.projectsresponse=event
  }

}
