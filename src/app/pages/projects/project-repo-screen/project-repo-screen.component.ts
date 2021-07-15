import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-repo-screen',
  templateUrl: './project-repo-screen.component.html',
  styleUrls: ['./project-repo-screen.component.css']
})
export class ProjectRepoScreenComponent implements OnInit {
  projects_toggle:Boolean=false;
  constructor() { }

  ngOnInit() {
  }

}
