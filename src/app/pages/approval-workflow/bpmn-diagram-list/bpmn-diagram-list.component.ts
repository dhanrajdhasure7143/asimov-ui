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
  isHidden:boolean=false;
  approvalstatus: any='REJECTED';
  rejectedby: any='mouni';
  remarks: any='ignore';
  approve_hide: boolean=false;
  selectedrow: any;
  orderAsc:boolean = true;
  sortIndex:number=1;
  saved_diagrams: any;
  constructor(private dt: DataTransferService,private hints:ApprovalHomeHints,private bpmnservice:SharebpmndiagramService, private model: DiagListData, private rest_Api: RestApiService,private router: Router) { }

  ngOnInit() {
    this.isLoading= true;
    this.dt.changeParentModule({ "route": "/pages/approvalWorkflow/home", "title": "Approval Workflow" });
    this.dt.changeChildModule(undefined);
     this.bpmnlist();
     this.dt.changeHints(this.hints.bpsApprovalHomeHints);
  }
  getColor(status) {
    //console.log(status) 
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

  expandPanel(event,i,bpmnXmlNotation): void {
   // event.stopPropagation(); 
   this.index=i;
  //  this.griddata.map(item => {item.isHidden = false;return item;})
  //  this.griddata.map(item=>{item.approve_hide=false;return item;})
  // if(this.griddata[i].approvalStatus=='APPROVED' || this.griddata[i].approvalStatus=='REJECTED'){
  //   this.griddata[i].bpmnProcessInfo.isHidden=true;
  //   this.griddata[i].approve_hide=true;
  // }
  // else{
  //   this.griddata[i].bpmnProcessInfo.isHidden=true;
  // }


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
  // getDiagram(i, bpmnXmlNotation){
  //   this.diagramComp.initializeDiag('diagram_container'+i, bpmnXmlNotation);
  //   if (this.expanded) {
  //    this.diagramComp.initializeDiag('diagram_container' + i, bpmnXmlNotation);
  //     this._matExpansionPanel.open(); // Here's the magic
  //     this.expanded = false;
  //   }else{
  //     this._matExpansionPanel.close()
  //   }
  // }
  openDiagram(binaryXMLContent, i){
  this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
  this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { bpsId: i }});
  }
  inputMessage(e,i){
    if(e.target.value == ''){
      this.griddata[i].bpmnProcessInfo.isHidden=true;
    }
    else {
      this.griddata[i].bpmnProcessInfo.isHidden=false;
    }
   
  }

  // getDiagram(i, bpmnXmlNotation) {
  //   console.log(this.diagramComp);
  //   this.diagramComp.initializeDiag('diagram_container' + i, bpmnXmlNotation);
  // }

  loopTrackBy(index, term) {
    return index;
  }
  clicked(i){
this.selectedrow =i;
  }
   bpmnlist() {
    
     this.rest_Api.bpmnlist(this.user).subscribe(data => {
      this.isLoading = false;
      this.griddata = data; 
      this.griddata.map(item => {item.role = 'BPMN_Process_Modeler';return item})
      this.griddata.map(item => {item.xpandStatus = false;return item;})
      this.griddata.map(item => {item.isHidden = false;return item;})
      this.griddata.map(item=>{item.approve_hide=false;return item;})

      for(let i=0;i<=this.griddata.length;i++){
        if(this.griddata[i].approvalStatus=='APPROVED' || this.griddata[i].approvalStatus=='REJECTED'){
          this.griddata[i].bpmnProcessInfo.isHidden=true;
          this.griddata[i].approve_hide=true;
        }
        else{
          this.griddata[i].bpmnProcessInfo.isHidden=true;
        }
      }
    
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
     this.rest_Api.approve_producemessage(data.bpmnProcessInfo).subscribe(data => console.log(data));
   }
   approve_savedb(data) {
     this.rest_Api.approve_savedb(data).subscribe(data => console.log(data));
   }
   denyDiagram(data, i) {
    this.approver_info = { "approvalStatus":this.approvalstatus,"rejectedBy":this.rejectedby,"remarks": this.remarks,"message": this.message[i], "bpmnModelId":data.bpmnProcessInfo.bpmnModelId,"userName":data.bpmnProcessInfo.userName,"emailTo":data.bpmnProcessInfo.emailTo,"bpmnProcessName":data.bpmnProcessInfo.bpmnProcessName};
    this.rest_Api.denyDiagram(this.approver_info).subscribe(data => console.log(data));
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
      


      // if (asc) 
      //  return (a.bpmnProcessInfo[colKey] > b.bpmnProcessInfo[colKey]) ? 1 : -1;
      // else 
      //  return (a[colKey] < b[colKey]) ? 1 : -1;
    });
  }
}

