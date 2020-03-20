import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-orchestration',
  templateUrl: './orchestration.component.html',
  styleUrls: ['./orchestration.component.css']
})
export class OrchestrationComponent implements OnInit {

  constructor(private dt:DataTransferService) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/serviceOrchestration/home", "title":"Service Orchestration"});
    this.dt.changeChildModule(undefined);
  }

}
