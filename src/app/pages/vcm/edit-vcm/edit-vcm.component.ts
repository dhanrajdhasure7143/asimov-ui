import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
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
  @Input() vcmData: any;
  @Input() res_data: any;
  @Output() viewVcm = new EventEmitter<any>()

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  vcmProcess: any;
  vcm_id: any;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  overlay_data = { "type": "create", "module": "bps", "ntype": "dmn" };
  randomId: string; bpmnModel: BpmnModel = new BpmnModel();
  processOwners_list: any;
  parent: any;
  childParent: any;
  title: any;
  processName: any;
  uniqueId: any;
  selectedNode: any;
  @ViewChild('pop2', { static: false }) pop2;
  levelNameShow: boolean;
  levelNameTitle: any;
  levelNameChild: any;
  lavelNameParent: any;
  description: any;
  editTitleName: any;
  processOwner: any;
  editLevel: any;
  editLevelParent: any;
  editLevelChild: any;
  attachments: any[];
  isViewProperties = false;
  isShow = false;
  node_data: any[];
  isLoading:boolean=false;
  vcm_data: any;
  edit:any;
  selectedVcmName: any;
  isShowInput:boolean=true;
  uniqueId1: any;
  edited_Object:any=[]
  l1UniqueId: any;
  vprocess_name:any;

  constructor(private router: Router, private bpmnservice: SharebpmndiagramService, private rest_api: RestApiService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(res => {
      this.vcm_id = res.id
    });
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
  ngOnInit(): void {
    this.getProcessOwnersList();
  }

  ngOnChanges() {
    console.log(this.vcmData);
    console.log("responseData",this.res_data)
    this.dataSource.data = this.vcmData;
    this.treeControl.dataNodes = this.dataSource.data;
    this.vprocess_name=this.res_data.vcmName
    // this.treeControl.expand(this.treeControl.dataNodes[0]);
    // this.treeControl.expand(this.treeControl.dataNodes[1]);
    // this.treeControl.expand(this.treeControl.dataNodes[2]);
    this.treeControl.expandAll();
  }

  navigateToNoytation(v) {
    console.log(v)
    let pathValues = v.bpsId + "&ver=0&ntype=" + v.ntype
    this.router.navigateByUrl('/pages/businessProcess/uploadProcessModel?bpsId=' + pathValues);
    // http://localhost:4300/#/pages/businessProcess/uploadProcessModel?bpsId=5831e9ea-2fcf-af70-a460-7c9623cba4bd&ver=0&ntype=bpmn
  }

  onCreateBpmn() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    this.overlay_data = { "type": "create", "module": "bps", "ntype": "bpmn" };
  }

  onCreateDmn() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    this.overlay_data = { "type": "create", "module": "bps", "ntype": "dmn" };
  }

  uploadCreateBpmn(e) {
    console.log(e)
    this.randomId = UUID.UUID();
    // this.create_editor=false;
    this.bpmnModel.bpmnProcessName = e.processName;
    this.bpmnModel.ntype = e.ntype;
    this.bpmnModel.bpmnModelId = this.randomId;
    this.bpmnModel['processOwner'] = e.processOwner;
    this.bpmnModel['processOwnerName'] = e.processOwnerName;
    this.bpmnservice.setSelectedBPMNModelId(this.randomId);
    this.bpmnModel.category = e.categoryName;
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
    this.rest_api.getBPMNFileContent("assets/resources/newDiagram." + e.ntype).subscribe(res => {
      let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
      this.bpmnservice.uploadBpmn(encrypted_bpmn);
      this.bpmnModel.bpmnXmlNotation = encrypted_bpmn;
      this.initialSave(this.bpmnModel, "create");
    });
    // }
  }

  initialSave(diagramModel: BpmnModel, target: string) {
    let message;
    // diagramModel.createdTimestamp = new Date();
    // diagramModel.modifiedTimestamp = new Date();
    this.rest_api.saveBPMNprocessinfofromtemp(diagramModel).subscribe(res => {
      console.log(res)
      // if(res['errorCode']!="2005"){
      //   let isBPSHome = this.router.url == "/pages/businessProcess/home";

      // this.update.emit(true);

      if (target == "create") {
        this.router.navigateByUrl('/pages/businessProcess/createDiagram');
      }
      if (target == "upload") {
        this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { isShowConformance: false } });
      }

    });
  }


  closeOverlay() {
    this.drawer.close();
  }

  async getProcessOwnersList() {
    let roles = { "roleNames": ["Process Owner"] }
    await this.rest_api.getmultipleApproverforusers(roles).subscribe(res => {
      if (Array.isArray(res))
        this.processOwners_list = res;
    });
  }

  onUploadNotation() {

  }

  addLevel(node) {
    this.parent = node.parent;
    this.childParent = node.childParent;
    this.title = node.title;
    this.processName;
    this.uniqueId = node.uniqueId;
    this.selectedNode = node
  }

  editLevel3() {
    console.log("vcmData",this.vcmData);
    console.log("this.selectedNode",this.selectedNode)
    this.uniqueId=UUID.UUID();
    this.isShowInput=false

    this.vcmData.filter((e) => e.title === this.parent)[0].children
      .filter(n => n.uniqueId === this.selectedNode.level1UniqueId)[0].children
      .filter(n => n.uniqueId === this.selectedNode.uniqueId)[0]["children"].
      push({
          level: "L3",
          parent: this.parent,
          title: this.processName,
          description: '',
          processOwner: '',
          type: "Process",
          level2UniqueId: this.selectedNode.uniqueId,
          level1UniqueId: this.selectedNode.level1UniqueId,
          uniqueId: UUID.UUID(),
          attachments:[]
        }
      );
    console.log("vcmData",this.vcmData);
    // this.uniqueId=null;

    setTimeout(() => {
      this.dataSource.data = null;
      this.dataSource.data = this.vcmData;
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll()
    }, 200);
  }
  onSelectedNode(node) {
    console.log(node);
    this.selectedNode = node
  }

  onCreateLevel3() {
    this.parent = this.selectedNode.parent;
    this.childParent = this.selectedNode.childParent;
    this.title = this.selectedNode.title;
    this.uniqueId = this.selectedNode.uniqueId;
    console.log(this.selectedNode)
  }

  onCreateLevel1(node) {
    console.log(node)

    this.l1UniqueId = node.uniqueId;
    this.uniqueId = node.uniqueId;

  }

  editLevelName(node) {
    console.log(node);
    // this.levelNameTitle = node.title;
    // this.levelNameChild = node.childParent;
    // this.lavelNameParent = node.parent;
    this.uniqueId1 = node.uniqueId;
    // this.levelNameShow = true;
    this.drawer.close();
  }
  editLevelName2(){
    console.log("test2")
  }
  editLevelName3(){
    console.log("test2")
  }
  editTitle(node) {
    console.log(node);
    this.uniqueId1 = null;
    console.log(this.vcmData);
    this.levelNameShow = false;
    this.drawer.close();
  }

  openNodeProperties(node) {
    console.log(node);
    // this.getAttachements(node);
    this.description = node.description;
    this.editTitleName = node.title;
    this.processOwner = node.processOwner;
    this.editLevel = node.level;
    this.editLevelParent = node.parent;
    this.editLevelChild = node.childParent;
    this.drawer.open();
  }

  editProcessOwner() {
    console.log(this.vcmData);
    console.log(this.editLevelParent);
    this.vcmData.filter((e) => e.parent === this.editLevelParent && e.title == this.editTitleName)
    [0].processOwner = this.processOwner;
    // if (this.editLevel == 'L1') {
    //   this.vcmData.filter((e) => e.parent === this.editLevelParent && e.title == this.editTitleName)
    //   [0].processOwner = this.processOwner;
    //   // [0].children
    //   //   .filter(n => n.title === this.editTitleName)[0].processOwner = this.processOwner;
    // }
    // if (this.editLevel == 'L2') {
    //   this.vcmData.filter((e) => e.parent === this.editLevelParent && e.title == this.editTitleName)
    //   [0].processOwner 
    //     // .filter(n => n.title === this.editLevelChild)[0].children
    //     // .filter(t=>t.title == this.editTitleName)[0].processOwner = this.processOwner;
    // }
    console.log(this.vcmData);
  }

  editDescription() {
    this.vcmData.filter((e) => e.parent === this.editLevelParent && e.title == this.editTitleName)
    [0].description = this.description;
    // if (this.editLevel == 'L1') {
    //   this.vcmData.filter((e) => e.title === this.editLevelParent)[0].children
    //     .filter(n => n.title === this.editTitleName)[0].description = this.description;
    // }
    // if (this.editLevel == 'L2') {
    //   this.vcmData.filter((e) => e.title === this.editLevelParent)[0].children
    //     .filter(n => n.title === this.editLevelChild)[0].children
    //     .filter(t=>t.title == this.editTitleName)[0].description = this.description;
    // }
    console.log(this.vcmData);
  }

  RemoveFile(file, i: number) {
    // this.fileName.splice(i, 1);
    console.log(file, i);
    console.log(this.editLevelParent , this.editTitleName);
    if (this.editLevel == 'L1') {
      this.vcmData.filter((e) => e.name === this.editLevelParent)[0].children
        .filter(n => n.title === this.editTitleName)[0].attachments.splice(i, 1);
    }
    else {
      this.vcmData.filter((e) => e.name === this.editLevelParent)[0].children
        .filter(n => n.title === this.editLevelChild)[0].children.filter(c => c.title === this.editTitleName)[0]
        .attachments.splice(i, 1);
    }
  }

  viewProperties(node){
    console.log(this.vcmData);
    console.log(node);
    this.node_data = [];
    this.vcm_data["mainParent"] = node.title
    this.vcmData.forEach(element => {
      if (element.parent == node.title) {
        this.node_data.push(element)
      }
    });
    console.log(this.node_data);
    
    this.isViewProperties = true;
    this.isShow = false;
    this.edit = 'edit';
  }

  backToView(){
    this.isShow=false;
    this.isViewProperties=false;
  }

  getselectedVcm(){
    this.isLoading=true;
    let res_data
    this.rest_api.getselectedVcmById(this.vcm_id).subscribe(res=>{res_data=res
      this.isLoading=false;
      console.log(res);

      if(res){
      this.vcm_data=res_data
      this.vcmData=res_data.data.vcmV2;
      this.selectedVcmName=res_data.data.vcmName
      // this.vcmData=this.vcmData1
      this.dataMappingToTreeStructer1();
      }
    })
  }

  dataMappingToTreeStructer1(){
    let objData = [
      { title: "Management Process","children":[]},
      { title: "Core Process","children":[]},
      { title: "Support Process","children":[]}
    ]

    this.vcmData.forEach(e=>{
      objData.forEach(e1=>{
        if(e.level == "L1"){
          if(e.parent == e1.title){
            e1["children"].push(e);
          }
        }
      })
    })
    console.log(objData)

    this.vcmData.forEach(e=>{
      objData.forEach(e1=>{
        if(e.level == "L2"){
          if(e.parent == e1.title){
            e1.children.forEach(e2=>{
              if(e2.uniqueId == e.level1UniqueId ){
                e2['children'].push(e);
              }
            })
          }
        }
      })
    })

    this.vcmData.forEach(e=>{
      objData.forEach(e1=>{
        if(e.level == "L3"){
          if(e.parent == e1.title){
            e1.children.forEach(e2=>{
              if(e2.title == e.childParent ){
                e2.children.forEach(e3 => {
                  if(e3.uniqueId == e.level2UniqueId ){
                    e3['children'].push(e)
                  }
                });
              }
            })
          }
        }
      })
    })
    console.log(objData)
    // this.vcmProcess = this.dataSource.data;
    this.vcmProcess = objData;
    this.dataSource.data=objData;
    this.treeControl.dataNodes = this.dataSource.data; 
    this.treeControl.expand(this.treeControl.dataNodes[0]);
    this.treeControl.expand(this.treeControl.dataNodes[1]);
    this.treeControl.expand(this.treeControl.dataNodes[2]);
    this.treeControl.expandAll();
    // this.tree.treeControl.expandAll();
  }


