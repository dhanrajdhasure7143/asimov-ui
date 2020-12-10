import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import {ActivatedRoute} from "@angular/router";
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-orchestration',
  templateUrl: './orchestration.component.html',
  styleUrls: ['./orchestration.component.css']
})
export class OrchestrationComponent implements OnInit {

  constructor(private dt:DataTransferService, private route:ActivatedRoute, private spinner:NgxSpinnerService) { }
  public selectedTab=0;
  public check_tab=0;
  public param:any=0;
  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/serviceOrchestration/home", "title":"Service Orchestration"});
    this.dt.changeChildModule(undefined);
    let processId;

    this.route.queryParams.subscribe(params => {
        processId=params;
      if(this.isEmpty(processId))
      {
        this.selectedTab=0;
        this.param=0;
        this.check_tab=0
      }
      else
      {
        this.selectedTab=1;
        this.param=processId.processid;
        this.check_tab=1;
        console.log(this.param)
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
  onTabChanged(event)
  {
    console.log(event)
    this.check_tab=event.index;
    console.log(this.selectedTab);
  }


}
