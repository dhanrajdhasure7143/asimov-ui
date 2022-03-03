import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
  uploadedFiles: any[];

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
    this.dataSource.data = this.vcmData;
    console.log(this.dataSource.data)
    this.treeControl.dataNodes = this.dataSource.data;
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
    console.log(node);
    this.parent = node.parent;
    this.childParent = node.childParent;
    this.title = node.title;
    this.processName;
    this.uniqueId = node.uniqueId;
    this.selectedNode = node
  }
  editLevel3() {
    this.vcmData.filter((e) => e.title === this.parent)[0].children
      .filter(n => n.title === this.childParent)[0].children
      .filter(c => c.title == this.title)[0].children.push(
        {
          level: "L3",
          parent: this.parent,
          title: this.processName,
          description: '',
          processOwner: '',
          type: "Process",
          level2UniqueId: this.selectedNode.uniqueId,
          level1UniqueId: this.selectedNode.level1UniqueId,
          uniqueId: UUID.UUID()
        }
      );
    console.log(this.vcmData);
    this.dataSource.data = null;
    this.dataSource.data = this.vcmData;
    setTimeout(() => {
      this.treeControl.dataNodes = this.dataSource.data;
    }, 200);
    this.parent = '';
    this.childParent = '';
    this.title = '';
    this.uniqueId = '';
    this.processName = '';
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
  }

  editLevelName(node) {
    console.log(node);
    this.levelNameTitle = node.title;
    this.levelNameChild = node.childParent;
    this.lavelNameParent = node.parent;
    this.levelNameShow = true;
    this.drawer.close();
  }
  editTitle(node) {
    console.log(node);
    console.log(this.vcmData);
    this.levelNameShow = false;
    this.drawer.close();
  }

  openNodeProperties(node) {
    console.log(node);
    this.uploadedFiles=[];
    this.description = node.description;
    this.editTitleName = node.title;
    this.processOwner = node.processOwner;
    this.editLevel = node.level;
    this.editLevelParent = node.parent;
    this.editLevelChild = node.childParent;
    this.uploadedFiles=node.attachments
    this.drawer.open();
  }

  editProcessOwner() {
    if (this.editLevel == 'L1') {
      this.vcmData.filter((e) => e.title === this.editLevelParent)[0].children
        .filter(n => n.title === this.editTitleName)[0].processOwner = this.processOwner;
    }
    if (this.editLevel == 'L2') {
      this.vcmData.filter((e) => e.title === this.editLevelParent)[0].children
        .filter(n => n.title === this.editLevelChild)[0].children
        .filter(t=>t.title == this.editTitleName)[0].processOwner = this.processOwner;
    }
    console.log(this.vcmData);
  }

  editDescription() {
    if (this.editLevel == 'L1') {
      this.vcmData.filter((e) => e.title === this.editLevelParent)[0].children
        .filter(n => n.title === this.editTitleName)[0].description = this.description;
    }
    if (this.editLevel == 'L2') {
      this.vcmData.filter((e) => e.title === this.editLevelParent)[0].children
        .filter(n => n.title === this.editLevelChild)[0].children
        .filter(t=>t.title == this.editTitleName)[0].description = this.description;
    }
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

}