//   getAttachements(node_obj){
//     // this.isLoading=true;
//     console.log(node_obj);
//     let reqBody={
//       "masterId": this.vcmData.data.id,
//       "parent": node_obj.parent
//     }
//     let res_data
//     this.attachments=[];
//   this.rest_api.getvcmAttachements(reqBody).subscribe(res=>{res_data=res
//     console.log(res)
//     res_data.data.forEach(element => {
//       if(element.uniqueId== node_obj.uniqueId){
//         this.attachments.push(element)
//       }
//     });
//     // this.isLoading=false;
//   })
// }

addL1Nodes(node){
  console.log(node)
  console.log(this.vcmData);
  this.uniqueId=UUID.UUID();

  this.vcmData.filter((e) => e.title === node.parent)[0].children
    .filter(n => n.uniqueId === node.uniqueId)[0].children.
    push({
        level: "L2",
        parent: node.parent,
        title: this.processName,
        description: '',
        processOwner: '',
        type: "Process",
        level1UniqueId: node.uniqueId,
        uniqueId: UUID.UUID(),
        attachments:[],
        children:[]
      }
    );
  console.log("vcmData",this.vcmData);
  setTimeout(() => {
    this.dataSource.data = null;
    this.dataSource.data = this.vcmData;
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.expandAll();
    this.processName='';
  }, 200);
}

addL3Nodes(){
console.log("vcmData",this.vcmData);
    console.log("this.selectedNode",this.selectedNode)
    this.uniqueId=UUID.UUID();
    this.isShowInput=false

    this.vcmData.filter((e) => e.title === this.parent)[0].children
      .filter(n => n.uniqueId === this.selectedNode.level1UniqueId)[0].children
      .filter(n => n.uniqueId === this.selectedNode.uniqueId)[0]["children"].
      push({
          level: "L3",
          parent: this.parent,
          title: this.processName,
          description: '',
          processOwner: '',
          type: "Process",
          level2UniqueId: this.selectedNode.uniqueId,
          level1UniqueId: this.selectedNode.level1UniqueId,
          uniqueId: UUID.UUID(),
          attachments:[]
        }
      );
    console.log("vcmData",this.vcmData);
    // this.uniqueId=null;

    setTimeout(() => {
      this.dataSource.data = null;
      this.dataSource.data = this.vcmData;
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll()
    }, 100);
}

backToViewVcm(){
  this.viewVcm.emit(true);
}

}
