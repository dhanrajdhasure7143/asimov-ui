import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from "../services/data-transfer.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataArr:any[];
  selectedIndex: number=0;

  constructor(private router: Router, private dt:DataTransferService) { }

  ngOnInit() {
    this.dt.changeParentModule("Home");
    this.dt.changeChildModule(undefined);
    this.dataArr = [
      {"img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},
      {"img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
      {"img":"assets/images/Group 348.svg", "title":"RPA Studio", "link":""},
      {"img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration"}
    ];
  }
}