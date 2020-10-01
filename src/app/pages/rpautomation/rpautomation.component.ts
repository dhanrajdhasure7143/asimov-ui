import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from "../services/data-transfer.service";
//import {RpaStudioComponent} from "./rpa-studio/rpa-studio.component" 
@Component({
  selector: 'app-rpautomation',
  templateUrl: './rpautomation.component.html',
  styleUrls: ['./rpautomation.component.css']
})
export class RpautomationComponent implements OnInit {

  constructor(private router: Router, private dt:DataTransferService) { }
    public child_link:any;
  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
    this.dt.current_child_module.subscribe(res => this.child_link = res);

  }
  removenodes()
  { 
    
  }

}
