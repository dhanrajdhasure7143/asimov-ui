import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { DiagListData } from './model/bpmn-diag-list-data';
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
  providers: [DiagListData],
})
export class BpmnDiagramListComponent implements OnInit {
  @ViewChild('matExpansionPanel', { static: false }) _matExpansionPanel:any
  approve_bpmn_list = this.model.diagList;
  message: any[] = [];
  griddata: any;
  approver_info: any;
  p:number = 1;
  expanded: any=true;
  bpmnModeler: any;
  xpandStatus=false;
  index: any;
  searchTerm;
  isLoading:boolean = true;
  remarks: any='ignore';
  selectedrow: any;
  orderAsc:boolean = true;
  sortIndex:number=2;
  approval_msg: string="";
  selected_processInfo;
  pendingStatus="PENDING APPROVAL"
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
  expandPanel(i, bpmnProcessInfo): void {
    this.selected_processInfo = bpmnProcessInfo;
    let bpmnXmlNotation = this.selected_processInfo["bpmnXmlNotation"];
    let approval_msg = this.selected_processInfo["reviewComments"];
    this.index=i;
    this.approval_msg=approval_msg;
    // if(!this.bpmnModeler){
    if(document.getElementsByClassName('diagram_container'+i)[0].innerHTML.trim() == ""){
      this.bpmnModeler = new BpmnJS({
        container: '.diagram_container'+i,
        keyboard: {
          bindTo: window
        }
      });
    }
    this.bpmnModeler.importXML(atob(bpmnXmlNotation), function(err){
      if(err){
        this.notifier.show({
          type: "error",
          message: "Could not import Bpmn notation!"
        });
      }
    })
    // let canvas = this.bpmnModeler.get('canvas');
    // canvas.zoom('fit-viewport');
  }
  openDiagram(){
    let binaryXMLContent = this.selected_processInfo["bpmnXmlNotation"];
    let bpmnModelId = this.selected_processInfo["bpmnModelId"];
    let bpmnProcessStatus = this.selected_processInfo["bpmnProcessStatus"];
    if(binaryXMLContent && bpmnModelId && bpmnProcessStatus != "PENDING"){
      let bpmnVersion = this.selected_processInfo["version"];
      this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
      this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { bpsId: bpmnModelId, ver: bpmnVersion }});
    }
  }
  fitNotationView(){
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
  }

  formatApproverName(apprName){
    if(apprName){
      let appr_arr = apprName.split('.');
      let fName = appr_arr[0];
      let lName = appr_arr[1];
      if(fName)
        fName = fName.charAt(0).toUpperCase()+fName.substr(1);
      if(lName)
        lName = lName.charAt(0).toUpperCase()+lName.substr(1);
      return fName&&lName?fName+" "+lName:fName?fName:lName?lName:'-';
    }else{
      return '-';
    }
   }
  checkStatus(diagram){
    let app_status = diagram.bpmnProcessStatus;
    let check_exp = app_status && app_status.toLowerCase()=='approved' || app_status.toLowerCase()=='rejected';
    if(check_exp)
      this.enablePanels(diagram.id)
    return check_exp;
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
        link.innerHTML = "Click here to download the notation";
        link.click();
      });
    }
  }
   bpmnlist() {
     this.rest_Api.bpmnlist().subscribe(data => {
      this.isLoading = false;
      this.griddata = data;
      this.griddata.map(item => {item.xpandStatus = false;return item;}) 
      this.disable_panels();
     });
   }
   @HostListener('document:click',['$event'])
   clickout(event) {
     if(!document.getElementById("bpmn_list").contains(event.target) && this.index>=0)
       this.griddata[this.index].xpandStatus=false;
   }

   
  approveDiagram(data) {
    let disabled_items = localStorage.getItem("pending_bpmnId")
    let saved_id = disabled_items && disabled_items !="null" && disabled_items != "" ? disabled_items+ ","+data.id: data.id;
    localStorage.setItem("pending_bpmnId", saved_id)
    this.disable_panels();
    this.approver_info={
      "approverName": data.approverName,
      // "bpmnJsonNotation": data.bpmnJsonNotation,
      "bpmnModelId": data.bpmnModelId,
      "bpmnProcessApproved": data.bpmnProcessApproved,
      "bpmnProcessName": data.bpmnProcessName, 
      "bpmnProcessStatus": "APPROVED",
      "bpmnXmlNotation": data.bpmnXmlNotation,
      "category": data.category, 
      "createdTimestamp": data.createdTimestamp,
      "approverEmail": data.approverEmail,
      "userEmail": data.userEmail,
      "id": data.id,
      "modifiedTimestamp": new Date(),
      "processIntelligenceId": data.processIntelligenceId, 
      "reviewComments":data.reviewComments,
      "tenantId": data.tenantId,
      "userName": data.userName,
      "version": data.version
    }; 
    this.rest_Api.approve_producemessage(this.approver_info).subscribe(
      data =>{ 
        let message = "Notation submitted for approval"; //this has to change after approval API
        this.bpmnlist();
        this.global.notify(message,'success'); 
      },
      err=>{
        let message = "Oops! Something went wrong";
        this.global.notify(message,'error'); 
    });
    this.bpmnlist(); 
  }

  disable_panels(){
    let panels = localStorage.getItem("pending_bpmnId");
    let panel_array = [];
    if(panels && panels != "null" && panels != "")
      panel_array = panels.split(",");
    if(panel_array.length > 0){
      this.griddata.forEach(each_bpmn => {
        each_bpmn.bpmnProcessInfo.forEach(each_child_bpmn => {
          if(panel_array.indexOf(each_child_bpmn.id.toString()) > -1){
            each_child_bpmn.isDisabled = true;
          } 
          // else {
          //   each_bpmn.isDisabled = false;
          // }
        })
      });
    }
  }

  enablePanels(bpmnID){
    let panels = localStorage.getItem("pending_bpmnId");
    let panel_array = [];
    if(panels && panels != "null" && panels != "")
      panel_array = panels.split(",");
      let search_ind = panel_array.indexOf(bpmnID);
    if(panel_array.length != 0 && search_ind != -1)
      panel_array.splice(panel_array.indexOf(bpmnID), 1);
    localStorage.setItem('pending_bpmnId', panel_array.join())
  }

   denyDiagram(data, parentInfo) {
     let reqObj = { 
      "bpmnApprovalId": parentInfo.bpmnApprovalId,
      "bpmnProcessInfo": {
        "createdTimestamp": data.createdTimestamp,
        "modifiedTimestamp": new Date(),
        "version": data.version,
        "approverEmail": data.approverEmail,
        "userEmail": data.userEmail,
        "id": data.id,
        "bpmnModelId": data.bpmnModelId,
        "bpmnProcessName": data.bpmnProcessName,
        "tenantId": data.tenantId,
        "reviewComments": data.reviewComments,
        "bpmnProcessStatus": "REJECTED",
        "bpmnProcessApproved": data.bpmnProcessApproved,
        "userName": data.userName,
        "bpmnXmlNotation":data.bpmnXmlNotation,
        "approverName": data.approverName,
        // "bpmnJsonNotation":data.bpmnJsonNotation,
        "processIntelligenceId": data.processIntelligenceId,
        "category": data.category
      },
      "approvalStatus": "REJECTED",
      "rejectedBy": data.approverName, 
      "approvedBy":  data.approverName,
      "role": parentInfo.role, 
      "remarks":data.reviewComments
    }
    this.rest_Api.denyDiagram(reqObj).subscribe(
      data => {
        let message =  "Notation has been rejected.";
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

