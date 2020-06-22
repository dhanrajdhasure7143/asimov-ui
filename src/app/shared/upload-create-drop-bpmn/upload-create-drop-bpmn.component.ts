import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { RestApiService } from '../../pages/services/rest-api.service';
//import { NgxSpinnerService } from "ngx-spinner"; 
import { SharebpmndiagramService } from '../../pages/services/sharebpmndiagram.service';
import { GlobalScript } from '../global-script';
import { BpmnModel } from '../../pages/business-process/model/bpmn-autosave-model';
import { UploadProcessModelComponent } from 'src/app/pages/business-process/upload-process-model/upload-process-model.component';

@Component({
  selector: 'app-upload-create-drop-bpmn',
  templateUrl: './upload-create-drop-bpmn.component.html',
  styleUrls: ['./upload-create-drop-bpmn.component.css'],
  providers: [UploadProcessModelComponent]
})
export class UploadCreateDropBpmnComponent implements OnInit {
  bpmnModeler:any;
  oldXml;
  newXml;
  updated_date_time;
  bpmnModel:BpmnModel = new BpmnModel();
  last_updated_time = new Date().getTime();
  bpmnupload:boolean=false;
  hideEditor:boolean=true;
  create_editor:boolean=true;
  counter:number = 0;
  bpmnProcessName;
  category;
  randomId: number;
  bpmnfile: any;
  constructor(private router:Router,private bpmnservice:SharebpmndiagramService, 
    private global: GlobalScript, private rest:RestApiService, private uploadProcessModel:UploadProcessModelComponent) { }

