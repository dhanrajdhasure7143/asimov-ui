import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { DiagListData } from './model/bpmn-diag-list-data';
import { RestApiService } from '../../services/rest-api.service';
import * as BpmnJS from './../../../bpmn-modeler.development.js';
import { Router } from '@angular/router';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { ApprovalHomeHints } from './model/bpmn_approval_workflow';
import { GlobalScript } from 'src/app/shared/global-script';
import * as CmmnJS from 'cmmn-js/dist/cmmn-modeler.production.min.js';
import * as DmnJS from 'dmn-js/dist/dmn-modeler.development.js';
import { MatPaginator, PageEvent } from '@angular/material';
import { fromMatPaginator, paginateRows } from './../../business-process/model/datasource-utils';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

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
  griddata: any[]=[];
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
  pendingStatus="PENDING APPROVAL";
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  constructor(private dt: DataTransferService,private hints:ApprovalHomeHints,private bpmnservice:SharebpmndiagramService,private global:GlobalScript, private model: DiagListData, private rest_Api: RestApiService,private router: Router) { }

  ngOnInit() {
    this.isLoading= true;
    localStorage.setItem("isheader","false")
    this.dt.changeParentModule({ "route": "/pages/approvalWorkflow/home", "title": "Approval Workflow" });
    this.dt.changeChildModule(undefined);
    this.bpmnlist();
    // this.dt.changeHints(this.hints.bpsApprovalHomeHints);
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
  expandPanel(i, eachBPMN): void {
    this.selected_processInfo = eachBPMN;
    let bpmnXmlNotation = this.selected_processInfo["bpmnXmlNotation"];
    let approval_msg = this.selected_processInfo["reviewComments"];
    this.index=i;
    this.approval_msg=approval_msg;
    let byteBpmn = atob(eachBPMN.bpmnXmlNotation);
    if(document.getElementsByClassName('diagram_container'+i)[0].innerHTML.trim() != "") return;
    let notationJson = {
      container: '.diagram_container'+i,
      keyboard: {
        bindTo: window
      }
    }
    if(eachBPMN.ntype == "bpmn")
      this.bpmnModeler = new BpmnJS(notationJson);
    else if(eachBPMN.ntype == "cmmn")
      this.bpmnModeler = new CmmnJS(notationJson);
    else if(eachBPMN.ntype == "dmn")
      this.bpmnModeler = new DmnJS(notationJson); 
      
        this.bpmnModeler.importXML(byteBpmn, function(err){
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
    let bpmnType = this.selected_processInfo["ntype"];
    let bpmnProcessStatus = this.selected_processInfo["bpmnProcessStatus"];
    let bpmnProcessName = this.selected_processInfo["bpmnProcessName"];
    let bpmnProcessTime = this.selected_processInfo["modifiedTimestamp"]
    if(binaryXMLContent && bpmnModelId){
      // && bpmnProcessStatus != "PENDING"
      let bpmnVersion = this.selected_processInfo["version"];
      let fromApprover=true;
      this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
      let push_Obj={"rejectedOrApproved":bpmnProcessStatus,"isfromApprover":fromApprover,
                    "isShowConformance":false,"isStartProcessBtn":false,"autosaveTime":bpmnProcessTime,
                    "isFromcreateScreen":false,'process_name':bpmnProcessName}
        this.dt.bpsNotationaScreenValues(push_Obj);
      this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { bpsId: bpmnModelId, ver: bpmnVersion, isfromApprover: fromApprover, ntype:bpmnType }});
    }
  }
  fitNotationView(){
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
    let msg="Notation";
    this.global.notify(msg+" is fit to view port", "success")
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
        let fileName = _self.griddata[_self.index].bpmnProcessInfo[0]['bpmnProcessName'];
        if(fileName.trim().length == 0 ) fileName = "newDiagram";
        link.download = fileName+"."+_self.selected_processInfo.ntype;
        link.innerHTML = "Click here to download the notation";
        link.click();
      });
    }
  }
   bpmnlist() {
     this.rest_Api.bpmnlist().subscribe(data => {
      this.isLoading = false;
      this.griddata = data;
      this.assignPagenation(this.griddata);
      this.griddata.map(item => {item.xpandStatus = false;return item;})
      this.disable_panels();
     
     if(this.griddata.length==0){
      let touiGuide_ids=[{selector:'#bpmn_list', description:'List of saved BPMN/CMMN/DMN notations'}]
     this.dt.changeHints(touiGuide_ids);
    }else{
     let touiGuide_ids=[
       { selector:'#bpmn_list', description:'List of saved BPMN/CMMN/DMN notations', showNext:true },
       { selector:'#bpmn_list_item1', event:'click', description:'Click on each record to display it as diagram' },
       { selector:'.diagram_container1', description:'BPMN Diagram of the clicked record' }
     ]
     this.dt.changeHints(touiGuide_ids);
    }
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
      //"createdTimestamp": data.createdTimestamp,
      "approverEmail": data.approverEmail,
      "userEmail": data.userEmail,
      "id": data.id,
      "processIntelligenceId": data.processIntelligenceId,
      "reviewComments":data.reviewComments,
      "tenantId": data.tenantId,
      "userName": data.userName,
      "version": data.version,
      "ntype": data.ntype
    };
    this.rest_Api.approve_producemessage(this.approver_info).subscribe(
      data =>{
        let message = "Notation Successfully Approved"; //this has to change after approval API
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
       // "createdTimestamp": data.createdTimestamp,
       // "modifiedTimestamp": new Date(),
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
        "ntype": data.ntype,
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

  gotoBPMNPlatform() {
    var token = localStorage.getItem('accessToken');
    let selecetedTenant =  localStorage.getItem("tenantName");
    let userId = localStorage.getItem("ProfileuserId");
    let splitTenant:any;
    if(selecetedTenant){
       splitTenant = selecetedTenant.split('-')[0];
    }
    window.location.href = "http://10.11.0.127:8080/camunda/app/welcome/"+splitTenant+"/#!/login?accessToken=" + token + "&userID="+userId+"&tenentID="+selecetedTenant;
  }
  
  assignPagenation(data){
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(paginateRows(pageEvents$));
  }
  
  searchList(event: Event) {       // search entered process ids from search input
    const filterValue = (event.target as HTMLInputElement).value;
    let listArray:any=[];
    if(!filterValue){
      this.assignPagenation(this.griddata);
      return;
    }
    this.griddata.filter(item =>{
      item['bpmnProcessInfo'].filter(x=>{
        Object.keys(x).some(k =>{ 
          if(x != null && x[k].toString().toLowerCase().includes(filterValue.toLowerCase()) && !x['bpmnXmlNotation'].toString().toLowerCase().includes(filterValue.toLowerCase())){
            listArray.push(item);
          }
        })
      })
      
      });

    var filtered = listArray.reduce((filtered, item) => {
      if( !filtered.some(filteredItem => JSON.stringify(filteredItem.bpmnModelId) == JSON.stringify(item.bpmnModelId)) )
        filtered.push(item)
      return filtered
    }, [])
    this.assignPagenation(filtered);
  }
}

