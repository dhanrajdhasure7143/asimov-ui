import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  dataArr:any[];
  selectedIndex: number;

  constructor(private router: Router) { }

  ngOnInit() {
    this.dataArr = [
      {"img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence"},
      {"img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":""},
      {"img":"assets/images/Group 348.svg", "title":"RPA Studio", "link":""},
      {"img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration"}
    ]
  }
  selectDataPage(i){
    this.selectedIndex = i;
    this.router.navigate(["/home/"+this.dataArr[i].link]);    
  }
}