  ngOnInit() {
  }
  onSelect(e){
    //this.slideUp();
    this.bpmnupload= true;
    this.hideEditor=false;
    let _self =this;
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      this.bpmnservice.setNewDiagName(e.addedFiles[0].name.replace('.bpmn',''));
      if( this.router.url.indexOf("uploadProcessModel") > -1 ){
        this.bpmnservice.changeConfNav(true);
        this.uploadProcessModel.uploadConfBpmn(e.addedFiles[0].name);
        console.log(this.bpmnservice.getBpmnData());
this.bpmnfile=this.bpmnservice.newDiagName.value;
        this.rest.getBPMNFileContent("assets/resources/"+this.bpmnfile).subscribe(res => {
          this.bpmnModeler.importXML(res, function(err){
            _self.oldXml = res.trim();
            _self.newXml = res.trim();
            this.bpmnModel.bpmnXmlNotation=btoa(_self.newXml);
            
          });
           this.bpmnModel.bpmnProcessName=this.bpmnservice.newDiagName.value;
           this.bpmnModel.reviewComments="";
           this.bpmnModel.approverName="vaidehi";
           this.bpmnModel.bpmnModelId=this.randomId;
            this.bpmnModel.userName="gopi";
            this.bpmnModel.bpmnModelModifiedBy = "Vaidehi";//localStorage.getItem("userName")
            this.bpmnModel.bpmnModelTempStatus = "initial";
           this.bpmnModel.category=this.bpmnservice.bpmnCategory.value;
            this.rest.saveBPMNprocessinfofromtemp(this.bpmnModel).subscribe(res=>console.log(res));
        });
      }else{
        this.bpmnservice.changeConfNav(false);
        this.bpmnservice.uploadBpmn(e.addedFiles[0].name);
        this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: false}});
      }
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message,"error");
    }
  }
  uploadBpmn(e){
    debugger
    let fileName = e.target.value.split("\\").pop();
    if(fileName){
      let _self = this;
      this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: false}})
      this.bpmnservice.uploadBpmn(fileName);
      this.bpmnservice.setNewDiagName(fileName.split('.bpmn')[0])
      this.rest.getBPMNFileContent("assets/resources/"+this.bpmnservice.getBpmnData()).subscribe(res => {
        this.bpmnModeler.importXML(res, function(err){
          _self.oldXml = res.trim();
          _self.newXml = res.trim();
          //this.bpmnModel.bpmnXmlNotation=btoa(_self.newXml);
          
        });
        this.bpmnModel.bpmnProcessName = this.bpmnservice.newDiagName.value;
    this.bpmnModel.bpmnModelId=this.randomId;
    this.bpmnModel.bpmnModelModifiedBy="gopi";//localStorage.getItem("userName")
    this.bpmnModel.bpmnModelTempStatus="PENDING";
    this.bpmnModel.bpmnModelModifiedBy = "Vaidehi";//localStorage.getItem("userName")
    this.bpmnModel.bpmnModelTempStatus = "initial";
        this.rest.saveBPMNprocessinfofromtemp(this.bpmnModel).subscribe(res=>console.log(res));
      });
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message, "error");
    }
 
  }
  slideDown(){
    document.getElementById("foot").classList.add("slide-down");
    document.getElementById("foot").classList.remove("slide-up");
  }
  
  slideUp(){
    document.getElementById("foot").classList.remove("slide-down");
    document.getElementById("foot").classList.add("slide-up");
  }

  autoSaveBpmnDiagram(){
    // this.spinner.show();
      let _self = this;
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        _self.updated_date_time = new Date();
        _self.bpmnModel.bpmnModelModifiedTime = _self.updated_date_time;
        _self.bpmnModel.bpmnModelTempId = _self.counter;
        _self.bpmnModel.bpmnModelTempVersion = '0.0.'+_self.counter;
        _self.bpmnModel.bpmnProcessMeta = btoa(_self.newXml);
        _self.autoSaveDiagram();
      });
  }  
  
  autoSaveDiagram(){
    this.rest.autoSaveBPMNFileContent(this.bpmnModel).subscribe(res => {
      this.counter++;
      // this.spinner.hide();
    },
    err => {
      // this.spinner.hide();
    })
  }

  createBpmn(){
    this.randomId = Math.floor(Math.random()*999999);//Values get repeated
    this.bpmnservice.setNewDiagName(this.bpmnProcessName);
    this.bpmnservice.setBpmnCategory(this.category);
    this.bpmnupload= true;
    this.create_editor=false;
    this.bpmnservice.changeConfNav(false);
     if(this.router.url == "/pages/businessProcess/home"){
      this.router.navigateByUrl('/pages/businessProcess/createDiagram');
     }else{
      this.bpmnservice.changeConfNav(true);
       this.bpmnModeler = new BpmnJS({
          container: '#canvas',
          keyboard: {
            bindTo: window
          }
        });
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
    this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
      let _self = this;
      this.newXml=res;
      this.bpmnModel.bpmnXmlNotation=btoa(this.newXml);
      this.bpmnModel.bpmnProcessName=this.bpmnservice.newDiagName.value;
      this.bpmnModel.reviewComments="";
    this.bpmnModel.approverName="vaidehi";
    this.bpmnModel.bpmnModelId=this.randomId;
    this.bpmnModel.userName="gopi";
    this.bpmnModel.category=this.bpmnservice.bpmnCategory.value;
    this.bpmnModel.bpmnModelModifiedBy = "Vaidehi";//localStorage.getItem("userName")
    this.bpmnModel.bpmnModelTempStatus = "initial";
      this.rest.saveBPMNprocessinfofromtemp(this.bpmnModel).subscribe(res=>console.log(res));
      this.bpmnModeler.importXML(res, function(err){
        _self.oldXml = res.trim();
        _self.newXml = res.trim();
        //this.bpmnModel.bpmnProcessName=this.bpmnservice.newDiagName.value;
    //this.bpmnModel.reviewComments="";
    //this.bpmnModel.approverName="vaidehi";
    //this.bpmnModel.bpmnModelId=this.randomId;
    //this.bpmnModel.userName="gopi";
    //this.bpmnModel.category=this.bpmnservice.bpmnCategory.value;
      });
    });
    let _self = this;
    this.bpmnModeler.on('element.changed', function(){
      let now = new Date().getTime();
      if(now - _self.last_updated_time > 10*1000){
        _self.autoSaveBpmnDiagram();
        _self.last_updated_time = now;
      }
    })
  }
  this.slideDown();
}
  saveprocess(){
    alert("saved successfully");
    //this.router.navigate('')
  }   
}
