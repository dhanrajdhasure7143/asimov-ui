import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { DiagListData } from './model/bpmn-diag-list-data';
import { BpmnDiagramComponent } from 'src/app/shared/bpmn-diagram/bpmn-diagram.component';
import { RestApiService } from '../../services/rest-api.service';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { Router } from '@angular/router';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { ApprovalHomeHints } from './model/bpmn_approval_workflow';

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
  user: any = 'Sowmya Peddeti';
  message: any[] = [];
  griddata: any;
  approver_info: any;
  //role: any = 'BPMN_Process_Modeler';
  expanded: any=true;
  bpmnModeler: any;
  xpandStatus=false;
  index: any;
  searchTerm;
  isLoading:boolean = true;
  approvalstatus: any='REJECTED';
  rejectedby: any='mouni';
  remarks: any='ignore';
  selectedrow: any;
  orderAsc:boolean = true;
  sortIndex:number=2;
  approval_msg: string="";
  constructor(private dt: DataTransferService,private hints:ApprovalHomeHints,private bpmnservice:SharebpmndiagramService, private model: DiagListData, private rest_Api: RestApiService,private router: Router) { }

  ngOnInit() {
    this.isLoading= true;
    this.dt.changeParentModule({ "route": "/pages/approvalWorkflow/home", "title": "Approval Workflow" });
    this.dt.changeChildModule(undefined);
     this.bpmnlist();
     this.dt.changeHints(this.hints.bpsApprovalHomeHints);
  }
  getColor(status) { 
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'DENIED':
        return 'red';
      case 'APPROVED':
        return 'green';
      case 'INPROGRESS':
        return 'orange';
    }
  }
  collapseExpansion(){
    this.approval_msg="";
  }
  expandPanel(event,i,bpmnXmlNotation): void {
   this.index=i;
   this.approval_msg=this.griddata[i].bpmnProcessInfo.reviewComments;
   if(document.getElementsByClassName('diagram_container'+i)[0].innerHTML.trim() != "") return;
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
  openDiagram(binaryXMLContent, i){
  this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
  this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { bpsId: i }});
  }
  checkStatus(app_status){
    return (app_status.toLowerCase()=='approved' || app_status.toLowerCase()=='rejected');
  }
  loopTrackBy(index, term) {
    return index;
  }
  clicked(i){
this.selectedrow =i;
  }
  downloadBpmn(){
    if(this.bpmnModeler){
      let _self = this;
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        _self.griddata[_self.index].bpmnProcessInfo['bpmnXmlNotation'] = btoa(unescape(encodeURIComponent(xml)));
        var blob = new Blob([xml], { type: "application/xml" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let fileName = _self.griddata[_self.index].bpmnProcessInfo['bpmnProcessName'];
        if(fileName.trim().length == 0 ) fileName = "newDiagram";
        link.download = fileName+".bpmn";
        link.innerHTML = "Click here to download the diagram file";
        link.click();
      });
    }
  }
   bpmnlist() {
     this.rest_Api.bpmnlist(this.user).subscribe(data => {
      this.isLoading = false;
      data[0].approvalStatus='APPROVED';
      data[1].approvalStatus='REJECTED';
      this.griddata = data; 
     });
   }
   @HostListener('document:click',['$event'])
   clickout(event) {
     if(!document.getElementById("bpmn_list").contains(event.target) && this.index>=0)
       this.griddata[this.index].xpandStatus=false;
   }
 
   approveDiagram(data) {
     this.approve_producemessage(data);
    // this.approve_savedb(data);
   }
   approve_producemessage(data) {
     this.rest_Api.approve_producemessage(data).subscribe(data => console.log(data));
   }
   approve_savedb(data) {
     this.rest_Api.approve_savedb(data).subscribe(data => console.log(data));
   }
   denyDiagram(data) {
     let approver_info=data;
     approver_info['message']=this.approval_msg;
    this.rest_Api.denyDiagram(approver_info).subscribe(data => console.log(data));
   }
   sort(colKey,ind) { // if not asc, desc
    this.sortIndex=ind
    let asc=this.orderAsc
    this.orderAsc=!this.orderAsc
    this.griddata= this.griddata.sort(function(a,b){
      if(asc){
        if(ind!=5){
          return (a.bpmnProcessInfo[colKey] > b.bpmnProcessInfo[colKey]) ? 1 : -1;
        }
        else{
          return (a[colKey] > b[colKey]) ? 1 : -1;
        }
      }
      else{
        if(ind!=5){
          return (a.bpmnProcessInfo[colKey] < b.bpmnProcessInfo[colKey]) ? 1 : -1;
        }
        else{
          return (a[colKey] < b[colKey]) ? 1 : -1;
        }
      }
    });
  }
}

