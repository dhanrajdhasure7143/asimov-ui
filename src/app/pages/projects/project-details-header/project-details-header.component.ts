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
  editdata:Boolean=false
  ngOnInit() {
    
    
    this.projectdata=this.projectscreen.projectDetails
    console.log("project details component",this.projectscreen.projectDetails)
    console.log(this.projectdata.owner, this.users_list);
  }





}
