import { Component, OnInit ,AfterViewInit, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { diff } from 'bpmn-js-differ';
import { NgxSpinnerService } from "ngx-spinner"; 

import BpmnModdle from 'bpmn-moddle';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import Swal from 'sweetalert2';
import { GlobalScript } from 'src/app/shared/global-script';

@Component({
  selector: 'app-upload-process-model',
  templateUrl: './upload-process-model.component.html',
  styleUrls: ['./upload-process-model.component.css']
})
export class UploadProcessModelComponent implements OnInit {
  isShowConformance:boolean = false;
   hideUploadContainer:boolean=false;
   hideCreateContainer:boolean=false;
   hideOptionsContainer:boolean=true;
   bpmnModeler;
   viewer:any;
   confBpmnModeler;
   reSize:boolean=false;
   confBpmnXml;
   receivedbpmn:any;
   createDiagram:boolean = false;
   isHiddenDiff:boolean=true;
   displayChanges:boolean=false;
  res1: string;
  oldxmlstring: string;
  newxmlsttring: string;
  //bpmnupload:boolean=false;
  //hideEditor:boolean=false;
  split: SplitComponent;
  area1: SplitAreaDirective;
  area2: SplitAreaDirective;
  last_updated_time = new Date().getTime();
  bpmnModel:BpmnModel = new BpmnModel();
  uploaded_xml:any;
  counter:number = 0;
  autosaveObj:any;
  isConfNavigation:boolean=false;
  saved_bpmn_list:any[] = [];
  approver_list:any[] = [];
  selected_notation;
  diplayApproveBtn:boolean = false;
  isDiagramChanged:boolean = false;
  notationListOldValue = undefined;
  notationListNewValue = undefined;
  randomId;
  oldXml;
  newXml;
  bpmnfile: any;

   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, private spinner:NgxSpinnerService,
      private dt:DataTransferService, private route:ActivatedRoute, private global:GlobalScript) { }
 
   ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});
    this.bpmnservice.isConfNav.subscribe(res => this.isConfNavigation = res);
    this.route.queryParams.subscribe(params => {
      this.selected_notation = parseInt(params['bpsId']) || undefined;
      this.isShowConformance = params['isShowConformance'] == 'true';
    });
    this.randomId = Math.floor(Math.random()*999999);  //Values get repeated
    this.bpmnModel.bpmnProcessName=this.bpmnservice.newDiagName.value;
    this.bpmnModel.reviewComments="";
    this.bpmnModel.approverName="vaidehi";
    this.bpmnModel.bpmnModelId=this.randomId;
    this.bpmnModel.userName="gopi";
    this.bpmnModel.category=this.bpmnservice.bpmnCategory.value;
    this.bpmnfile=this.bpmnservice.bpmnData.value;
    this.bpmnModel.bpmnModelModifiedBy = "Vaidehi";//localStorage.getItem("userName")
    this.bpmnModel.bpmnModelTempStatus = "initial";
    this.rest.getBPMNFileContent("assets/resources/"+this.bpmnfile).subscribe(res => {
      this.newXml=res;
      this.bpmnModel.bpmnXmlNotation=btoa(this.newXml);
      this.rest.saveBPMNprocessinfofromtemp(this.bpmnModel).subscribe(res=>console.log(res));
    });
     // this.randomId = UUID.UUID(); // Backend BPMN Model Id should be string
  
    this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_bpmn_list = res; 
      this.initiateDiagram();
    });
    this.rest.getApproverforuser('Process Architect').subscribe( (res:any[]) =>  {//BPMN_Process_Modeler
      this.approver_list = res; 
    });
   }
  //  ngAfterViewInit(){
    initiateDiagram(){
      let _self=this;
     if(this.selected_notation){
      this.bpmnModeler = new BpmnJS({
        container: '#canvas1',
        keyboard: {
          bindTo: window
        }
      });
      this.bpmnModeler.on('element.changed', function(){
        let now = new Date().getTime();
        _self.isDiagramChanged = true;
        if(now - _self.last_updated_time > 10*1000){
          _self.autoSaveDiagram();
          _self.last_updated_time = now;
        }
      })
      this.bpmnModeler.importXML(atob(unescape(encodeURIComponent(this.saved_bpmn_list[this.selected_notation].bpmnXmlNotation))), function(err){
        if(err){
          return console.error('could not import BPMN 2.0 diagram', err);
        }
      })
     }else{
      this.rest.getBPMNFileContent("assets/resources/"+this.bpmnservice.getBpmnData()).subscribe(res => {
        let _self = this;
        this.bpmnModeler = new BpmnJS({
          container: '#canvas1',
          keyboard: {
            bindTo: window
          }
        });
        this.bpmnModeler.importXML(res, function(err){
          if(err){
            return console.error('could not import BPMN 2.0 diagram', err);
          }
        })
        this.bpmnModeler.on('element.changed', function(){
          let now = new Date().getTime();
          _self.isDiagramChanged = true;
          if(now - _self.last_updated_time > 10*1000){
            _self.autoSaveDiagram();
            _self.last_updated_time = now;
          }
        })
      });
     }
   }

   automate(){
    let selected_process_id = this.saved_bpmn_list[this.selected_notation].bpmnModelId;
    this.router.navigate(["/pages/rpautomation/workspace"], { queryParams: { processid: selected_process_id }});
  }

  downloadBpmn(){
    if(this.bpmnModeler){
      let _self = this;
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        var blob = new Blob([xml], { type: "application/xml" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let d = new Date();
        let fileName = _self.selected_notation? _self.saved_bpmn_list[_self.selected_notation]['bpmnProcessName']:_self.bpmnservice.newDiagName.value;
        if(fileName.trim().length == 0 ) fileName = "newDiagram";
        link.download = fileName+".bpmn";
        link.innerHTML = "Click here to download the diagram file";
        link.click();
      });
    }
  }
  
   displayBPMN(){
    let value = this.notationListOldValue;
    let _self = this;
    if(this.isDiagramChanged){
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your current changes will be lost on changing diagram.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save and Continue',
        cancelButtonText: 'Discard'
      }).then((res) => {
        if(res.value){
          _self.isDiagramChanged = false;
          _self.notationListNewValue = _self.selected_notation;
          _self.selected_notation = value;
          _self.saveprocess(_self.notationListNewValue);
        }else if(res.dismiss === Swal.DismissReason.cancel){
          this.isDiagramChanged = false;
          this.diplayApproveBtn = true;
          this.notationListOldValue = this.selected_notation;
          if(this.selected_notation == "undefined"){
            this.diplayApproveBtn = false;
            this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
              this.bpmnModeler.importXML(res, function(err){
                _self.oldXml = res.trim();
                _self.newXml = res.trim();
              });
            });
          }
          let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
          let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
          this.bpmnModeler.importXML(selected_xml, function(err){
            _self.oldXml = selected_xml;
            _self.newXml = selected_xml;
          });
        }
      })
    }else{
      this.isDiagramChanged = false;
      this.diplayApproveBtn = true;
      if(this.selected_notation == "undefined"){
        this.diplayApproveBtn = false;
        this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
          this.bpmnModeler.importXML(res, function(err){
            _self.oldXml = res.trim();
            _self.newXml = res.trim();
          });
        });
      }
      let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
      let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
      this.bpmnModeler.importXML(selected_xml, function(err){
        _self.oldXml = selected_xml;
        _self.newXml = selected_xml;
      });
    }
      
  }

   autoSaveDiagram(){
    let _self = this;
    this.spinner.show();
    new BpmnModdle().toXML(this.bpmnModeler._definitions, { format: true }, function(err, updatedXML) {
      _self.uploaded_xml=updatedXML
      _self.bpmnModel.bpmnXmlNotation = btoa(unescape(encodeURIComponent(updatedXML)))
    })
    // this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
    //   _self.uploaded_xml=xml
    //   _self.bpmnModel.bpmnXmlNotation = btoa(unescape(encodeURIComponent(xml)))
    // })
    this.bpmnModel.bpmnModelId=this.selected_notation? this.saved_bpmn_list[this.selected_notation]['bpmnModelId']:this.randomId;
    this.bpmnModel.bpmnProcessName=this.selected_notation? this.saved_bpmn_list[this.selected_notation]['bpmnProcessName']:this.bpmnservice.newDiagName.value;
    this.bpmnModel.bpmnModelModifiedBy="gopi";//localStorage.getItem("userName")
    this.bpmnModel. bpmnModelModifiedTime= new Date();
    this.bpmnModel.bpmnModelTempStatus="PENDING";
    _self.bpmnModel.bpmnProcessMeta =btoa(unescape(encodeURIComponent(this.uploaded_xml)))
    this.rest.autoSaveBPMNFileContent(this.bpmnModel).subscribe(
      data=>{;
        this.autosaveObj=data
        this.bpmnModel.bpmnModelTempId=this.autosaveObj.bpmnModelTempId
        this.counter++;
        this.spinner.hide();
      },
      err => {
          this.spinner.hide();
        }
    )
  }
  uploadBpmn(e){
    let fileName = e.target.value.split("\\").pop();
    if(fileName){
      let _self = this;
      
      this.bpmnservice.uploadBpmn(fileName);
      this.bpmnservice.setNewDiagName(fileName.split('.bpmn')[0])
      this.rest.getBPMNFileContent("assets/resources/"+this.bpmnservice.getBpmnData()).subscribe(res => {
        this.bpmnModeler.importXML(res, function(err){
          _self.oldXml = res.trim();
          _self.newXml = res.trim();
          this.bpmnModel.bpmnXmlNotation=btoa(_self.newXml);
          
        });
         this.randomId = Math.floor(Math.random()*999999);  //Values get repeated
         this.bpmnModel.bpmnProcessName=this.bpmnservice.newDiagName.value;
         this.bpmnModel.reviewComments="";
         this.bpmnModel.approverName="vaidehi";
         this.bpmnModel.bpmnModelId=this.randomId;
         this.bpmnModel.userName="gopi";
         this.bpmnModel.category=this.bpmnservice.bpmnCategory.value;
         this.bpmnModel.bpmnModelModifiedBy = "Vaidehi";//localStorage.getItem("userName")
         this.bpmnModel.bpmnModelTempStatus = "initial";
         this.bpmnfile=this.bpmnservice.bpmnData.value;
         this.rest.saveBPMNprocessinfofromtemp(this.bpmnModel).subscribe(res=>console.log(res));
      });
      this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: false}})
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message, "error");
    }
  }
   saveprocess(newVal){
    this.spinner.show();
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.uploaded_xml=xml
      _self.bpmnModel.bpmnXmlNotation = btoa(unescape(encodeURIComponent(xml)))
    })
    this.bpmnModel.category=this.selected_notation? this.saved_bpmn_list[this.selected_notation]['category']:this.bpmnservice.bpmnCategory.value;
    this.bpmnModel.reviewComments="";
    this.bpmnModel.approverName="vaidehi";//approver list
    this.bpmnModel.bpmnModelId=this.selected_notation? this.saved_bpmn_list[this.selected_notation]['bpmnModelId']:this.randomId;
    this.bpmnModel.bpmnProcessName=this.selected_notation? this.saved_bpmn_list[this.selected_notation]['bpmnProcessName']:this.bpmnservice.newDiagName.value;
    this.bpmnModel.userName="gopi";//localStorage.getItem('userName')
    this.rest.saveBPMNprocessinfofromtemp(this.bpmnModel).subscribe(
      data=>{
        this.spinner.hide()
        Swal.fire(
          'Saved!',
          'Your changes has been saved successfully.',
          'success'
        );
        if(newVal){
          this.selected_notation = newVal;
          let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
          let selected_xml = atob(current_bpmn_info.bpmnXmlNotation);
          this.bpmnModeler.importXML(selected_xml, function(err){
            _self.oldXml = selected_xml;
            _self.newXml = selected_xml;
          });
        }
      },
      err => {
        alert("failed")
          this.spinner.hide();
      })
   }

   submitDiagramForApproval(){
    let _self = this;
    this.bpmnModel.approverName="vaidehi";//approver name
    this.bpmnModel.bpmnJsonNotation= btoa(unescape(encodeURIComponent(this.uploaded_xml)));
    this.bpmnModel.bpmnModelId=this.selected_notation? this.saved_bpmn_list[this.selected_notation]['bpmnModelId']:this.randomId;
    this.bpmnModel.bpmnProcessName=this.selected_notation? this.saved_bpmn_list[this.selected_notation]['bpmnProcessName']:this.bpmnservice.newDiagName.value;
    this.bpmnModel.bpmnNotationAutomationTask=btoa(unescape(encodeURIComponent(this.uploaded_xml)));
    this.bpmnModel.bpmnNotationHumanTask=btoa(unescape(encodeURIComponent(this.uploaded_xml)));
    this.bpmnModel.bpmnProcessApproved=0;
    this.bpmnModel.bpmnProcessStatus="PENDING";
    this.bpmnModel.bpmnModelTempId=this.autosaveObj.bpmnModelTempId;
    this.bpmnModel.bpmnXmlNotation=btoa(unescape(encodeURIComponent(this.uploaded_xml)));
    this.bpmnModel.category= "infrastructure";//category for uploaded file
    this.bpmnModel.emailTo= "swaroop.attaluri@epsoftinc.com";//Change the email id
    this.bpmnModel.id= 5;
    this.bpmnModel.processIntelligenceId= 5;
    this.bpmnModel.reviewComments ="";
    this.bpmnModel.tenantId=7;
    this.bpmnModel.userName="gopi";//localStorage.getItem("userName")
    this.spinner.show();
    this.rest.submitBPMNforApproval(this.bpmnModel).subscribe(
      data=>{
        Swal.fire(
          'Saved!',
          'Your changes has been saved and submitted for approval successfully.',
          'success'
        );
        this.spinner.hide();
      },
      err => {
        alert("failed")
        this.spinner.hide();
    })
  }

   uploadConfBpmn(confBpmnData){
    this.confBpmnModeler = new BpmnJS({
      container: '#canvas2',
      keyboard: {
        bindTo: window
      }
    });
     this.bpmnservice.uploadConfirmanceBpmn(confBpmnData);
     let _self = this;
    this.rest.getBPMNFileContent("assets/resources/"+confBpmnData).subscribe(res => {
      _self.confBpmnModeler.importXML(res, function(err){
        if(err){
          return console.error('could not import BPMN 2.0 diagram', err);
        }
        _self.confBpmnXml = res;
        _self.bpmnservice.uploadConfirmanceBpmnXMLDef( _self.confBpmnModeler._definitions);
      })
    });
   }
   
  slideup(){
    let ele = document.getElementById("bpmn_differences");
    if(ele){
      ele.classList.add("slide-up");
      ele.classList.remove("slide-down");
    }
  }

  showdiagram(diagramxml){
    this.viewer.importXML(diagramxml,function(){
      let canvas=this.viewer.get('canvas1')
      canvas.addMarker('Bake the pizza', 'highlight');
    })
  }
  displayContainer(id, err){
    let container:HTMLElement = document.getElementById(id);
    if (err) {
      container.classList.remove('with-diagram');
      container.classList.add('with-error');
      container.getElementsByClassName("err-msg")[0].textContent = err.message;
    } else {
      container.classList.add('with-diagram');
      container.classList.remove('with-error');
      container.getElementsByClassName("err-msg")[0].textContent = "";
    }
  }
  getBpmnDifferences(){
    let bpmnDiffs = diff(this.bpmnModeler.getDefinitions(), this.bpmnservice.getConfBpmnXMLDef());
    this.bpmnservice.updateDifferences(bpmnDiffs);
    this.slideup();
  }
}