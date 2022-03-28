import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { MatTree } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
// import { SharebpmndiagramService } from './pages/services/sharebpmndiagram.service';
import { SharebpmndiagramService } from './../../../pages/services/sharebpmndiagram.service';
// import { GlobalScript } from '../global-script';
import { UUID } from 'angular2-uuid';
import { BpmnModel } from './../../../pages/business-process/model/bpmn-autosave-model';
import Swal from 'sweetalert2';
import { APP_CONFIG } from 'src/app/app.config';
import { RestApiService } from '../../services/rest-api.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DataTransferService } from '../../services/data-transfer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

let TREE_DATA: any[] = [
  {
    name: 'Management Process',
    children: []
  },
  {
    name: 'Core Process',
    children: []
  },
  {
    name: 'Support Process',
    children: []
  },
  {
    vcmname: ''
  }
];

@Component({
  selector: 'app-vcm-structure',
  templateUrl: './vcm-structure.component.html',
  styleUrls: ['./vcm-structure.component.css']
})
export class VcmStructureComponent implements OnInit {
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  vcmTreeData: any;
  vcm_id: any;
  isLoading: boolean = false;
  vcmData: any[] = [];
  expandTree = false;
  @ViewChild('tree', { static: false }) tree;
  isShow: boolean = false;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  @ViewChild('vcmTitle', { static: false }) vcmTitleEdit: ElementRef;
  processOwners_list: any = [];
  uploadedDocuments: any = [];
  vcm_data: any;
  selectedVcmName: any;
  processName: any;
  processName1: any;
  processOwner: any;
  processDesc: any;
  listOfAttachemnts: any = [];
  isPropDisabled: boolean = true;
  isViewProperties: boolean = false;
  node_data: any = [];
  nodeParent: any = "";
  uniqueId1: any;
  uniqueId: any;
  l1UniqueId: any;
  overlay_data = { "type": "create", "module": "bps", "ntype": "dmn" };
  randomId: string;
  bpmnModel: BpmnModel = new BpmnModel();
  selectedNode: any;
  nodeParent1: any;
  l1processName: any;
  uploaded_file: any;
  uploadedFileName: any;
  validNotationTypes = '.bpmn,.dmn'
  notationType: any;
  editVcmTitle: boolean = false;
  selectedPropNode:any={level:"L1"}
  isOpenedState=1;
  propType:any;
  listOfFiles:any=[];
  uploadFilemodalref: BsModalRef;
  attachementsList=[];

  constructor(private router: Router, private bpmnservice: SharebpmndiagramService,
    private rest_api: RestApiService,
    private route: ActivatedRoute,
    private dt: DataTransferService,
    private modalService: BsModalService) {
    this.route.queryParams.subscribe(res => {
      this.vcm_id = res.id
    });
  }

  ngOnInit(): void {
    this.treeControl.dataNodes = this.dataSource.data;
    this.getselectedVcm();
    this.getProcessOwnersList();
  }
  // ngAfterViewInit() {

  // }


  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  editVcm() {
    this.isShow = true;
  }


  getselectedVcm() {
    this.isLoading = true;
    let res_data
    this.rest_api.getselectedVcmById(this.vcm_id).subscribe(res => {
      res_data = res
      this.isLoading = false;

      if (res) {
        this.vcm_data = res_data
        this.vcmData = res_data.data.vcmV2;
        this.selectedVcmName = res_data.data.vcmName
        // this.vcmData.map(item => {item.xpandStatus = false;return item;})
        this.vcmData.forEach(ele=>{
          if(ele.level == "L1"){
            ele["xpandStatus"] = false;
          }
          if(ele.level == "L2"){
            ele["xpandStatus1"] = false;
          }
        })
        // this.vcmData=this.vcmData1
        this.dataMappingToTreeStructer();
      }
    })
  }

