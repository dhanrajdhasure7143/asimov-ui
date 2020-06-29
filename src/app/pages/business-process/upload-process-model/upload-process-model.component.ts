import { Component, OnInit ,AfterViewInit, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { diff } from 'bpmn-js-differ';
import { NgxSpinnerService } from "ngx-spinner"; 

import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import Swal from 'sweetalert2';
import { GlobalScript } from 'src/app/shared/global-script';
import { UUID } from 'angular2-uuid';

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
  split: SplitComponent;
  area1: SplitAreaDirective;
  area2: SplitAreaDirective;
  last_updated_time = new Date().getTime();
  bpmnModel:BpmnModel = new BpmnModel();
  autosaveObj:any;
  categoryName;
  bpmnProcessName;
  isotherCategory:boolean=false;
  categoriesList:any=[];
  isConfNavigation:boolean=false;
  saved_bpmn_list:any[] = [];
  approver_list:any[] = [];
  selected_notation = 0;
  selected_approver;
  diplayApproveBtn:boolean = false;
  isLoading:boolean = false;
  isDiagramChanged:boolean = false;
  notationListOldValue = 0;
  notationListNewValue = undefined;
  randomId;
  oldXml;
  newXml;
  selected_modelId;
  uploadedFile;
  isRouterNotation:boolean = false;

   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, private spinner:NgxSpinnerService,
      private dt:DataTransferService, private route:ActivatedRoute, private global:GlobalScript) { }
 
   ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});
    this.rest.getCategoriesList().subscribe(res=> this.categoriesList=res );
    this.bpmnservice.isConfNav.subscribe(res => this.isConfNavigation = res);
    this.route.queryParams.subscribe(params => {
      this.selected_notation = parseInt(params['bpsId']);
      this.isShowConformance = params['isShowConformance'] == 'true';
      this.isRouterNotation = this.selected_notation >= 0;
    });
    this.selected_modelId = this.bpmnservice.bpmnId.value;
    this.getUserBpmnList();
    this.getApproverList();
    // this.randomId = UUID.UUID(); 
    this.randomId = Math.floor(Math.random()*999999);  //Values get repeated
   }

   async getUserBpmnList(){
    this.isLoading = true;
    await this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_bpmn_list = res; 
      if(!this.isRouterNotation){
        this.selected_notation = 0;
        this.notationListOldValue = 0;
      }else{
        this.notationListOldValue = this.selected_notation;
      }
      this.isLoading = false;
      this.initiateDiagram();
    });
   }

   async getApproverList(){
     await this.rest.getApproverforuser('Admin').subscribe( (res:any[]) =>  {//Process Architect
      this.approver_list = res; 
    });
   }
  //  ngOnDestroy(){
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Your current changes will be lost on changing diagram.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Save and Continue',
  //     cancelButtonText: 'Discard'
  //   }).then((res)=>{
  //     if(res.value){
  //       this.saveprocess(null);
  //     }
  //   })
  // }
   
    initiateDiagram(){
      let _self=this;
      let modeler_obj = this.isShowConformance && !this.reSize ? "confBpmnModeler":"bpmnModeler";
      this[modeler_obj] = new BpmnJS({
        container: this.isShowConformance && !this.reSize ? '#canvas2':'#canvas1',
        keyboard: {
          bindTo: window
        }
      });
      this[modeler_obj].on('element.changed', function(){
        let now = new Date().getTime();
        _self.isDiagramChanged = true;
        if(now - _self.last_updated_time > 10*1000){
          _self.autoSaveBpmnDiagram();
          _self.last_updated_time = now;
        }
      })
      if(this.isShowConformance && !this.reSize){ 
        this.rest.getBPMNFileContent("assets/resources/pizza-collaboration.bpmn").subscribe(res => {
          this[modeler_obj].importXML(res, function(err){
            if(err){
              return console.error('could not import BPMN 2.0 diagram', err);
            }
          })
        });
      }else{
        this[modeler_obj].importXML(atob(unescape(encodeURIComponent(this.saved_bpmn_list[this.selected_notation].bpmnXmlNotation))), function(err){
          if(err){
            return console.error('could not import BPMN 2.0 diagram', err);
          }
        })
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
          let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
          let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
          this.confBpmnModeler.importXML(selected_xml, function(err){
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
        _self.bpmnModel.bpmnModelModifiedTime = new Date();
        _self.bpmnModel.bpmnProcessMeta = btoa(unescape(encodeURIComponent(_self.newXml)));
        _self.bpmnModel.bpmnProcessName = _self.saved_bpmn_list[_self.selected_notation]['bpmnProcessName'];
        _self.bpmnModel.bpmnModelId = _self.randomId;
        _self.autoSaveDiagram(_self.bpmnModel);  
      }
    });
  }

  autoSaveDiagram(model){
    this.rest.autoSaveBPMNFileContent(model).subscribe(
      data=>{;
        this.autosaveObj=data
        this.bpmnModel.bpmnModelTempId=this.autosaveObj.bpmnModelTempId
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
        let d = new Date();
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
      this.bpmnservice.uploadBpmn(encrypted_bpmn);//is it needed? similary storing process name, category
      this.bpmnModel.bpmnXmlNotation=encrypted_bpmn;
      this.bpmnModel.bpmnProcessName=this.bpmnProcessName;
      this.bpmnModel.bpmnModelId=this.randomId;
      this.bpmnservice.setSelectedBPMNModelId(this.randomId);
      this.bpmnModel.category=this.categoryName;
      this.slideDown();
      this.initialSave(this.bpmnModel);
      // this.initBpmnModeler();
      this.bpmnModeler.importXML(fileString, function(err){
        _self.oldXml = fileString.trim();
        _self.newXml = fileString.trim();
        _self.bpmnProcessName = "";
        _self.categoryName = "";
        _self.isLoading = false;
      });
      // this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: false}})
    }
    myReader.readAsText(this.uploadedFile);
  }

  initBpmnModeler(){
    if(!this.bpmnModeler){
      this.bpmnModeler = new BpmnJS({
        container: '#canvas1',
        keyboard: {
          bindTo: window
        }
      });
      let _self = this;
      this.bpmnModeler.on('element.changed', function(){
        let now = new Date().getTime();
        _self.isDiagramChanged = true;
        if(now - _self.last_updated_time > 10*1000){
          _self.autoSaveBpmnDiagram();
          _self.last_updated_time = now;
        }
      })
    }
  }

  initialSave(diagramModel:BpmnModel){
    // diagramModel.modifiedTimestamp = new Date();
    this.rest.saveBPMNprocessinfofromtemp(diagramModel).subscribe(res=>{
      this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
        this.saved_bpmn_list = res; 
        if(!this.selected_notation){
          this.selected_notation = res.length - 1;//with Order BY modified time in DB, this line should be removed
          this.notationListOldValue = res.length - 1;//with Order BY modified time in DB, this line should be removed
        }
      })
    });
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
     _self.bpmnModel.bpmnXmlNotation = final_notation;
     _self.bpmnModel.bpmnJsonNotation = final_notation;
     _self.bpmnModel.bpmnNotationAutomationTask = final_notation;
     _self.bpmnModel.bpmnNotationHumanTask = final_notation;
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
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    this.bpmnModel.bpmnModelModifiedTime = new Date();
    this.bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
    this.bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
    this.bpmnModel.category = sel_List['category'];
    this.bpmnModel.approverName="";
    this.initBpmnModeler();
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      _self.bpmnModel.bpmnXmlNotation = final_notation;
      _self.bpmnModel.bpmnProcessMeta = final_notation;
      _self.saved_bpmn_list[_self.selected_notation]['bpmnXmlNotation'] = final_notation;
      _self.rest.saveBPMNprocessinfofromtemp(_self.bpmnModel).subscribe(
        data=>{
          _self.isLoading = false;
          _self.isRouterNotation = false;
          _self.getUserBpmnList();
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
          _self.isLoading = false;
          Swal.fire(
            'Oops!',
            'Something went wrong. Please try again',
            'error'
          )
        })
    })
   }

   
   uploadConfBpmn(confBpmnData){
    let _self = this;
    let decrypted_data = atob(unescape(encodeURIComponent(confBpmnData)));
    this.isLoading = true;
    setTimeout(()=> {
      this.initBpmnModeler();
      this.bpmnModeler.importXML(decrypted_data, function(err){
        if(err){
          return console.error('could not import BPMN 2.0 diagram', err);
        }
        _self.confBpmnXml = decrypted_data;
        _self.bpmnservice.uploadConfirmanceBpmnXMLDef( _self.bpmnModeler._definitions);
        _self.isLoading = false;
        _self.getUserBpmnList();
      })
    }, 3000);
   }
   
  slideUpDifferences(){
    let ele = document.getElementById("bpmn_differences");
    if(ele){
      ele.classList.add("slide-up");
      ele.classList.remove("slide-down");
    }
  }

  getBpmnDifferences(){
    let bpmnDiffs = diff(this.bpmnModeler.getDefinitions(), this.bpmnservice.getConfBpmnXMLDef());
    this.bpmnservice.updateDifferences(bpmnDiffs);
    this.slideUpDifferences();
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