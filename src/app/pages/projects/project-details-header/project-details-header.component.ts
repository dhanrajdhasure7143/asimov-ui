import { ProjectDetailsScreenComponent } from '../project-details-screen/project-details-screen.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-details-header',
  templateUrl: './project-details-header.component.html',
  styleUrls: ['./project-details-header.component.css']
})
export class ProjectDetailsHeaderComponent implements OnInit {

  projectdata:any;
  @Input('users_list') public users_list: any=[];
  @Input('processes') public processes: any=[];

  constructor(private projectscreen:ProjectDetailsScreenComponent) { }
  editdata:any;
  ngOnInit() {
    this.editdata={
      
        access: false,
        createdBy: false,
        createdTimestamp:false,
        endDate: false,
        initiatives:false,
        lastModifiedBy: false,
        lastModifiedTimestamp: false,
        mapValueChain: false,
        measurableMetrics: false,
        owner:false,
        priority: false,
        process:false,
        projectName: false,
      
    }
    this.projectdata=this.projectscreen.projectDetails
    console.log("project details component",this.projectscreen.projectDetails)
  }




  reset()
  {
    this.editdata={
      access: false,
      createdBy: false,
      createdTimestamp:false,
      endDate: false,
      initiatives:false,
      lastModifiedBy: false,
      lastModifiedTimestamp: false,
      mapValueChain: false,
      measurableMetrics: false,
      owner:false,
      priority: false,
      process:false,
      projectName: false,
    }
  }

}