  dataMappingToTreeStructer() {
    let objData = [
      { title: "Management Process", "children": [] },
      { title: "Core Process", "children": [] },
      { title: "Support Process", "children": [] }
    ]

    this.vcmData.forEach(e => {
      objData.forEach(e1 => {
        if (e.level == "L1") {
          if (e.parent == e1.title) {
            e1["children"].push(e);
          }
        }
      })
    })

    this.vcmData.forEach(e => {
      objData.forEach(e1 => {
        if (e.level == "L2") {
          if (e.parent == e1.title) {
            e1.children.forEach(e2 => {
              if (e2.uniqueId == e.level1UniqueId) {
                e2['children'].push(e);
              }
            })
          }
        }
      })
    })

    this.vcmData.forEach(e => {
      objData.forEach(e1 => {
        if (e.level == "L3") {
          if (e.parent == e1.title) {
            e1.children.forEach(e2 => {
              if (e2.uniqueId == e.level1UniqueId) {
                e2.children.forEach(e3 => {
                  if (e3.uniqueId == e.level2UniqueId) {
                    e3['children'].push(e)
                  }
                });
              }
            })
          }
        }
      })
    })
    // this.vcmTreeData = this.dataSource.data;
    this.vcmTreeData = objData;
    this.dataSource.data = objData;
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.expand(this.treeControl.dataNodes[0]);
    this.treeControl.expand(this.treeControl.dataNodes[1]);
    this.treeControl.expand(this.treeControl.dataNodes[2]);
    // this.treeControl.expandAll();
    // this.tree.treeControl.expandAll();
  }

  collapse() {
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.collapseAll();
    this.expandTree = true;
  }
  expand() {
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.expandAll();
    this.tree.treeControl.expandAll();
    this.expandTree = false;
  }

  viewProperties(node) {
    this.node_data = [];
    if (node == 'all') {
      this.propType="Consolidated"
      this.vcmData.forEach(element => {
        this.node_data.push(element)
      });

      this.isViewProperties = true;
      this.isShow = false;
      let params1 = { "id": this.vcm_id, "vcmLevel": "all" };

      this.router.navigate([], { relativeTo: this.route, queryParams: params1 });
    } else {
      this.propType=node.title
      this.node_data = [];
      this.vcm_data["mainParent"] = node.title
      this.vcmData.forEach(element => {
        if (element.parent == node.title) {
          this.node_data.push(element)
        }
      });
      let params1 = { "id": this.vcm_id, "vcmLevel": node.title };

      this.router.navigate([], { relativeTo: this.route, queryParams: params1 });
      this.isViewProperties = true;
      this.isShow = false;
    }
  }

