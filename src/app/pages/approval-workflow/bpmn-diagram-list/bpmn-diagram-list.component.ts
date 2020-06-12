import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { DiagListData } from './model/bpmn-diag-list-data';
import { BpmnDiagramComponent } from 'src/app/shared/bpmn-diagram/bpmn-diagram.component';
import { RestApiService } from '../../services/rest-api.service';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
@Component({
  selector: 'app-bpmn-diagram-list',
  templateUrl: './bpmn-diagram-list.component.html',
  styleUrls: ['./bpmn-diagram-list.component.css'],
  providers: [DiagListData]
})
export class BpmnDiagramListComponent implements OnInit {
  @ViewChild('matExpansionPanel', { static: false }) _matExpansionPanel:any
  @ViewChild(BpmnDiagramComponent, { static: false }) diagramComp: BpmnDiagramComponent;
  approve_bpmn_list = this.model.diagList;
  user: any = 'gopi';
  message: any[] = [];
  griddata: any;
  approver_info: any;
  role: any = 'BPMN_Process_Modeler';
  expanded: any=true;
  bpmnModeler: any;
  constructor(private dt: DataTransferService, private model: DiagListData, private rest_Api: RestApiService) { }

  ngOnInit() {
    this.dt.changeParentModule({ "route": "/pages/approvalWorkflow/home", "title": "Approval Workflow" });
    this.dt.changeChildModule(undefined);
     this.bpmnlist();
  }
  expandPanel(event,i,bpmnXmlNotation): void {
    event.stopPropagation(); 
    this.bpmnModeler = new BpmnJS({
      container: '.diagram_container'+i,
      keyboard: {
        bindTo: window
      }
    });
    this.bpmnModeler.clear();
    this.bpmnModeler.importXML(atob(bpmnXmlNotation), function(err){
      if(err){
        this.notifier.show({
          type: "error",
          message: "Could not import Bpmn diagram!",
          id: "ae12" 
        });
      }
    })
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
  }
  getDiagram(i, bpmnXmlNotation){
    this.diagramComp.initializeDiag('diagram_container'+i, bpmnXmlNotation);
    if (this.expanded) {
     this.diagramComp.initializeDiag('diagram_container' + i, bpmnXmlNotation);
      this._matExpansionPanel.open(); // Here's the magic
      this.expanded = false;
    }else{
      this._matExpansionPanel.close()
    }
  }

  // getDiagram(i, bpmnXmlNotation) {
  //   console.log(this.diagramComp);
  //   this.diagramComp.initializeDiag('diagram_container' + i, bpmnXmlNotation);
  // }

  loopTrackBy(index, term) {
    return index;
  }
   bpmnlist() {
     this.rest_Api.bpmnlist(this.user).subscribe(data => this.griddata = data);
   }
   approveDiagram(data) {
     this.approve_producemessage(data);
     this.approve_savedb(data);
   }
   approve_producemessage(data) {
     this.rest_Api.approve_producemessage(data.bpmnProcessInfo).subscribe(data => console.log(data));
   }
   approve_savedb(data) {
     this.rest_Api.approve_savedb(data).subscribe(data => console.log(data));
   }
   denyDiagram(data, i) {
     this.approver_info = { "message": this.message[i], "remarks": data.remarks, "rejectedTimestamp": data.rejectedTimestamp, "approvedBy": data.approvedBy, "approvedAt": data.approvedAt, "role": this.role };
     this.rest_Api.denyDiagram(this.approver_info).subscribe(data => console.log(data));
   }

}

