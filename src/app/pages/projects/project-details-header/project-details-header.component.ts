import { ProjectDetailsScreenComponent } from '../project-details-screen/project-details-screen.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-details-header',
  templateUrl: './project-details-header.component.html',
  styleUrls: ['./project-details-header.component.css']
})
export class ProjectDetailsHeaderComponent implements OnInit {

  projectdata:any;
  constructor(private projectscreen:ProjectDetailsScreenComponent) { }

  ngOnInit() {
    this.projectdata=this.projectscreen.projectDetails
    console.log("project details component",this.projectscreen.projectDetails)
  }

}
