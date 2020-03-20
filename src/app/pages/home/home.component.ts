import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from "../services/data-transfer.service";
import { PagesHints } from '../model/pages.model';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataArr:any[];
  selectedIndex: number=0;

  constructor(private router: Router, private dt:DataTransferService, private hints:PagesHints) { }

  ngOnInit() {
    this.dt.changeParentModule(undefined);
    this.dt.changeChildModule(undefined);
    this.dataArr = [
      {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},
      {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
      {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA Studio", "link":""},
      {"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"}
    ];
    this.dt.changeHints(this.hints.homeHints);
  }

  loopTrackBy(index, term){
    return index;
  }

}