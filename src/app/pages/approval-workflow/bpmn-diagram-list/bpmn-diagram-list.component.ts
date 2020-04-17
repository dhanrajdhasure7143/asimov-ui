import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { DiagListData } from './model/bpmn-diag-list-data';
import { BpmnDiagramComponent } from 'src/app/shared/bpmn-diagram/bpmn-diagram.component';

@Component({
  selector: 'app-bpmn-diagram-list',
  templateUrl: './bpmn-diagram-list.component.html',
  styleUrls: ['./bpmn-diagram-list.component.css'],
  providers: [DiagListData]
})
export class BpmnDiagramListComponent implements OnInit {
  @ViewChild(BpmnDiagramComponent, {static:false}) diagramComp: BpmnDiagramComponent;
  approve_bpmn_list = this.model.diagList;
  constructor(private dt:DataTransferService, private model:DiagListData) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/approvalWorkflow/home", "title":"Approval Workflow"});
    this.dt.changeChildModule(undefined);
  }

  getDiagram(i, bpmnXmlNotation){
    this.diagramComp.initializeDiag('diagram_container'+i, bpmnXmlNotation);
  }

  loopTrackBy(index, term){
    return index;
  }

  approveDenyDiagram(isApproved){
    //API call
  }

}
