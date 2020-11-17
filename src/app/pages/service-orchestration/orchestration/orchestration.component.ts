import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-orchestration',
  templateUrl: './orchestration.component.html',
  styleUrls: ['./orchestration.component.css']
})
export class OrchestrationComponent implements OnInit {

  constructor(private dt:DataTransferService, private route:ActivatedRoute) { }
  public selectedTab=0;
  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/serviceOrchestration/home", "title":"Service Orchestration"});
    this.dt.changeChildModule(undefined);
    let processId;
    this.route.queryParams.subscribe(params => {
        processId=params;
      if(this.isEmpty(processId))
      {
        this.selectedTab=0;
      }
      else
      {
        this.selectedTab=1;

      }
    });
  }




  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }


}
