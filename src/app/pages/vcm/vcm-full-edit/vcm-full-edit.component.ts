import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { MatTree } from '@angular/material/tree';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import Swal from 'sweetalert2';
import { UUID } from 'angular2-uuid';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


let TREE_DATA: any[] = [
  {
    name: 'Management Process',uniqueId:UUID.UUID(),
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
];


@Component({
  selector: 'app-vcm-full-edit',
  templateUrl: './vcm-full-edit.component.html',
  styleUrls: ['./vcm-full-edit.component.css']
})
export class VcmFullEditComponent implements OnInit {
  @ViewChild('tree', { static: false }) tree: MatTree<any>;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;


  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();

  level1process: any;
  addLevel2 = '';
  levelName = 'level1';
  vcmProcess: any[];
  manageinput = '';
  coreinput = '';
  supportinput = '';
  vcmName = '';
  // properties
  editProcessDescription: any;
  editProcessOwner: any;
  editProcessName: any;
  propertiesName: any;
  editLevelProperties: number;
  childParent: any;
  processOwners_list:any[]=[];
  process_ownerName:any;
  isLoading:boolean=false;
  user_details:any;
  selectedObj:any;
  vcmUniqueId=UUID.UUID();
  vcm_id:any;
  selectedVcm:any;
  ownerValues: any;
  selectedNode_obj: any;
  inputUniqueId: any;
  l3ProcessName: any;
  vcm_resData:any
  uniqueId1: any;
  uniqueId: any;
  level2Parent: any;
  isEdit:any;
  listOfFiles:any=[];
  uploadFilemodalref: BsModalRef;
  listOfAttachemnts=[];
  isOpenedState=1;
  isShow:boolean= false;
  propertiesLevel:any;
  uniqueIdL3:any;


  constructor(private router: Router,private rest_api : RestApiService, private dt: DataTransferService,
    private route:ActivatedRoute, private modalService: BsModalService) {
    this.vcmProcess = TREE_DATA;
    this.route.queryParams.subscribe(res => {
      if(res)
      this.vcm_id = res.id
    });
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.getProcessOwnersList();
    this.dt.logged_userData.subscribe(res=>{this.user_details=res})  ;
    this.getselectedVcm();
  }

  addL1Process(value) {
    if (value == "Management Process") {
      let record = {
        "type": "Process",
        parent: 'Management Process',
        title: this.manageinput,
        description: '',
        processOwner: '',
        attachments: [],
        children:[],
        level: "L1",
        'uniqueId': UUID.UUID()
      }
      TREE_DATA.filter(e => e.name == 'Management Process')[0].children.push(record);
      this.manageinput = '';
    }
    if (value == "Core Process") {
      let record = {
        "type": "Process",
        parent: 'Core Process',
        title: this.coreinput,
        description: '',
        processOwner: '',
        attachments: [],
        children:[],
        level: "L1",
        'uniqueId': UUID.UUID()
      }
      TREE_DATA.filter(e => e.name == 'Core Process')[0].children.push(record);
      this.coreinput = '';
    }
    if (value == "Support Process") {
      let record = {
        "type": "Process",
        parent: 'Support Process',
        title: this.supportinput,
        description: '',
        processOwner: '',
        attachments: [],
        children:[],
        level: "L1",
        'uniqueId': UUID.UUID()
      }
      TREE_DATA.filter(e => e.name == 'Support Process')[0].children.push(record);
      this.supportinput = '';
    }
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }

  removeChild(name) {
    var index = TREE_DATA.filter(e => e.name === name.parent)[0]
      .children.findIndex(c => c.uniqueId === name.uniqueId);
      console.log(index);
    TREE_DATA.filter(e => e.name == name.parent)[0].children.splice(index, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.drawer.close();
    console.log(this.vcmProcess);
  }

  addLevel2Process() {
    console.log(this.level1process);
    let record = {
      type: 'Process',
      title: this.addLevel2,
      parent: this.level1process.parent,
      level1UniqueId: this.level1process.uniqueId,
      description: '',
      processOwner: '',
      attachments: [],
      level: "L2",
      'uniqueId': UUID.UUID(),
      children: []
    };
    var index = TREE_DATA.filter(e => e.name === this.level1process.parent)[0]
      .children.findIndex(c => c.uniqueId === this.level1process.uniqueId);
console.log(this.level1process,index)
    if (TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
      .children[index].children) {
      TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
        .children[index].children.push(record);
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
      this.addLevel2 = '';
    }else {
      TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
        .children[index]['children'] = [];
      TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
        .children[index].children.push(record);
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
      this.addLevel2 = '';
    }
  }


  level2removeChild(name) {
    console.log(name);
    var processIndex = TREE_DATA.findIndex(e => e.name === name.parent);
    var processData = TREE_DATA[processIndex]['children'];
    console.log(processData)
    var parentIndex = processData.findIndex(e => e.uniqueId === name.level1UniqueId);
    var parentData = processData[parentIndex]['children'];
    var childIndex = parentData.findIndex(e => e.title === name.title);
    TREE_DATA[processIndex]['children'][parentIndex]['children'].splice(childIndex, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.drawer.close();
    console.log(this.vcmProcess);
  }

  showPropertiesPanel(item, obj, level) {
    this.drawer.open();
    this.editLevelProperties = level;
    this.editProcessDescription = '';
    this.editProcessOwner = '';
    this.propertiesName = obj.parent;
    this.selectedObj=obj;
    this.uniqueId1=null;
    if (obj.description) {
      this.editProcessDescription = obj.description;
    }
    if (obj.processOwner) {
      this.editProcessOwner = obj.processOwner;
    }
    if (obj.attachments) {
      // this.listOfAttachemnts = obj.attachments;
    }
    this.editProcessName = obj.title;
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

  RemoveFile(each, i: number) {
    // this.listOfAttachemnts.splice(i, 1);
    // if (this.editLevelProperties == 1) {
    //   TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
    //     .filter(n => n.title === this.editProcessName)[0].attachments = this.listOfAttachemnts;
    // }
    // if (this.editLevelProperties == 2) {
    //   TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
    //     .filter(n => n.title === this.childParent)[0].children.filter(c => c.tit === this.editProcessName)[0]
    //     .attachments = this.listOfAttachemnts;
    // }
    // if (this.editLevelProperties == 3) {
    //   TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
    //   .filter(n => n.title === this.childParent)[0].children.filter(c => c.title === this.level2Parent)[0]
    //   .children.filter(f=>f.title === this.editProcessName)[0]
    //   .attachments = this.listOfAttachemnts;
    // }
    // console.log(TREE_DATA);
    this.isLoading=true;
    let req_body=[{"documentId":each.uniqueId}]
    this.rest_api.deleteAttachements(req_body).subscribe(res=>{
    this.isLoading=false;
    this.onOpenDocuments();
    })
  }

  vcmHeading() {
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }

  goToProperties(level) {
    if (this.vcmProcess[0].children.length != 0 || this.vcmProcess[1].children.length != 0 || this.vcmProcess[2].children.length != 0) {
    this.isShow=true;
      this.isShow=true;
      this.propertiesLevel=level
      this.vcmProcess = TREE_DATA;
    }
  }

  async getProcessOwnersList(){
    let roles={"roleNames": ["Process Owner"]}
    await this.rest_api.getmultipleApproverforusers(roles).subscribe( res =>  {
     if(Array.isArray(res))
       this.processOwners_list = res;
   });
  }

  closeOverlay(){
    this.drawer.close()
  }

  getselectedVcm(){
    this.isLoading=true;
    this.rest_api.getselectedVcmById(this.vcm_id).subscribe(res=>{this.selectedVcm=res
      this.isLoading=false;
      console.log(res);
      if(res){
        this.vcmName=this.selectedVcm.data.vcmName;
        this.process_ownerName=this.selectedVcm.data.processOwner;
        let splitedValues = this.process_ownerName.split(' ');
        this.ownerValues = splitedValues[0].charAt(0) + splitedValues[1].charAt(0);
        this.selectedVcm.data.vcmV2.forEach(element => {
          // element["attachments"]=[];
        });
        this.dataMappingToTreeStructer1(this.selectedVcm.data.vcmV2);
      }
    })
  }

  dataMappingToTreeStructer1(data){
    let objData = [
      { title: "Management Process","children":[]},
      { title: "Core Process","children":[]},
      { title: "Support Process","children":[]}
    ]

    data.forEach(e=>{
      objData.forEach(e1=>{
        if(e.level == "L1"){
          if(e.parent == e1.title){
            e1["children"].push(e);
          }
        }
      })
    })

    data.forEach(e=>{
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

    data.forEach(e => {
      objData.forEach(e1 => {
        if (e.level == "L3") {
          if (e.parent == e1.title) {
            console.log(e, e1)
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

    objData.forEach(element => {
        element["name"]=element.title
      });
    this.vcmProcess = null;
    this.vcmProcess =objData;
    TREE_DATA = objData;
    this.dataSource.data=objData;
    this.treeControl.dataNodes = this.dataSource.data; 
  }

  backToViewVcm(){
    this.router.navigate(["/pages/vcm/vcm-structure"],{queryParams:{id:this.vcm_id}})
  }

  onChangeProcessOwner() {
    let splitedValues = this.process_ownerName.split(' ');
    this.ownerValues = splitedValues[0].charAt(0) + splitedValues[1].charAt(0);
  }

  onCreateLevel3(level2,item){
    console.log(level2,item);
    this.selectedNode_obj = level2;
    this.inputUniqueId = this.selectedNode_obj.uniqueId;
  }

  addL3Process(level2, item) {
    console.log(level2, item);
    let record = {
      "level": "L3",
        "parent": level2.parent,
        "title": this.l3ProcessName,
        "description": '',
        "processOwner": '',
        "type": "Process",
        "level2UniqueId": level2.uniqueId,
        "level1UniqueId": level2.level1UniqueId,
        "uniqueId": UUID.UUID(),
        "attachments": [],
        "bpsId": '',
        "ntype": ''
    }

    TREE_DATA.filter(e => e.name == item.name)[0]
    .children.filter(c => c.uniqueId == level2.level1UniqueId)[0]
    .children.filter(t => t.uniqueId == level2.uniqueId)[0].children.push(record);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.l3ProcessName = '';
    this.inputUniqueId = '';
    console.log(this.vcmProcess)
  }

  l3remove(l3){
    console.log(l3);
    var processIndex = TREE_DATA.findIndex(e => e.name === l3.parent);
    var processData = TREE_DATA[processIndex]['children'];
    var parentIndex = processData.findIndex(e => e.uniqueId === l3.level1UniqueId);
    var parentData = processData[parentIndex]['children'];
    var childIndex = parentData.findIndex(e => e.uniqueId === l3.level2UniqueId);
    var level3 =  parentData[childIndex]['children'];
    var childIndexL3 = level3.findIndex(e=>e.uniqueId === l3.uniqueId);
    TREE_DATA[processIndex]['children'][parentIndex]['children'][childIndex]['children'].splice(childIndexL3, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    console.log(this.vcmProcess);
  }

  updateVcm(){
    let req_body=this.getreqBody();
    console.log("req_body",req_body)
    this.isLoading=true;
    this.rest_api.updateVcm(req_body).subscribe(res=>{
    console.log(res)
    this.isLoading=false;
    Swal.fire({
      title: 'Success',
      text: "Updated Successfully !!",
      position: 'center',
      icon: 'success',
      showCancelButton: false,
      heightAuto: false,
    }).then((result) => {
      if (result.value) {
        this.backToViewVcm();
      }
    })
    },err=>{
      this.isLoading=false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        heightAuto: false,
      });
    })
  }

  getreqBody(){
    let treeData=[]
    let treeData1=[]
    let treeData2=[]
    let treeData3=[]
    this.vcmProcess = TREE_DATA;
    this.vcmProcess.forEach(ele=>{
        ele.children.forEach(e=>{
          treeData.push(e)
          treeData1.push(e)
        })
    })
        treeData1.forEach(element => {
      element.children.forEach(e=>{
        treeData.push(e)
        treeData2.push(e)
      })
    });

    treeData2.forEach(e=>{
      e.children.forEach(ele=>{
        treeData.push(ele);
        treeData3.push(ele)
      })
    })
    let treeData4=[]
    treeData.forEach(e=>{
      let obj={
        "type": e.type,
      "uniqueId": e.uniqueId,
      "processOwner": e.processOwner,
      "description": e.description,
      "level": e.level,
      "title": e.title,
      "parent": e.parent,
      "children": [],
      "attachments": [],
      }
      if(e.level1UniqueId){
        obj["level1UniqueId"]=e.level1UniqueId
      }
      if(e.level2UniqueId){
        obj["level2UniqueId"]=e.level2UniqueId
      }
      if(e.level == "L3"){
        obj["bpsId"]=e.bpsId
      }
      if(e.level == "L3"){
        obj["ntype"]=e.ntype
      }
      treeData4.push(obj)
    })
    // console.log(this.vcmTreeData)
    let req_body={
      "id": this.selectedVcm.data.id,
      "vcmuniqueId": this.selectedVcm.data.vcmuniqueId,
      "vcmName": this.vcmName,
      "processOwner": this.process_ownerName,
      "active": true,
      "createdBy": this.selectedVcm.data.createdBy,
      "createdTimestamp": this.selectedVcm.data.createdTimestamp,
      "convertedCreatedTime": 0,
      "convertedModifiedTime": 0,
      "vcmV2": treeData4
    }
    return req_body
  }

  editLevelName(node) {
    console.log(node);
    this.uniqueId1 = node.uniqueId;
    this.uniqueId = null;
    this.drawer.close();
  }
  editTitleName(node) {
    console.log(node);
    this.uniqueId1 = null;
    this.drawer.close();
  }

    saveProperties(val){
    console.log(this.vcmProcess,this.selectedObj)
    if(val=="L1"){
      this.vcmProcess.filter((e) => e.title === this.selectedObj.parent)[0].children
        .filter(n => n.title === this.selectedObj.title)[0].description = this.editProcessDescription;
      this.vcmProcess.filter((e) => e.title === this.selectedObj.parent)[0].children
        .filter(n => n.title === this.selectedObj.title)[0].processOwner = this.editProcessOwner;
    }

    if(val=="L2"){
      this.vcmProcess.filter((e) => e.title ===this.selectedObj.parent)[0].children
      .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0]
      .description = this.editProcessDescription;
      this.vcmProcess.filter((e) => e.title === this.selectedObj.parent)[0].children
      .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0]
      .processOwner = this.editProcessOwner;
    }

    if(val=="L3"){
      this.vcmProcess.filter((e) => e.title === this.selectedObj.parent)[0].children
      .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
      .filter(n => n.uniqueId === this.selectedObj.level2UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0]
      .description = this.editProcessDescription;
      this.vcmProcess.filter((e) => e.title === this.selectedObj.parent)[0].children
      .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
      .filter(n => n.uniqueId === this.selectedObj.level2UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0]
      .processOwner = this.editProcessOwner;
    }
      this.drawer.close();
  }

  uploadFilemodalCancel(){
    this.uploadFilemodalref.hide();
  }

  chnagefileUploadForm(e){
    this.listOfFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      e.target.files[i]['convertedsize'] = this.convertFileSize(e.target.files[i].size);
      e.target.files[i]['fileName'] = e.target.files[i]['name'];
      // e.target.files[i]['processName'] = this.selectedObj.title;
      e.target.files[i]['fileDescription'] = ''
      this.listOfFiles.push(e.target.files[i])
    } 
  }

  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
  }

   uploadFileModelOpen(template: TemplateRef<any>){
     this.listOfFiles=[];
    this.uploadFilemodalref = this.modalService.show(template,{class:"modal-lr"});
  }

  onSubmitUpload(){
    let formdata = new FormData()
    for (var i = 0; i < this.listOfFiles.length; i++) {
      formdata.append("file", this.listOfFiles[i]);
    }
    formdata.append("vcmLevel",this.selectedObj.level);
    formdata.append("uniqueId",this.selectedObj.uniqueId);
    formdata.append("masterId",this.selectedVcm.data.id);
    formdata.append("parent",this.selectedObj.parent);
    formdata.append("vcmuniqueId",this.selectedVcm.data.vcmuniqueId);
    let res_data
    this.rest_api.uploadVCMPropDocument(formdata).subscribe(res => {res_data=res
      console.log(res)
      // this.listOfAttachemnts =  this.listOfFiles;
      this.onOpenDocuments()
      this.isLoading = false;
      // if (this.selectedObj.level == 'L1') {
      //   TREE_DATA.filter((e) => e.name === this.selectedObj.parent)[0].children
      //     .filter(n => n.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.listOfFiles;
      // }

      // if (this.selectedObj.level == 'L2') {
      //   TREE_DATA.filter((e) => e.name ===this.selectedObj.parent)[0].children
      //   .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
      //   .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.listOfFiles;
      // }
      // this.vcmProcess=TREE_DATA;

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

  onIputClick(){
    this.uniqueId1=null
  }

  readEmitValue(event){
    console.log(event)
    this.isShow=false;
    if(event.updateStatus){
      TREE_DATA = event.data
      this.vcmProcess = TREE_DATA;
    }else{
      this.vcmProcess = TREE_DATA;
    }

  }

  editL3Process(obj){
    this.uniqueIdL3 = obj.uniqueId
  }
  updateL3Process(){
    this.uniqueIdL3=''
  }

  onOpenDocuments(){
    console.log(this.selectedVcm)
    let res_data:any;
    this.isLoading=true;
    this.listOfAttachemnts=[]
    let request= {"masterId":this.selectedVcm.data.id,"uniqueId": this.selectedObj.uniqueId}
    this.rest_api.getAttachementsByIndivdualProcess(request).subscribe(res=>{res_data=res
      console.log(res)
      this.isLoading=false;
      if(res_data){
        this.listOfAttachemnts=res_data.data

        if (this.selectedObj.level == 'L1') {
          TREE_DATA.filter((e) => e.title === this.selectedObj.parent)[0].children
            .filter(n => n.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.listOfAttachemnts;
        }
  
        if (this.selectedObj.level == 'L2') {
          TREE_DATA.filter((e) => e.title ===this.selectedObj.parent)[0].children
          .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
          .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.listOfAttachemnts;
        }
  
        if (this.selectedObj.level == 'L3') {
          TREE_DATA.filter((e) => e.title ===this.selectedObj.parent)[0].children
          .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
          .filter(m => m.uniqueId === this.selectedObj.level2UniqueId)[0].children
          .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.listOfAttachemnts;
        }
        this.vcmProcess=TREE_DATA;
      }
        // this.listOfAttachemnts
    })
  }
  
  
}
