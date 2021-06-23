import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatTabGroup} from '@angular/material';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-projects-list-screen',
  templateUrl: './projects-list-screen.component.html',
  styleUrls: ['./projects-list-screen.component.css']
})
export class ProjectsListScreenComponent implements OnInit {

  constructor(private dt:DataTransferService){}

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/projects/projects-list-screen", "title":"Projects"});
    this.dt.changeChildModule(undefined);
  }

}
