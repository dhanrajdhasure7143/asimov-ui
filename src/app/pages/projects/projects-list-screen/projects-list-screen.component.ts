import { Component, OnInit, ViewChild } from '@angular/core';

import { DataTransferService } from '../../services/data-transfer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import {ProjectsProgramsTableComponent} from './projects-programs-table/projects-programs-table.component'
import Swal from 'sweetalert2';
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
  count:any={
    New:0,
    Inprogress:0,
    Inreview:0,
    Rejected:0,
    Approved:0,

  }

  @ViewChild(ProjectsProgramsTableComponent,{static:false}) projecttable:ProjectsProgramsTableComponent;
  constructor(private dt:DataTransferService, private api:RestApiService, private spinner:NgxSpinnerService){}

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/projects/projects-list-screen", "title":"Projects"});
    this.dt.changeChildModule(undefined);
    this.getallProjects();
    this.getallusers();
    this.getallprocesses();
  }


  
  getallProjects(){
    this.spinner.show();
    this.api.getAllProjects().subscribe(res=>{
      let response:any=res;
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
          measurableMetrics:data.measurableMetrics
        }
    })];
    this.spinner.hide();
    this.count.New=this.projects_list.filter(item=>item.status=="New").length
    this.count.Inprogress=this.projects_list.filter(item=>item.status=="In Progress").length
    this.count.Rejected=this.projects_list.filter(item=>item.status=="Rejected").length
    this.count.Approved=this.projects_list.filter(item=>item.status=="Approved").length
    this.count.Inreview=this.projects_list.filter(item=>item.status=="In Review").length
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
  


}