  backToView() {
    this.isShow = false;
    this.isViewProperties = false;
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


  getAttachements(node_obj) {
    // this.isLoading=true;
    let reqBody = {
      "masterId": this.vcm_data.data.id,
      "parent": node_obj.parent
    }
    let res_data
    this.rest_api.getvcmAttachements(reqBody).subscribe(res => {
      res_data = res
      res_data.data.forEach(element => {
        if (element.uniqueId == node_obj.uniqueId) {
          this.listOfAttachemnts.push(element)
        }
      });
      // this.isLoading=false;
    })
  }

  readVcmValue(value) {
    if (value) {
      this.isShow = false;
      this.isViewProperties = false;
    }
  }

  fullEditVCM() {
    // this.vcmTreeData.forEach(element => {
    //   element["name"]=element.title
    // });

    // let obj={"vName":this.vcm_data.data.vcmName,
    //   "pOwner":this.vcm_data.data.processOwner,
    //   "data":this.vcmTreeData,
    //   "selectedVcm":this.vcm_data}
    // this.dt.vcmDataTransfer(obj);
    this.nodeParent = null;
    this.router.navigate(["/pages/vcm/edit"], { queryParams: { id: this.vcm_id} })
  }
  onSelectedProcessEdit(node) {
    this.isPropDisabled=false;
    this.nodeParent = node.title;
    this.treeControl.expandAll();
  }

  onCreateLevel3() {
    this.uniqueId = this.selectedNode.uniqueId;
  }

  onCreateLevel1(node) {
    this.l1UniqueId = node.uniqueId;
    this.uniqueId = node.uniqueId;
    this.uniqueId1 = null;

  }
  addL2Nodes(node) {
    this.uniqueId = UUID.UUID();

    this.vcmTreeData.filter((e) => e.title === node.parent)[0].children
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
        attachments: [],
        children: []
      }
      );
    setTimeout(() => {
      this.dataSource.data = null;
      this.dataSource.data = this.vcmTreeData;
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll();
      this.processName = '';
    }, 200);
  }

  editLevelName(node) {
    this.uniqueId1 = node.uniqueId;
    this.uniqueId = null;
    this.drawer.close();
  }

  editTitle(node) {
    this.uniqueId1 = null;
    this.drawer.close();
  }

  onSelectedNode(node) {
    this.selectedNode = node;
  }

  addL3Nodes() {
    this.uniqueId = UUID.UUID();

    this.vcmTreeData.filter((e) => e.title === this.selectedNode.parent)[0].children
      .filter(n => n.uniqueId === this.selectedNode.level1UniqueId)[0].children
      .filter(n => n.uniqueId === this.selectedNode.uniqueId)[0]["children"].
      push({
        "level": "L3",
        "parent": this.selectedNode.parent,
        "title": this.processName,
        "description": '',
        "processOwner": '',
        "type": "Process",
        "level2UniqueId": this.selectedNode.uniqueId,
        "level1UniqueId": this.selectedNode.level1UniqueId,
        "uniqueId": UUID.UUID(),
        "attachments": [],
        "bpsId": '',
        "ntype": ''
      }
      );
    setTimeout(() => {
      this.dataSource.data = null;
      this.dataSource.data = this.vcmTreeData;
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll();
      this.processName = '';
      this.uniqueId = '';
    }, 100);
  }
  viewTotalProperties() {

  }

  createLevel1(node) {
    this.nodeParent1 = node.title
  }

  addL1Nodes(node) {
    this.vcmTreeData.filter((e) => e.title === node.title)[0].children
      .push({
        type: "Process",
        level: "L1",
        parent: node.title,
        title: this.l1processName,
        description: '',
        processOwner: '',
        uniqueId: UUID.UUID(),
        attachments: [],
        children: []
      }
      );
    this.nodeParent1 = null;
    this.l1processName = '';
    setTimeout(() => {
      this.dataSource.data = null;
      this.dataSource.data = this.vcmTreeData;
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll();
      this.processName = '';
    }, 100);
  }

  getreqBody() {
    let treeData = [];
    let treeData1 = [];
    let treeData2 = [];
    let treeData3 = [];
    this.vcmTreeData.forEach(ele => {
      ele.children.forEach(e => {
        treeData.push(e)
        treeData1.push(e)
      })
    })
    treeData1.forEach(element => {
      element.children.forEach(e => {
        treeData.push(e)
        treeData2.push(e)
      })
    });

    treeData2.forEach(e => {
      e.children.forEach(ele => {
        treeData.push(ele);
        treeData3.push(ele)
      })
    })
    let treeData4 = []
    treeData.forEach(e => {
      let obj = {
        "type": e.type,
        "uniqueId": e.uniqueId,
        "processOwner": e.processOwner,
        "description": e.description,
        "level": e.level,
        "title": e.title,
        "parent": e.parent,
        "children": [],
        "attachments": e.attachments,
      }
      if (e.level1UniqueId) {
        obj["level1UniqueId"] = e.level1UniqueId
      }
      if (e.level2UniqueId) {
        obj["level2UniqueId"] = e.level2UniqueId
      }
      if (e.level == "L3") {
        obj["bpsId"] = e.bpsId
      }
      if (e.level == "L3") {
        obj["ntype"] = e.ntype
      }
      treeData4.push(obj)
    })
    let req_body = {
      "id": this.vcm_data.data.id,
      "vcmuniqueId": this.vcm_data.data.vcmuniqueId,
      "vcmName": this.selectedVcmName,
      "processOwner": this.vcm_data.data.processOwner,
      "active": true,
      "createdBy": this.vcm_data.data.createdBy,
      "createdTimestamp": this.vcm_data.data.createdTimestamp,
      "convertedCreatedTime": 0,
      "convertedModifiedTime": 0,
      "vcmV2": treeData4
    }
    return req_body
  }

  updateVcm() {
    this.cancelEdit();
    let req_body = this.getreqBody();
    this.isLoading = true;
    this.rest_api.updateVcm(req_body).subscribe(res => {
      this.isPropDisabled=false;
      Swal.fire({
        title: 'Success',
        text: "Updated Successfully !!",
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        heightAuto: false,
      });
      this.nodeParent = null;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        heightAuto: false,
      });
    })
  }

  cancelEdit() {
    this.nodeParent = null;
    this.nodeParent1=null;
    this.isPropDisabled=true;
    this.uniqueId1=null;
    this.uniqueId=null;
    this.selectedPropNode={}
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

  saveVCMForBpmn(e) {
    this.randomId = UUID.UUID()
    if(this.selectedNode.level == "L2"){
    this.vcmTreeData.filter((e) => e.title === this.selectedNode.parent)[0].children
      .filter(n => n.uniqueId === this.selectedNode.level1UniqueId)[0].children.
      push({
        "level": "L3",
        "parent": this.selectedNode.parent,
        "title": e.processName,
        "description": '',
        "processOwner": '',
        "type": "Process",
        "level1UniqueId": this.selectedNode.level1UniqueId,
        "uniqueId": UUID.UUID(),
        "attachments": [],
        "bpsId": this.randomId,
        "ntype": e.ntype,
        "children": [],
      }
      );
    }
    if(this.selectedNode.level == "L3"){
      this.vcmTreeData.filter((e) => e.title === this.selectedNode.parent)[0].children
        .filter(n => n.uniqueId === this.selectedNode.level1UniqueId)[0].children
        .filter(n => n.uniqueId === this.selectedNode.level2UniqueId)[0]["children"].
        push({
          "level": "L3",
          "parent": this.selectedNode.parent,
          "title": e.processName,
          "description": '',
          "processOwner": '',
          "type": "Process",
          "level2UniqueId": this.selectedNode.level2UniqueId,
          "level1UniqueId": this.selectedNode.level1UniqueId,
          "uniqueId": UUID.UUID(),
          "attachments": [],
          "bpsId": this.randomId,
          "ntype": e.ntype,
          "children": []
        }
        );
      }
    let req_body = this.getreqBody();
    this.isLoading = true;
    this.rest_api.updateVcm(req_body).subscribe(res => {
      this.uploadCreateBpmn(e)
      this.nodeParent = null;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        heightAuto: false,
      });
    })
  }

  uploadCreateBpmn(e) {
    // this.create_editor=false;
    this.bpmnModel.bpmnProcessName = e.processName;
    this.bpmnModel.ntype = e.ntype;
    this.bpmnModel.bpmnModelId = this.randomId;
    this.bpmnModel['processOwner'] = e.processOwner;
    this.bpmnModel['processOwnerName'] = e.processOwnerName;
    this.bpmnservice.setSelectedBPMNModelId(this.randomId);
    this.bpmnModel.category = e.categoryName;
    if (this.uploaded_file) {
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (ev) => {
        let fileString: string = myReader.result.toString();
        let encrypted_bpmn = btoa(unescape(encodeURIComponent(fileString)));
        if (this.router.url.indexOf("uploadProcessModel") > -1) {
          this.bpmnservice.changeConfNav(true);
        } else {
          this.bpmnservice.changeConfNav(false);
          this.bpmnservice.uploadBpmn(encrypted_bpmn);
        }
        this.bpmnModel.bpmnXmlNotation = encrypted_bpmn;
        this.initialSave(this.bpmnModel, "upload");
      };
      myReader.readAsText(this.uploaded_file);
    } else {
      this.bpmnservice.changeConfNav(false);
      this.rest_api.getBPMNFileContent("assets/resources/newDiagram." + e.ntype).subscribe(res => {
        let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
        this.bpmnservice.uploadBpmn(encrypted_bpmn);
        this.bpmnModel.bpmnXmlNotation = encrypted_bpmn;
        this.initialSave(this.bpmnModel, "create");
      });
    }
  }

  initialSave(diagramModel: BpmnModel, target: string) {
    let message;
    // diagramModel.createdTimestamp = new Date();
    // diagramModel.modifiedTimestamp = new Date();
    this.rest_api.saveBPMNprocessinfofromtemp(diagramModel).subscribe(res => {
      // if(res['errorCode']!="2005"){
      //   let isBPSHome = this.router.url == "/pages/businessProcess/home";

      // this.update.emit(true);

      if (target == "create") {
        this.router.navigate(['/pages/businessProcess/createDiagram'], { queryParams: { vcmId: this.vcm_id } });
      }
      if (target == "upload") {
        this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { isShowConformance: false, bpsId: this.randomId, ver: 0, ntype: this.notationType, vcmId: this.vcm_id } });

        // this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { isShowConformance: false } });
      }

    });
  }


  navigateToBpsNotation(node) {
    this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { isShowConformance: false, bpsId: node.bpsId, ver: 0, ntype: node.ntype, vcmId: this.vcm_id } });
  }


  onSelect(e) {
    if (e.addedFiles.length == 1 && e.rejectedFiles.length == 0) {
      this.uploaded_file = e.addedFiles[0];
      this.uploadedFileName = this.uploaded_file.name;
      let uploadedFileSplit = this.uploadedFileName.split('.');
      let uploadedFileExtension = uploadedFileSplit[uploadedFileSplit.length - 1];
      this.notationType = uploadedFileExtension;
      this.slideUp(this.notationType)
    } else {
      let message = "Oops! Something went wrong";
      if (e.rejectedFiles[0].reason == "type")
        message = "Please upload proper notation.";
      // this.global.notify(message,"error");
    }
  }

  slideUp(notationType) {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    this.overlay_data = { "type": "create", "module": "bps", "ntype": notationType };
  }

  editVcmName(){
    this.editVcmTitle = true;
    // this.vcmTitleEdit.nativeElement.focus();
  }
  submitVcmTitle(){
    this.editVcmTitle = false;
  }

  
  openNodeProperties(node) {
    this.attachementsList=[]
    this.selectedPropNode=node
    // this.getAttachements(node);attachments
    // this.processName = node.title;
    this.processName1 = node.title;
    this.processOwner = node.processOwner;
    this.processDesc = node.description;
    this.drawer.open();
    if(node.attachments){
      this.listOfAttachemnts=node.attachments
    }else{
      this.listOfAttachemnts=[]
    }
  }

  saveProperties(val){
    if(val=="L1"){
      this.vcmTreeData.filter((e) => e.title === this.selectedPropNode.parent)[0].children
        .filter(n => n.title === this.selectedPropNode.title)[0].description = this.processDesc;
      this.vcmTreeData.filter((e) => e.title === this.selectedPropNode.parent)[0].children
        .filter(n => n.title === this.selectedPropNode.title)[0].processOwner = this.processOwner;
    }

    if(val=="L2"){
      this.vcmTreeData.filter((e) => e.title ===this.selectedPropNode.parent)[0].children
      .filter(n => n.uniqueId === this.selectedPropNode.level1UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedPropNode.uniqueId)[0]
      .description = this.processDesc;
      this.vcmTreeData.filter((e) => e.title === this.selectedPropNode.parent)[0].children
      .filter(n => n.uniqueId === this.selectedPropNode.level1UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedPropNode.uniqueId)[0]
      .processOwner = this.processOwner;
    }

    if(val=="L3"){
      this.vcmTreeData.filter((e) => e.title === this.selectedPropNode.parent)[0].children
      .filter(n => n.uniqueId === this.selectedPropNode.level1UniqueId)[0].children
      .filter(n => n.uniqueId === this.selectedPropNode.level2UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedPropNode.uniqueId)[0]
      .description = this.processDesc;
      this.vcmTreeData.filter((e) => e.title === this.selectedPropNode.parent)[0].children
      .filter(n => n.uniqueId === this.selectedPropNode.level1UniqueId)[0].children
      .filter(n => n.uniqueId === this.selectedPropNode.level2UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedPropNode.uniqueId)[0]
      .processOwner = this.processOwner;
    }
      this.drawer.close();
  }

  chnagefileUploadForm(e){
    this.listOfFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      let randomId=  UUID.UUID() 
      e.target.files[i]['convertedsize'] = this.convertFileSize(e.target.files[i].size);
      e.target.files[i]['fileName'] =e.target.files[i]['name'];
      e.target.files[i]['uniqueId'] = randomId;
      e.target.files[i]['fileDescription'] = ''
      this.listOfFiles.push(e.target.files[i])
      
    } 
  }

  uploadFilemodalCancel(){
    this.uploadFilemodalref.hide();
  }

  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
  }

   uploadFileModelOpen(template: TemplateRef<any>){
     this.listOfFiles=[];
    this.uploadFilemodalref = this.modalService.show(template,{class:"modal-lr"});
  }

  convertFileSize(e) {
    let divided_size: any = String(e / 1024)
    if (e / 1024 <= 1024) {
      if (divided_size.includes('.')) {
        return divided_size.split('.')[0] + ' KB'
      } else {
        return divided_size + ' KB';
      }
    } else {
      let size1: any = String(divided_size / 1024)
      if (size1.includes('.')) {
        return size1.split('.')[0] + ' MB'
      } else {
        return size1 + ' MB';
      }
    }
  }

  onSubmitUpload(){
    this.attachementsList=[]
    let idsList=[]
    this.listOfFiles.forEach(e=>{
      idsList.push( e.uniqueId)
      let obj={
        name:e.name,
        fileName: e['name'],
        uniqueId : e.uniqueId,
        convertedsize : e['convertedsize'],
        fileDescription: e['fileDescription'],
        size: e['size'],
        lastModifiedDate: e['lastModifiedDate'],
        lastModified: e['fileDescription'],
      }
      this.attachementsList.push(obj)
    })

    let formdata = new FormData()
    for (var i = 0; i < this.listOfFiles.length; i++) {
      formdata.append("file", this.listOfFiles[i]);
    }
    formdata.append("vcmLevel",this.selectedPropNode.level);
    formdata.append("uniqueId",this.selectedPropNode.uniqueId);
    formdata.append("masterId",this.vcm_data.data.id);
    formdata.append("parent",this.selectedPropNode.parent);
    formdata.append("processName",this.selectedPropNode.title);
    formdata.append("vcmuniqueId",this.vcm_data.data.vcmuniqueId);
    formdata.append("fileUniqueIds",JSON.stringify(idsList));

    let res_data
    this.rest_api.uploadVCMPropDocument(formdata).subscribe(res => {res_data=res
      this.attachementsList.forEach(element => {
        this.listOfAttachemnts.push(element)
      });
      // this.onOpenDocuments()
      this.isLoading = false;
      if (this.selectedPropNode.level == 'L1') {
        this.vcmTreeData.filter((e) => e.title === this.selectedPropNode.parent)[0].children
          .filter(n => n.uniqueId === this.selectedPropNode.uniqueId)[0].attachments = this.listOfAttachemnts;
      }

      if (this.selectedPropNode.level == 'L2') {
        this.vcmTreeData.filter((e) => e.title ===this.selectedPropNode.parent)[0].children
        .filter(n => n.uniqueId === this.selectedPropNode.level1UniqueId)[0].children
        .filter(c => c.uniqueId === this.selectedPropNode.uniqueId)[0].attachments = this.listOfAttachemnts;
      }

      if (this.selectedPropNode.level == 'L3') {
        this.vcmTreeData.filter((e) => e.title ===this.selectedPropNode.parent)[0].children
        .filter(n => n.uniqueId === this.selectedPropNode.level1UniqueId)[0].children
        .filter(m => m.uniqueId === this.selectedPropNode.level2UniqueId)[0].children
        .filter(c => c.uniqueId === this.selectedPropNode.uniqueId)[0].attachments = this.listOfAttachemnts;
      }
      // this.updateVcm()
      this.uploadFilemodalCancel();
    },err=>{
      this.isLoading=false;
      Swal.fire({
        title: 'Error',
        text: "File upload failed",
        position: 'center',
        icon: 'error',
        heightAuto: false,
      })

    });
  }

  removeFile(each,index){

    this.isLoading=true;
    let req_body=[{"documentId":each.documentId}]
    this.rest_api.deleteAttachements(req_body).subscribe(res=>{
    this.isLoading=false;
    // this.onOpenDocuments();
    this.listOfAttachemnts.splice(index, 1);
    if (this.selectedPropNode.level == 'L1') {
      this.vcmTreeData.filter((e) => e.title === this.selectedPropNode.parent)[0].children
        .filter(n => n.uniqueId === this.selectedPropNode.uniqueId)[0].attachments = this.listOfAttachemnts;
    }

    if (this.selectedPropNode.level == 'L2') {
      this.vcmTreeData.filter((e) => e.title ===this.selectedPropNode.parent)[0].children
      .filter(n => n.uniqueId === this.selectedPropNode.level1UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedPropNode.uniqueId)[0].attachments = this.listOfAttachemnts;
    }

    if (this.selectedPropNode.level == 'L3') {
      this.vcmTreeData.filter((e) => e.title ===this.selectedPropNode.parent)[0].children
      .filter(n => n.uniqueId === this.selectedPropNode.level1UniqueId)[0].children
      .filter(m => m.uniqueId === this.selectedPropNode.level2UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedPropNode.uniqueId)[0].attachments = this.listOfAttachemnts;
    }
    })
  }

  onOpenDocuments(){
    let res_data:any;
    this.isLoading=true;
    this.listOfAttachemnts=[]
    let request= {"masterId":this.vcm_data.data.id,"uniqueId": this.selectedPropNode.uniqueId}
    this.rest_api.getAttachementsByIndivdualProcess(request).subscribe(res=>{res_data=res
      this.isLoading=false;
      if(res_data){
        this.listOfAttachemnts=res_data.data
      }
        // this.listOfAttachemnts
    })
  }


}

