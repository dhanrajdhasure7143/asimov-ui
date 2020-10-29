import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../../pages/services/rest-api.service';
import { SharebpmndiagramService } from '../../pages/services/sharebpmndiagram.service';
import { GlobalScript } from '../global-script';
import { UUID } from 'angular2-uuid';
import { BpmnModel } from '../../pages/business-process/model/bpmn-autosave-model';

@Component({
  selector: 'app-upload-create-drop-bpmn',
  templateUrl: './upload-create-drop-bpmn.component.html',
  styleUrls: ['./upload-create-drop-bpmn.component.css']
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
  randomId: string;
  bpmnfile: any;
  uploaded_file:File;
  processName:string;
  category:string;

  @Output() update = new EventEmitter<any>();
  @Input() data;

  constructor(private router:Router,private bpmnservice:SharebpmndiagramService,
    private global: GlobalScript, private rest:RestApiService) { }

  ngOnInit() {

  }

  onSelect(e){
    this.slideUp();
    this.hideEditor=false;
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      this.uploaded_file = e.addedFiles[0];
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper notation";
      this.global.notify(message,"error");
    }
  }

  slideUp(){
    this.uploaded_file = null;
    var modal = document.getElementById('myModal');
    modal.style.display="block";
  }

  uploadCreateBpmn(e){
    this.randomId = UUID.UUID();
    this.create_editor=false;
    this.bpmnModel.bpmnProcessName=e.processName;
    this.bpmnModel.ntype=e.ntype;
    this.bpmnModel.bpmnModelId=this.randomId;
    if(this.data){
      let dataarr = this.data.split("@");
      this.bpmnModel.bpmnModelId= dataarr[2];
      this.bpmnModel.processIntelligenceId = dataarr[3];
      this.bpmnModel.notationFromPI = true;
      this.bpmnModel.hasConformance = true;
    }
    this.bpmnservice.setSelectedBPMNModelId(this.randomId);
    this.bpmnModel.category=e.categoryName;
    if(this.uploaded_file){
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (ev) => {
        let fileString:string = myReader.result.toString();
        let encrypted_bpmn = btoa(unescape(encodeURIComponent(fileString)));
        if( this.router.url.indexOf("uploadProcessModel") > -1 ){
          this.bpmnservice.changeConfNav(true);
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
      this.rest.getBPMNFileContent("assets/resources/newDiagram."+e.ntype).subscribe(res => {
        let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
        this.bpmnservice.uploadBpmn(encrypted_bpmn);
        this.bpmnModel.bpmnXmlNotation=encrypted_bpmn;
        this.initialSave(this.bpmnModel, "create");
      });
    }
  }

  initialSave(diagramModel:BpmnModel, target:string){
    let message;
    diagramModel.createdTimestamp = new Date();
    diagramModel.modifiedTimestamp = new Date();
    this.rest.saveBPMNprocessinfofromtemp(diagramModel).subscribe(res=>{
      if(res['errorCode']!="2005"){
        let isBPSHome = this.router.url == "/pages/businessProcess/home";
        if(!isBPSHome){
          this.bpmnservice.changeConfNav(true);
          this.update.emit(true);
        }else{
          if(target == "create"){
              this.router.navigateByUrl('/pages/businessProcess/createDiagram');
          }
          if(target == "upload"){
              this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: false}});
          }
        }
      }else{
        message = "Process name already exists ";
        this.global.notify(message,"error");
      }
    });
  }

}
