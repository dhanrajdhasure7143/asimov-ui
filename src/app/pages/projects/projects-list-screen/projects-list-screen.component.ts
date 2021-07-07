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
        status:data.status
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
          priority:data.priority,
          createdBy:data.createdBy,
          status:data.status
        }
    })];
    this.spinner.hide();
    this.projecttable.getallProjects();
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
