import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import Swal from 'sweetalert2';

import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { GlobalScript } from '../../../shared/global-script';

@Component({
  selector: 'app-create-bpmn-diagram',
  templateUrl: './create-bpmn-diagram.component.html',
  styleUrls: ['./create-bpmn-diagram.component.css']
})
export class CreateBpmnDiagramComponent implements OnInit,AfterViewInit {
  bpmnModeler:any;
  oldXml;
  newXml;
  categoryName;
  bpmnProcessName;
  isotherCategory:boolean=false;
  categoriesList:any=[];
  autosaveObj:any;
  bpmnModel:BpmnModel = new BpmnModel();
  isLoading:boolean = false;
  diplayApproveBtn:boolean = false;
  isDiagramChanged:boolean = false;
  last_updated_time = new Date().getTime();
  saved_bpmn_list:any[] = [];
  approver_list:any[] = [];
  selected_notation = 0;
  selected_approver;
  randomId;
  notationListOldValue = 0;
  notationListNewValue = undefined;
  selected_modelId;
  uploadedFile;

  constructor(private rest:RestApiService, private spinner:NgxSpinnerService, private dt:DataTransferService,
    private router:Router, private bpmnservice:SharebpmndiagramService, private global:GlobalScript) {}

  ngOnInit(){
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/createDiagram", "title":"Studio"});
    this.selected_modelId = this.bpmnservice.bpmnId.value;
    this.rest.getCategoriesList().subscribe(res=> this.categoriesList=res );
    this.getUserBpmnList();
    this.getApproverList();
    // this.randomId = UUID.UUID();
    this.randomId = Math.floor(Math.random()*999999);  //Values get repeated
  }
  ngOnDestroy(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Your current changes will be lost on changing diagram.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Save and Continue',
      cancelButtonText: 'Discard'
    }).then((res)=>{
      if(res.value){
        this.saveprocess(null);
      }
    })
  }

  async getUserBpmnList(){
    this.isLoading = true;
    await this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_bpmn_list = res; 
      this.selected_notation = 0;
      this.notationListOldValue = 0;
      this.isLoading = false;
    });
   }

   async getApproverList(){
     await this.rest.getApproverforuser('Admin').subscribe( (res:any[]) =>  {//Process Architect
      this.approver_list = res; 
    });
   }

  ngAfterViewInit(){
    let _self = this;
    this.bpmnModeler = new BpmnJS({
      container: '#canvas',
      keyboard: {
        bindTo: window
      }
    });
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
    this.bpmnModeler.on('element.changed', function(){
      _self.isDiagramChanged = true;
      let now = new Date().getTime();
      if(now - _self.last_updated_time > 10*1000){
        _self.autoSaveBpmnDiagram();
        _self.last_updated_time = now;
      }
    })
    // this.saved_bpmn_list[this.selected_notation].bpmnXmlNotation 
    let decrypted_bpmn = atob(unescape(encodeURIComponent(this.bpmnservice.getBpmnData()))); 
    this.bpmnModeler.importXML(decrypted_bpmn, function(err){
      _self.oldXml = decrypted_bpmn.trim();
      _self.newXml = decrypted_bpmn.trim();
    });
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
          let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
          let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
          this.bpmnModeler.importXML(selected_xml, function(err){
            _self.oldXml = selected_xml;
            _self.newXml = selected_xml;
          });
        }
      })
    }else{
      this.isLoading = true;
      this.isDiagramChanged = false;
      this.diplayApproveBtn = true;
      let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
      let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
      this.bpmnModeler.importXML(selected_xml, function(err){
        _self.oldXml = selected_xml;
        _self.newXml = selected_xml;
        _self.isLoading = false;
      });
    }
      
  }
 
  autoSaveBpmnDiagram(){
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        _self.spinner.show();
        _self.bpmnModel.modifiedTimestamp = new Date();
        _self.bpmnModel.bpmnProcessMeta = btoa(unescape(encodeURIComponent(_self.newXml)));
        _self.bpmnModel.bpmnProcessName = _self.saved_bpmn_list[_self.selected_notation]['bpmnProcessName'];
        _self.bpmnModel.bpmnModelId = _self.randomId;
        _self.autoSaveDiagram(_self.bpmnModel);  
      }
    });
  }

  autoSaveDiagram(model){
    this.rest.autoSaveBPMNFileContent(model).subscribe(
      data=>{
        this.autosaveObj = data;
        this.bpmnModel.bpmnModelTempId = this.autosaveObj.bpmnModelTempId;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
    })
  }

  automate(){
    let selected_process_id = this.saved_bpmn_list[this.selected_notation].bpmnModelId;
    this.router.navigate(["/pages/rpautomation/workspace"], { queryParams: { processid: selected_process_id }});
  }
 
  downloadBpmn(){
    if(this.bpmnModeler){
      let _self = this;
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        _self.saved_bpmn_list[_self.selected_notation]['bpmnXmlNotation'] = btoa(unescape(encodeURIComponent(xml)));
        var blob = new Blob([xml], { type: "application/xml" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let fileName = _self.saved_bpmn_list[_self.selected_notation]['bpmnProcessName'];
        if(fileName.trim().length == 0 ) fileName = "newDiagram";
        link.download = fileName+".bpmn";
        link.innerHTML = "Click here to download the diagram file";
        link.click();
      });
    }
  }

  uploadAgainBpmn(){
    this.isLoading = true;
    let _self = this;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (ev) => {
      let fileString:string = myReader.result.toString();
      let encrypted_bpmn = btoa(unescape(encodeURIComponent(fileString)));
      this.slideDown();
      this.bpmnservice.uploadBpmn(encrypted_bpmn);//is it needed? similary storing process name, category
      this.bpmnModel.bpmnXmlNotation=encrypted_bpmn;
      this.bpmnModel.bpmnProcessName = this.bpmnProcessName;
      this.bpmnModel.bpmnModelId=this.randomId;
      this.bpmnservice.setSelectedBPMNModelId(this.randomId);
      this.bpmnModel.category=this.categoryName;
      this.initialSave(this.bpmnModel);
      this.bpmnModeler.importXML(fileString, function(err){
        _self.oldXml = fileString.trim();
        _self.newXml = fileString.trim();
        _self.bpmnProcessName = "";
        _self.categoryName = "";
        _self.isLoading = false;
      });
    }
    myReader.readAsText(this.uploadedFile);
  }

  initialSave(diagramModel:BpmnModel){
    // diagramModel.modifiedTimestamp = new Date();
    this.rest.saveBPMNprocessinfofromtemp(diagramModel).subscribe(res=>console.log("initailly saved"));
  }
  submitDiagramForApproval(){
    if(!this.selected_approver){
      Swal.fire("No approver", "Please select approver from the list given above", "error");
      return;
    }
    this.isLoading = true;
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    this.bpmnModel.approverName = this.selected_approver;
    this.bpmnModel.bpmnModelId= sel_List['bpmnModelId'];
    this.bpmnModel.bpmnProcessName=sel_List['bpmnProcessName'];
    this.bpmnModel.bpmnModelTempId=this.autosaveObj ? this.autosaveObj.bpmnModelTempId: 999;
    this.bpmnModel.category = sel_List['category'];
    this.bpmnModel.id= 5;
    this.bpmnModel.processIntelligenceId= 5;//?? FOR SHowconformance screen alone??
    this.bpmnModel.tenantId=7;
    this.bpmnModel.bpmnProcessApproved = 0;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      _self.bpmnModel.bpmnJsonNotation = final_notation;
      _self.bpmnModel.bpmnNotationAutomationTask = final_notation;
      _self.bpmnModel.bpmnNotationHumanTask = final_notation;
      _self.bpmnModel.bpmnXmlNotation = final_notation;
      _self.rest.submitBPMNforApproval(_self.bpmnModel).subscribe(
        data=>{
          _self.isLoading = false;
          Swal.fire(
            'Saved!',
            'Your changes has been saved and submitted for approval successfully.',
            'success'
          )
        },err => {
          _self.isLoading = false;
          Swal.fire(
            'Oops!',
            'Something went wrong. Please try again',
            'error'
          )
        })
    })
  }
  
  saveprocess(newVal){
    this.isDiagramChanged = false;
    this.isLoading = true;
    let _self=this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    this.bpmnModel.bpmnModelModifiedTime = new Date();
    this.bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
    this.bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
    this.bpmnModel.category = sel_List['category'];
    this.bpmnModel.approverName="";
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      _self.bpmnModel.bpmnXmlNotation = final_notation;
      _self.bpmnModel.bpmnProcessMeta = final_notation;
      _self.saved_bpmn_list[_self.selected_notation]['bpmnXmlNotation'] = final_notation;
      _self.rest.saveBPMNprocessinfofromtemp(_self.bpmnModel).subscribe(
        data=>{
          _self.isLoading = false;
          _self.getUserBpmnList();
          Swal.fire(
            'Saved!',
            'Your changes has been saved successfully.',
            'success'
          )
          if(newVal){
            _self.selected_notation = newVal;
            let current_bpmn_info = _self.saved_bpmn_list[_self.selected_notation];
            let selected_xml = atob(current_bpmn_info.bpmnXmlNotation);
            _self.bpmnModeler.importXML(selected_xml, function(err){
              _self.oldXml = selected_xml;
              _self.newXml = selected_xml;
            });
          }
        },
        err => {
          _self.isLoading = false;
          Swal.fire(
            'Oops!',
            'Something went wrong. Please try again',
            'error'
          )
        })
    });
  }

  slideUp(e){
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      var modal = document.getElementById('myModal');
      modal.style.display="block";
      this.uploadedFile = e.addedFiles[0];
    }else{
      this.uploadedFile = null;
      this.isLoading = false;
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message, "error");
    }
  }
  slideDown(){
    this.uploadedFile = null;
    var modal = document.getElementById('myModal');
    modal.style.display="none";
  }
  onchangeCategories(categoryName){
    if(categoryName =='other'){
      this.isotherCategory=true;
    }else{
      this.isotherCategory=false;
    }
  }
  
}
