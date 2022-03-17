import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { MatTree } from '@angular/material/tree';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import Swal from 'sweetalert2';
import { UUID } from 'angular2-uuid';
import { object } from '@amcharts/amcharts4/core';

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
  fileName = [];
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




  constructor(private router: Router,private rest_api : RestApiService, private dt: DataTransferService,
    private route:ActivatedRoute) {
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = TREE_DATA;
    this.route.queryParams.subscribe(res => {
      if(res)
      this.vcm_id = res.id
    });
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.getProcessOwnersList();
    this.dt.logged_userData.subscribe(res=>{this.user_details=res})  
    let res_data
    this.dt.getVcm_Data.subscribe(res=>{res_data=res
      console.log(res_data)
      if(res){
        if(res_data.data.length==0){
          TREE_DATA=[
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
          this.vcmProcess = TREE_DATA

        }else{
        TREE_DATA = res_data.data;
        this.vcmProcess = null;
        this.vcmProcess = res_data.data;
        if(res_data.vName)this.vcmName=res_data.vName;
        if(res_data.pOwner)this.process_ownerName=res_data.pOwner;
        // if(res_data){
        //   console.log("selectedVcmData", res_data.selectedVcm)
        // }
        }
      }
    });
    if(this.vcm_id){
      this.getselectedVcm();
      console.log(this.vcmProcess);
    }
  }

  addManageProcess() {
    let record = {
      "type": "Process",
      parent: 'Management Process',
      title: this.manageinput,
      description: '',
      processOwner: '',
      attachments: [],
      level: "L1",
      'uniqueId':UUID.UUID()
    }
    TREE_DATA.filter(e => e.name == 'Management Process')[0].children.push(record);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.manageinput = '';
  }

  addCoreProcess() {
    let record = {
      "type": "Process",
      parent: 'Core Process',
      title: this.coreinput,
      description: '',
      processOwner: '',
      attachments: [],
      level: "L1",
      'uniqueId':UUID.UUID()
    }
    TREE_DATA.filter(e => e.name == 'Core Process')[0].children.push(record);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.coreinput = '';
  }

  addSupportProcess() {
    let record = {
      "type": "Process",
      parent: 'Support Process',
      title: this.supportinput,
      description: '',
      processOwner: '',
      attachments: [],
      level: "L1",
      'uniqueId':UUID.UUID()

    }
    TREE_DATA.filter(e => e.name == 'Support Process')[0].children.push(record);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.supportinput = '';
  }

  removeChild(name) {
    console.log(name);
    var index = TREE_DATA.filter(e => e.name === name.parent)[0]
      .children.findIndex(c => c.title === name.title);
      console.log(index);
    TREE_DATA.filter(e => e.name == name.parent)[0].children.splice(index, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.drawer.close();
    console.log(this.vcmProcess);
  }

  // 

  addNewLevel2() {
    console.log(this.addLevel2);
    console.log(this.level1process);
    let record = {
      type: 'Process',
      title: this.addLevel2,
      parent: this.level1process.parent,
      childParent: this.level1process.title,
      description: '',
      processOwner: '',
      attachments: [],
      children: [],
      level: "L2",
      'uniqueId':UUID.UUID()
    };
    var index = TREE_DATA.filter(e => e.name === this.level1process.parent)[0]
      .children.findIndex(c => c.title === this.level1process.title);

    if (TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
      .children[index].children) {
      TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
        .children[index].children.push(record);
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
      this.dataSource.data = null;
      this.dataSource.data = TREE_DATA;
      this.addLevel2 = '';
    }
    else {
      TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
        .children[index]['children'] = [];
      TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
        .children[index].children.push(record);
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
      this.dataSource.data = null;
      this.dataSource.data = TREE_DATA;
      this.addLevel2 = '';
    }
    console.log(this.vcmProcess);
  }

  level2removeChild(name) {
    console.log(name);
    var processIndex = TREE_DATA.findIndex(e => e.name === name.parent);
    var processData = TREE_DATA[processIndex]['children'];
    var parentIndex = processData.findIndex(e => e.title === name.childParent);
    var parentData = processData[parentIndex]['children'];
    var childIndex = parentData.findIndex(e => e.title === name.title);
    TREE_DATA[processIndex]['children'][parentIndex]['children'].splice(childIndex, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.drawer.close();
    console.log(this.vcmProcess);
  }

  resetLevel1() {
    TREE_DATA = [
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
      }
    ];
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.vcmName = '';
    this.level1process='';
    this.process_ownerName='';
    localStorage.removeItem('vcmData');
  }

  editProcess(item, name, level) {
    console.log(item,name.uniqueId,this.vcmProcess)
    this.drawer.open();
    this.editLevelProperties = level;
    console.log(this.editLevelProperties);
    this.editProcessDescription = '';
    this.editProcessOwner = '';
    this.propertiesName = name.parent;
    this.selectedObj=name;
    if (name.description) {
      this.editProcessDescription = name.description;
    }
    if (name.processOwner) {
      this.editProcessOwner = name.processOwner;
    }
    if (name.attachments) {
      this.fileName = name.attachments;
    }
    this.editProcessName = name.title;
  }

  editProperties() {
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.editProcessName)[0].description = this.editProcessDescription;
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.editProcessName)[0].processOwner = this.editProcessOwner;
    console.log(this.vcmProcess)
    this.vcmProcess=TREE_DATA;
    this.drawer.close();
  }

  editLevel2(name, level2, level) {
    this.drawer.open();
    this.selectedObj=level2;
    this.editProcessDescription = '';
    this.editProcessOwner = '';
    this.editLevelProperties = level;
    console.log(name, level2,this.vcmProcess);
    this.childParent = level2.childParent;
    this.propertiesName = level2.parent;
    if (level2.description) {
      this.editProcessDescription = level2.description;
    }
    if (level2.processOwner) {
      this.editProcessOwner = level2.processOwner;
    }
    if (level2.attachments) {
      this.fileName = level2.attachments;
    }
    this.editProcessName = level2.title;
  }
  editProcessLevel2() {
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.childParent)[0].children.filter(c => c.title === this.editProcessName)[0]
      .description = this.editProcessDescription;
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.childParent)[0].children.filter(c => c.title === this.editProcessName)[0]
      .processOwner = this.editProcessOwner;
    console.log(TREE_DATA);
    this.vcmProcess=TREE_DATA
    this.drawer.close();
  }

  documentsUpload(event) {
    // this.fileName = []
    // console.log(event);
    const formdata = new FormData();
    for (var i = 0; i < event.target.files.length; i++) {
      event.target.files[i]['convertedsize'] = this.convertFileSize(event.target.files[i].size);
      event.target.files[i]['fileName'] = event.target.files[i]['name'];
      // this.fileName.push(event.target.files[i]);
      formdata.append("file", event.target.files[i]);
    }
    formdata.append("vcmLevel",this.selectedObj.level);
    formdata.append("uniqueId",this.selectedObj.uniqueId);
    formdata.append("vcmuniqueId",this.vcmProcess[0].uniqueId);
    formdata.append("masterId","000");
    formdata.append("parent",this.selectedObj.parent);

    // for (var i = 0; i < this.fileName.length; i++) {
    //   formdata.append("file", this.fileName[i]);
    // }
    console.log("selectedObj",this.selectedObj)
    this.isLoading=true;
this.rest_api.uploadVCMPropDocument(formdata).subscribe(res=>{
  this.isLoading=false;
  for (var i = 0; i < event.target.files.length; i++) {
    event.target.files[i]['convertedsize'] = this.convertFileSize(event.target.files[i].size);
    event.target.files[i]['fileName'] = event.target.files[i]['name'];
    this.fileName.push(event.target.files[i]);
  }
  if (this.editLevelProperties == 1) {
    console.log(this.fileName);
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.editProcessName)[0].attachments = this.fileName;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }
  if (this.editLevelProperties == 2) {
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.childParent)[0].children.filter(c => c.title === this.editProcessName)[0]
      .attachments = this.fileName;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }
  if (this.editLevelProperties == 3) {
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
    .filter(n => n.title === this.childParent)[0].children.filter(c => c.title === this.level2Parent)[0]
    .children.filter(f=>f.title === this.editProcessName)[0]
    .attachments = this.fileName;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    console.log(TREE_DATA);
  }

  console.log(res)
},err=>{
  this.isLoading=false;
  Swal.fire({
    title: 'Error',
    text: "File upload failed",
    position: 'center',
    icon: 'error',
    heightAuto: false,
  })
})

    console.log(this.fileName);
    console.log(TREE_DATA);
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
  RemoveFile(file, i: number) {
    this.fileName.splice(i, 1);
    if (this.editLevelProperties == 1) {
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
        .filter(n => n.title === this.editProcessName)[0].attachments = this.fileName;
    }
    if (this.editLevelProperties == 2) {
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
        .filter(n => n.title === this.childParent)[0].children.filter(c => c.tit === this.editProcessName)[0]
        .attachments = this.fileName;
    }
    if (this.editLevelProperties == 3) {
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.childParent)[0].children.filter(c => c.title === this.level2Parent)[0]
      .children.filter(f=>f.title === this.editProcessName)[0]
      .attachments = this.fileName;
    }
    console.log(TREE_DATA);
  }

  saveVcm() {
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }
  vcmHeading() {
    // TREE_DATA[3].vcmname = this.vcmName;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }
  goToProperties(level) {
    let nav: NavigationExtras = {
      queryParams: {
        level: level
      }
    }

    if (this.vcmProcess[0].children.length != 0 || this.vcmProcess[1].children.length != 0 || this.vcmProcess[2].children.length != 0) {
      localStorage.setItem("vcmData",(JSON.stringify(this.vcmProcess)));
      let obj={vName:this.vcmName,pOwner:this.process_ownerName,data:this.vcmProcess}
      this.dt.vcmDataTransfer(obj)
      this.router.navigate(['/pages/vcm/properties'], nav);
    // TREE_DATA[3].vcmname = this.vcmName;
      this.vcmProcess = TREE_DATA;
      console.log(this.vcmProcess);
    }
  }

  resetProperties(){    
    this.editProcessDescription = '';
    this.editProcessOwner = '';
  }

  async getProcessOwnersList(){
    let roles={"roleNames": ["Process Owner"]}
    await this.rest_api.getmultipleApproverforusers(roles).subscribe( res =>  {
    //  console.log(res)
     if(Array.isArray(res))
       this.processOwners_list = res;
   });
  }

  ngDestroy(){
    
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

    data.forEach(e=>{
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

  // fitProcessName(processName){
  //   if(processName && processName.length > 25)
  //     return processName.substr(0,25)+'..';
  //   return processName;
  // }

  onCreateLevel3(level2,item){
    console.log(level2,item);
    this.selectedNode_obj = level2;
    this.inputUniqueId = this.selectedNode_obj.uniqueId;
  }

  editTitle(level2, item) {
    console.log(level2, item);
    let record = {
      type: 'Process',
      title: this.l3ProcessName,
      parent: item.name,
      childParent: level2.title,
      l2childParent:level2.childParent,
      description: '',
      processOwner: '',
      attachments: [],
      level: "L3",
      'uniqueId': UUID.UUID()
    };

    TREE_DATA.filter(e => e.name == item.name)[0]
    .children.filter(c => c.title == level2.childParent)[0]
    .children.filter(t => t.title == level2.title)[0].children.push(record);
    console.log(TREE_DATA);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.l3ProcessName = '';
    this.inputUniqueId = '';
  }

  l3remove(l3){
    console.log(l3);
    var processIndex = TREE_DATA.findIndex(e => e.name === l3.parent);
    var processData = TREE_DATA[processIndex]['children'];
    var parentIndex = processData.findIndex(e => e.title === l3.l2childParent);
    var parentData = processData[parentIndex]['children'];
    console.log(parentData);
    var childIndex = parentData.findIndex(e => e.title === l3.childParent);
    var level3 =  parentData[childIndex]['children'];
    console.log(level3);
    var childIndexL3 = level3.findIndex(e=>e.title === l3.title);
    TREE_DATA[processIndex]['children'][parentIndex]['children'][childIndex]['children'].splice(childIndexL3, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    console.log(this.vcmProcess);
  }

  
  updateVcm(){
    let req_body=this.getreqBody();
    console.log("req_body",req_body)
    this.isLoading=true;
    this.rest_api.updateVcm(req_body).subscribe(res=>{
    console.log(res)
    Swal.fire({
      title: 'Success',
      text: "Updated Successfully !!",
      position: 'center',
      icon: 'success',
      showCancelButton: false,
      heightAuto: false,
    });
    this.isLoading=false;
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
    console.log(this.vcmProcess)
    console.log(TREE_DATA)
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

  editLevel3(name,l3,level){
    this.drawer.open();
    this.selectedObj = l3;
    this.editProcessDescription = '';
    this.editProcessOwner = '';
    this.editLevelProperties = level;
    this.level2Parent = l3.childParent;
    console.log(name, l3, this.vcmProcess);
    this.childParent = name.childParent;
    this.propertiesName = name.parent;
    if (l3.description) {
      this.editProcessDescription = l3.description;
    }
    if (l3.processOwner) {
      this.editProcessOwner = l3.processOwner;
    }
    if (l3.attachments) {
      this.fileName = l3.attachments;
    }
    this.editProcessName = l3.title;
  }
  editProcessLevel3(){
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.childParent)[0].children.filter(c => c.title === this.level2Parent)[0]
      .children.filter(f=>f.title === this.editProcessName)[0]
      .description = this.editProcessDescription;
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.title === this.childParent)[0].children.filter(c => c.title === this.level2Parent)[0]
      .children.filter(f=>f.title === this.editProcessName)[0]
      .processOwner = this.editProcessOwner;
    console.log(TREE_DATA);
    this.vcmProcess = TREE_DATA
    this.drawer.close();
  }

}
