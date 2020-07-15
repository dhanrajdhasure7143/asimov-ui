import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { DiagListData } from './model/bpmn-diag-list-data';
import { BpmnDiagramComponent } from 'src/app/shared/bpmn-diagram/bpmn-diagram.component';
import { RestApiService } from '../../services/rest-api.service';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { Router } from '@angular/router';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { ApprovalHomeHints } from './model/bpmn_approval_workflow';
import { GlobalScript } from 'src/app/shared/global-script';

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
  //approvalstatus: any='REJECTED';
  rejectedby: any='Sowmya Peddeti';
  remarks: any='ignore';
  selectedrow: any;
  orderAsc:boolean = true;
  sortIndex:number=2;
  approval_msg: string="";
  constructor(private dt: DataTransferService,private hints:ApprovalHomeHints,private bpmnservice:SharebpmndiagramService,private global:GlobalScript, private model: DiagListData, private rest_Api: RestApiService,private router: Router) { }

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
      case 'REJECTED':
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
  openDiagram(binaryXMLContent, bpmnModelId){
  this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
  this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { bpsId: bpmnModelId }});
  }
  checkStatus(app_status){
    return app_status && (app_status.toLowerCase()=='approved' || app_status.toLowerCase()=='rejected');
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
      this.griddata = data;
      this.griddata.map(item => {item.xpandStatus = false;return item;}) 
     });
   }
   @HostListener('document:click',['$event'])
   clickout(event) {
     if(!document.getElementById("bpmn_list").contains(event.target) && this.index>=0)
       this.griddata[this.index].xpandStatus=false;
   }

   
   approveDiagram(data) {
     let disabled_items = localStorage.getItem("pending_bpmnId")
   if(disabled_items) {
     localStorage.setItem("pending_bpmnId", disabled_items+ ","+data.bpmnProcessInfo.bpmnModelId)
   }
   else{
    localStorage.setItem("pending_bpmnId", data.bpmnProcessInfo.bpmnModelId)
   }
   this.disable_panels();
     this.approver_info={
        "approverName": this.user,
        "bpmnJsonNotation": data.bpmnProcessInfo.bpmnJsonNotation,
        "bpmnModelId": data.bpmnProcessInfo.bpmnModelId,
        "bpmnNotationAutomationTask": data.bpmnProcessInfo.bpmnNotationAutomationTask,
        "bpmnNotationHumanTask": data.bpmnProcessInfo.bpmnNotationHumanTask,
        "bpmnProcessApproved": data.bpmnProcessInfo.bpmnProcessApproved,
        "bpmnProcessName": data.bpmnProcessInfo.bpmnProcessName, 
        "bpmnProcessStatus": "APPROVED",
        "bpmnTempId": data.bpmnProcessInfo.bpmnTempId,
        "bpmnXmlNotation": data.bpmnProcessInfo.bpmnXmlNotation,
        "category": data.bpmnProcessInfo.category, 
        "emailTo": data.bpmnProcessInfo.emailTo,
        "processIntelligenceId": data.bpmnProcessInfo.processIntelligenceId, 
        "reviewComments":this.approval_msg,
        "tenantId": data.bpmnProcessInfo.tenantId,
        "userName": data.bpmnProcessInfo.userName,
        }; 
  delete(data.xpandStatus);
   this.rest_Api.approve_producemessage(this.approver_info).subscribe(
      data =>{ 
        let message = "Diagram approved successfully"; //this has to change after approval API 
        this.bpmnlist();
         this.global.notify(message,'success'); 
        },
         err=>{
            let message = "Oops! Something went wrong";
             this.global.notify(message,'error'); 
            }); 
          }

disable_panels(){
let panels = localStorage.getItem("pending_bpmnId");
let panel_array = [];
if(panels)
panel_array = panels.split(",");
this.griddata.forEach(each_bpmn => {
  let ind = panel_array.indexOf(each_bpmn.bpmnProcessInfo.bpmnModelId)
  if(ind > -1){
    each_bpmn.isDisabled = true;
  }
});
          }

   denyDiagram(data) {
     data.bpmnProcessInfo.reviewComments= this.approval_msg;
     data.remarks = this.approval_msg;
     data.approvalStatus='REJECTED';
     data.rejectedBy=this.rejectedby;
     data.bpmnProcessInfo.bpmnProcessStatus='REJECTED';
     delete(data.xpandStatus);
    this.rest_Api.denyDiagram(data).subscribe(
      data => {
        let message =  "Diagram has been rejected.";
        this.bpmnlist();
        this.global.notify(message,'success');
      },
      err=>{
        let message = "Oops! Something went wrong";
        this.global.notify(message,'error');
      });
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

