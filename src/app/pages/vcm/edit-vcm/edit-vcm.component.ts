import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { MatTreeNestedDataSource  } from '@angular/material';
import { MatTree } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { SharebpmndiagramService } from './../../../pages/services/sharebpmndiagram.service';
import { UUID } from 'angular2-uuid';
import { BpmnModel } from './../../../pages/business-process/model/bpmn-autosave-model';
import Swal from 'sweetalert2';
import { APP_CONFIG } from 'src/app/app.config';
import { RestApiService } from '../../services/rest-api.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-edit-vcm',
  templateUrl: './edit-vcm.component.html',
  styleUrls: ['./edit-vcm.component.css']
})
export class EditVcmComponent implements OnInit {
  @Input() vcmData:any;
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  vcmProcess:any;
  vcm_id:any;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  overlay_data={"type":"create","module":"bps","ntype":"dmn"};
  randomId: string;bpmnModel:BpmnModel = new BpmnModel();
  processOwners_list:any;

  constructor(private router: Router,private bpmnservice:SharebpmndiagramService,private rest_api: RestApiService,
    private route : ActivatedRoute) {
    this.route.queryParams.subscribe(res => {
      this.vcm_id = res.id
    });
   }
   
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
  ngOnInit(): void {
    this.getProcessOwnersList();
  }

  ngOnChanges(){

    this.dataSource.data=this.vcmData;
    console.log(this.dataSource.data)
    this.treeControl.dataNodes = this.dataSource.data; 
    this.treeControl.expand(this.treeControl.dataNodes[0]);
    this.treeControl.expand(this.treeControl.dataNodes[1]);
    this.treeControl.expand(this.treeControl.dataNodes[2]);
  }

  navigateToNoytation(v){
    console.log(v)
    let pathValues=v.bpsId+"&ver=0&ntype="+v.ntype
    this.router.navigateByUrl('/pages/businessProcess/uploadProcessModel?bpsId='+pathValues);
// http://localhost:4300/#/pages/businessProcess/uploadProcessModel?bpsId=5831e9ea-2fcf-af70-a460-7c9623cba4bd&ver=0&ntype=bpmn
  }

  onCreateBpmn(){
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    this.overlay_data={"type":"create","module":"bps","ntype":"bpmn"};
  }

  onCreateDmn(){
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    this.overlay_data={"type":"create","module":"bps","ntype":"dmn"};
  }

  uploadCreateBpmn(e){
    console.log(e)
    this.randomId = UUID.UUID();
    // this.create_editor=false;
    this.bpmnModel.bpmnProcessName=e.processName;
    this.bpmnModel.ntype=e.ntype;
    this.bpmnModel.bpmnModelId=this.randomId;
    this.bpmnModel['processOwner']=e.processOwner;
    this.bpmnModel['processOwnerName']=e.processOwnerName;
    this.bpmnservice.setSelectedBPMNModelId(this.randomId);
    this.bpmnModel.category=e.categoryName;
    // if(this.uploaded_file){
      // var myReader: FileReader = new FileReader();
      // myReader.onloadend = (ev) => {
      //   let fileString:string = myReader.result.toString();
      //   let encrypted_bpmn = btoa(unescape(encodeURIComponent(fileString)));
      //   if( this.router.url.indexOf("uploadProcessModel") > -1 ){
      //     this.bpmnservice.changeConfNav(true);
      //   }else{
      //     this.bpmnservice.changeConfNav(false);
      //     this.bpmnservice.uploadBpmn(encrypted_bpmn);
      //   }
      //   this.bpmnModel.bpmnXmlNotation = encrypted_bpmn;
      //   this.initialSave(this.bpmnModel, "upload");
      // };
      // myReader.readAsText(this.uploaded_file);
    // }else{
      this.bpmnservice.changeConfNav(false);
      this.rest_api.getBPMNFileContent("assets/resources/newDiagram."+e.ntype).subscribe(res => {
        let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
        this.bpmnservice.uploadBpmn(encrypted_bpmn);
        this.bpmnModel.bpmnXmlNotation=encrypted_bpmn;
        this.initialSave(this.bpmnModel, "create");
      });
    // }
  }

  initialSave(diagramModel:BpmnModel, target:string){
    let message;
   // diagramModel.createdTimestamp = new Date();
   // diagramModel.modifiedTimestamp = new Date();
    this.rest_api.saveBPMNprocessinfofromtemp(diagramModel).subscribe(res=>{
      console.log(res)
      // if(res['errorCode']!="2005"){
      //   let isBPSHome = this.router.url == "/pages/businessProcess/home";
  
          // this.update.emit(true);
  
          if(target == "create"){
              this.router.navigateByUrl('/pages/businessProcess/createDiagram');
          }
          if(target == "upload"){
              this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: false}});
          }

    });
  }

  
  viewProperties(){
    this.drawer.open();
  }

  closeOverlay(){
    this.drawer.close();
  }
  
  async getProcessOwnersList(){
    let roles={"roleNames": ["Process Owner"]}
    await this.rest_api.getmultipleApproverforusers(roles).subscribe( res =>  {
     if(Array.isArray(res))
       this.processOwners_list = res;
   });
  }

}
