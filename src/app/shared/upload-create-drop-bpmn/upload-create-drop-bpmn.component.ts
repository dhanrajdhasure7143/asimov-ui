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
  hideEditor:boolean=true;
  create_editor:boolean=true;
  counter:number = 0;
  bpmnProcessName;
  categoryName;
  othercategory;
  isotherCategory:boolean=false;
  categoriesList:any=[];
  randomId: number;
  bpmnfile: any;
  uploaded_file:File;

  constructor(private router:Router,private bpmnservice:SharebpmndiagramService, 
    private global: GlobalScript, private rest:RestApiService, private uploadProcessModel:UploadProcessModelComponent) { }

  ngOnInit() {
    this.rest.getCategoriesList().subscribe(res=> this.categoriesList=res );
  }

  loopTrackBy(index, term){
    return index;
  }
  
  onSelect(e){
    this.slideUp();
    this.hideEditor=false;
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      this.uploaded_file = e.addedFiles[0];
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message,"error");
    }
  }

  slideDown(){
    this.uploaded_file = null;
    var modal = document.getElementById('myModal');
    modal.style.display="none";
  }
  
  slideUp(){
    this.uploaded_file = null;
    var modal = document.getElementById('myModal');
    modal.style.display="block";
  }

  onchangeCategories(categoryName){
    if(categoryName =='other'){
      this.isotherCategory=true;
    }else{
      this.isotherCategory=false;
    }
  }

  saveCategory(){
    if(this.categoryName =='other'){
      let otherCategory={
        "categoryId": 0,
        "categoryName": this.othercategory
      }
      this.rest.addCategory(otherCategory).subscribe(res=>{})
    }
  }

  uploadCreateBpmn(){
    this.randomId = Math.floor(Math.random()*999999);//Values get repeated
    this.saveCategory();
    this.create_editor=false;
    this.bpmnModel.bpmnProcessName=this.bpmnProcessName;
    this.bpmnModel.bpmnModelId=this.randomId;
    this.bpmnservice.setSelectedBPMNModelId(this.randomId);
    this.bpmnModel.category=this.categoryName;
    if(this.uploaded_file){
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (ev) => {
        let fileString:string = myReader.result.toString();
        let encrypted_bpmn = btoa(unescape(encodeURIComponent(fileString)));
        this.slideDown();
        if( this.router.url.indexOf("uploadProcessModel") > -1 ){
          this.bpmnservice.changeConfNav(true);
          this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: true}});
          // this.uploadProcessModel.uploadConfBpmn(encrypted_bpmn);
        }else{
          this.bpmnservice.changeConfNav(false);
          this.bpmnservice.uploadBpmn(encrypted_bpmn);
        }
        this.bpmnModel.bpmnXmlNotation = encrypted_bpmn;
        this.initialSave(this.bpmnModel, "upload");
      };
      myReader.readAsText(this.uploaded_file);
    }else{
      this.bpmnservice.changeConfNav(false);
      this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
        let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
        this.bpmnservice.uploadBpmn(encrypted_bpmn);
        this.bpmnModel.bpmnXmlNotation=encrypted_bpmn;
        this.initialSave(this.bpmnModel, "create");
      });
    }
  }


  initialSave(diagramModel:BpmnModel, target:string){
    this.rest.saveBPMNprocessinfofromtemp(diagramModel).subscribe(res=>{
      let isBPSHome = this.router.url == "/pages/businessProcess/home";
      if(!isBPSHome){
        this.bpmnservice.changeConfNav(true);
        this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: true}});
      }else{
        if(target == "create"){
            this.router.navigateByUrl('/pages/businessProcess/createDiagram');
        }else if(target == "upload"){
            this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: false}});
        }
      }
    });
  }
 
}
