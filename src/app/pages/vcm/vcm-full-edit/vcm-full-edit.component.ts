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
    console.log(TREE_DATA);
  }

  saveVcm() {
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    let data1=[];
    let data2=[];
    let randomId = UUID.UUID();
    this.vcmProcess.forEach(element => {
      element.children.forEach(e=>{
        data1.push(e);
        data2.push(e);
      });
    });
    data1.forEach(e=>{
      if(e.children){
        e.children.forEach(e1 => {
          e1["level1UniqueId"]=e.uniqueId

          data2.push(e1)
        });
      }
    })

    // let data4=data2;
    let data4=[]
    // data4.map(item => {item["children"] = [];return item;});
    data2.forEach(element => {
      // element["children"]=[]
      let obj={}
      obj["description"]=element.description
      obj["parent"]=element.parent
      obj["processOwner"]=element.processOwner
      obj["title"]=element.title
      obj["level"]=element.level
      obj["type"]=element.type
      if(element.childParent){
        obj["childParent"]=element.childParent
      }
      if(element.uniqueId){
        obj["uniqueId"]=element.uniqueId
      }
      if(element.level1UniqueId){
        obj["level1UniqueId"]=element.level1UniqueId
      }
      data4.push(obj)

    });
    // console.log(this.vcmProcess)


    let data3 = {
      "vcmName": this.vcmName,
      "createdBy": this.user_details.firstName+ " "+this.user_details.lastName,
      "processOwner": this.process_ownerName,
      "vcmV2": data4,
      "vcmuniqueId":this.vcmProcess[0].uniqueId
    }
    console.log("request body",data4)
    this.isLoading=true;
    this.rest_api.createVcm(data3).subscribe((res:any)=>{
      this.isLoading=false;
      Swal.fire({
        title: 'Success',
        text: res.message,
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        heightAuto: false,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/pages/vcm/view-vcm']);
          localStorage.removeItem('vcmData');
        }
      })

    })

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
    this.dataSource.data=objData;
    this.treeControl.dataNodes = this.dataSource.data; 
  }
  backToViewVcm(){
    this.router.navigate(["/pages/vcm/vcm-structure"],{queryParams:{id:this.vcm_id}})
  }

  // fitProcessName(processName){
  //   if(processName && processName.length > 25)
  //     return processName.substr(0,25)+'..';
  //   return processName;
  // }

}
