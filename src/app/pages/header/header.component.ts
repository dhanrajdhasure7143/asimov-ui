import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DataTransferService } from '../services/data-transfer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedIndex: number;
  parent_link:any={};
  child_link:any={};
  pages:any[];

  constructor(private router:Router, private dataTransfer:DataTransferService) { }

  ngOnInit() {
    this.dataTransfer.current_parent_module.subscribe(res => this.parent_link = res);
    this.dataTransfer.current_child_module.subscribe(res => this.child_link = res);
    this.pages = [ 
      {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},
      {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
      {"img":"assets/images/robothand.svg", "title":"RPA  Studio", "link":"/pages/"},
      {"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"}
    ];
  }
  myFunction() {                    
    document.getElementById("myDropdown").classList.toggle("show");
  } 
 
}
