import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from "../services/data-transfer.service";
@Component({
  selector: 'app-rpautomation',
  templateUrl: './rpautomation.component.html',
  styleUrls: ['./rpautomation.component.css']
})
export class RpautomationComponent implements OnInit {

  constructor(private router: Router, private dt:DataTransferService) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA"});
    this.dt.changeChildModule("");
  }

}
