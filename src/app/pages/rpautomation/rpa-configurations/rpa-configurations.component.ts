import { Component, OnInit } from '@angular/core';
import { DataTransferService} from "../../services/data-transfer.service";
import {MatTabChangeEvent, VERSION} from '@angular/material';

@Component({
  selector: 'app-rpa-configurations',
  templateUrl: './rpa-configurations.component.html',
  styleUrls: ['./rpa-configurations.component.css']
})
export class RpaConfigurationsComponent implements OnInit {
  
  constructor(private dt:DataTransferService,) { }

  ngOnInit() {
    
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
      this.dt.changeChildModule({"route":"/pages/rpautomation/environments","title":"Configuration"});
    }
  }

