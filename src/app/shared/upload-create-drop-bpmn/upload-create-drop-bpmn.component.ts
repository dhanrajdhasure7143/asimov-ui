import { Component, OnInit, Output, EventEmitter, Input, AfterViewChecked, ChangeDetectorRef, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../../pages/services/rest-api.service';
import { SharebpmndiagramService } from '../../pages/services/sharebpmndiagram.service';
import { GlobalScript } from '../global-script';
import { UUID } from 'angular2-uuid';
import { BpmnModel } from '../../pages/business-process/model/bpmn-autosave-model';
import Swal from 'sweetalert2';
import { APP_CONFIG } from 'src/app/app.config';

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
  validNotationTypes: string;
  uploadedFileName:string;
  isShowConformance:boolean=false;

  @Output() update = new EventEmitter<any>();
  @Input() data;
  @Input('bpmn_list') public bpmn_list: any=[];
  userRoles: any;
  freetrail: string;

  constructor(private router:Router,private bpmnservice:SharebpmndiagramService, private route:ActivatedRoute,
    private global: GlobalScript, private rest:RestApiService, private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef,
    @Inject(APP_CONFIG) private config) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.validNotationTypes = '.bpmn';
      if(params['isShowConformance'] != 'true')
        this.validNotationTypes += ', .cmmn, .dmn';
    });
    this.userRoles = localStorage.getItem("userRole")
    this.freetrail=localStorage.getItem('freetrail')
  }
  ngAfterViewChecked() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.isShowConformance = params['isShowConformance'] == 'true';
    });
    this.cdRef.detectChanges();
  }

  onSelect(e){
    this.slideUp();
    this.hideEditor=false;
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      this.uploaded_file = e.addedFiles[0];
      this.uploadedFileName = this.uploaded_file.name;
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper notation.";
      this.global.notify(message,"error");
    }
  }

  slideUp(){
    if (this.freetrail == 'true') {
      if (this.bpmn_list.length == this.config.bpsprocessfreetraillimit) {
        // Swal.fire("Error","You have limited access to this product. Please contact EZFlow support team for more details.","error");
        Swal.fire({
          title: 'Error',
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          heightAuto: false,
          confirmButtonText: 'Ok'
        })
      }
      else {
        this.uploaded_file = null;
        var modal = document.getElementById('myModal');
        modal.style.display = "block";
      }
    }
    else {
      this.uploaded_file = null;
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
    }
  }

  uploadCreateBpmn(e){
    this.randomId = UUID.UUID();
    this.create_editor=false;
    this.bpmnModel.bpmnProcessName=e.processName;
    this.bpmnModel.ntype=e.ntype;
    this.bpmnModel.bpmnModelId=this.randomId;
    this.bpmnModel['processOwner']=e.processOwner;
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
   // diagramModel.createdTimestamp = new Date();
   // diagramModel.modifiedTimestamp = new Date();
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
