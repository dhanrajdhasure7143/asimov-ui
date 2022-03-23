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
    name: 'Management Process', uniqueId: UUID.UUID(),
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
  selector: 'app-create-vcm',
  templateUrl: './create-vcm.component.html',
  styleUrls: ['./create-vcm.component.css']
})
export class CreateVcmComponent implements OnInit {
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
  editProcessDescription: any;
  editProcessOwner: any;
  editProcessName: any;
  propertiesName: any;
  editLevelProperties: number;
  listOfAttachemnts = [];
  processOwners_list: any[] = [];
  process_ownerName: any;
  isLoading: boolean = false;
  user_details: any;
  selectedObj: any;
  isOpenedState: number = 1;
  menuToggleTitle: boolean = false;
  propertiesContainer: boolean = false;
  vcmUniqueId = UUID.UUID()
  vcm_id: any;
  selectedVcm: any;
  inputUniqueId: any;
  selectedNode_obj: any;
  l3ProcessName: any;
  ownerValues: any;
  level2Parent: any;
  listOfFiles:any=[];
  uploadFilemodalref: BsModalRef;
  attachementsList:any=[];

  constructor(private router: Router, private rest_api: RestApiService, private dt: DataTransferService,
    private route: ActivatedRoute, private modalService: BsModalService) {
    this.vcmProcess = TREE_DATA;
    this.route.queryParams.subscribe(res => {
      if (res)
        this.vcm_id = res.id
    });
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.getProcessOwnersList();
    this.dt.logged_userData.subscribe(res => { this.user_details = res })
    let res_data
    this.dt.getVcm_Data.subscribe(res => {
      res_data = res
      console.log(res_data)
      if (res) {
        if (res_data.data.length == 0) {
          TREE_DATA = [
            {
              name: 'Management Process', uniqueId: UUID.UUID(),
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

        } else {
          TREE_DATA = res_data.data;
          this.vcmProcess = null;
          this.vcmProcess = res_data.data;
          if (res_data.vName) this.vcmName = res_data.vName;
          if (res_data.pOwner) {
            this.process_ownerName = res_data.pOwner;
            let splitedValues = this.process_ownerName.split(' ');
            this.ownerValues = splitedValues[0].charAt(0) + splitedValues[1].charAt(0);
          }
        }
      }
    });

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
      .children.findIndex(c => c.title === name.title);
    TREE_DATA.filter(e => e.name == name.parent)[0].children.splice(index, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.drawer.close();
  }

  addLevel2Process() {
    console.log(this.addLevel2);
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

    if (TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
      .children[index].children) {
      TREE_DATA.filter(e => e.name == this.level1process.parent)[0]
        .children[index].children.push(record);
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
      this.addLevel2 = '';
    }
    else {
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
    var parentIndex = processData.findIndex(e => e.uniqueId === name.level1UniqueId);
    var parentData = processData[parentIndex]['children'];
    var childIndex = parentData.findIndex(e => e.uniqueId === name.uniqueId);
    TREE_DATA[processIndex]['children'][parentIndex]['children'].splice(childIndex, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.drawer.close();
  }

  resetProcess() {
    TREE_DATA = [
      {
        name: 'Management Process', uniqueId: UUID.UUID(),
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
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.vcmName = '';
    this.level1process = '';
    this.process_ownerName = '';
    localStorage.removeItem('vcmData');
  }

  editProcess(item, name, level) {
    console.log(item, name, this.vcmProcess)
    this.drawer.open();
    this.editLevelProperties = level;
    console.log(this.editLevelProperties);
    this.editProcessDescription = '';
    this.editProcessOwner = '';
    this.propertiesName = name.parent;
    this.selectedObj = name;
    if (name.description) {
      this.editProcessDescription = name.description;
    }
    if (name.processOwner) {
      this.editProcessOwner = name.processOwner;
    }
    if (name.attachments) {
      this.listOfAttachemnts = name.attachments;
    }
    this.editProcessName = name.title;
  }


  editLevel2(name, level2, level) {
    this.drawer.open();
    this.selectedObj = level2;
    this.editProcessDescription = '';
    this.editProcessOwner = '';
    this.editLevelProperties = level;
    console.log(name, level2, this.vcmProcess);
    this.propertiesName = level2.parent;
    if (level2.description) {
      this.editProcessDescription = level2.description;
    }
    if (level2.processOwner) {
      this.editProcessOwner = level2.processOwner;
    }
    if (level2.attachments) {
      this.listOfAttachemnts = level2.attachments;
    }
    this.editProcessName = level2.title;
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
    console.log(this.selectedObj)
    this.listOfAttachemnts.splice(i, 1);
    if (this.editLevelProperties == 1) {
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
        .filter(n => n.title === this.editProcessName)[0].attachments = this.listOfAttachemnts;
    }
    if (this.editLevelProperties == 2) {
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
        .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children.filter(c => c.tit === this.editProcessName)[0]
        .attachments = this.listOfAttachemnts;
    }
    this.vcmProcess=TREE_DATA

  }

  saveVcm() {
    let requestBody = this.getrequestData();
    this.isLoading = true;
    this.rest_api.createVcm(requestBody).subscribe((res: any) => {
      this.isLoading = false;
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

  getrequestData() {
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    let data1 = [];
    let data2 = [];
    this.vcmProcess.forEach(element => {
      element.children.forEach(e => {
        data1.push(e);
        data2.push(e);
      });
    });
    // data1.forEach(e => {
    //   if (e.children) {
    //     e.children.forEach(e1 => {
    //       e1["level1UniqueId"] = e.uniqueId

    //       data2.push(e1)
    //     });
    //   }
    // })
    console.log("data2",data2)

    // let data4=data2;
    let data4 = []
    // data4.map(item => {item["children"] = [];return item;});
    data2.forEach(element => {
      // element["children"]=[]
      let obj = {}
      obj["description"] = element.description
      obj["parent"] = element.parent
      obj["processOwner"] = element.processOwner
      obj["title"] = element.title
      obj["level"] = element.level
      obj["type"] = element.type
      obj["attachments"]=element.attachments

      if (element.uniqueId) {
        obj["uniqueId"] = element.uniqueId
      }
      if (element.level1UniqueId) {
        obj["level1UniqueId"] = element.level1UniqueId
      }
      data4.push(obj)

    });
    console.log("data4",data4)

    // console.log(this.vcmProcess)


    let data3 = {
      "vcmName": this.vcmName,
      "createdBy": this.user_details.firstName + " " + this.user_details.lastName,
      "processOwner": this.process_ownerName,
      "vcmV2": data4,
      "vcmuniqueId": this.vcmProcess[0].uniqueId
    }
    return data3;
  }
  vcmHeading() {
    // TREE_DATA[3].vcmname = this.vcmName;
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
      localStorage.setItem("vcmData", (JSON.stringify(this.vcmProcess)));
      let obj = { vName: this.vcmName, pOwner: this.process_ownerName, data: this.vcmProcess }
      this.dt.vcmDataTransfer(obj)
      this.router.navigate(['/pages/vcm/properties'], nav);
      // TREE_DATA[3].vcmname = this.vcmName;
      this.vcmProcess = TREE_DATA;
      console.log(this.vcmProcess);
    }
  }

  resetProperties() {
    this.editProcessDescription = '';
    this.editProcessOwner = '';
  }

  async getProcessOwnersList() {
    let roles = { "roleNames": ["Process Owner"] }
    await this.rest_api.getmultipleApproverforusers(roles).subscribe(res => {
      //  console.log(res)
      if (Array.isArray(res))
        this.processOwners_list = res;
    });
  }

  ngDestroy() {

  }

  onExpansionClik(i) {
    this.isOpenedState = i;
    this.menuToggleTitle = true;
    this.propertiesContainer = true;
  }

  closeOverlay() {
    this.drawer.close()
  }


  showPreview() {
    let requestBody = this.getrequestData();
    console.log("request body", requestBody)
    let obj = {
      "vName": this.vcmName,
      "pOwner": this.process_ownerName,
      "data": this.vcmProcess,
      "requestBody": requestBody
    }
    this.dt.vcmDataTransfer(obj);
    this.router.navigate(["/pages/vcm/preview"])
  }

  onSelectedNode(node, parentObj) {
    this.selectedNode_obj = node;
  }

  onCreateLevel3() {
    this.inputUniqueId = this.selectedNode_obj.uniqueId;
  }

  onChangeProcessOwner() {
    let splitedValues = this.process_ownerName.split(' ');
    this.ownerValues = splitedValues[0].charAt(0) + splitedValues[1].charAt(0)
  }

  uploadFilemodalCancel(){
    this.uploadFilemodalref.hide();
  }

  chnagefileUploadForm(e){
    this.listOfFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      let randomId=  UUID.UUID() 
      e.target.files[i]['convertedsize'] = this.convertFileSize(e.target.files[i].size);
      e.target.files[i]['fileName'] =randomId + "&&" +e.target.files[i]['name'];
      e.target.files[i]['uniqueId'] = randomId;
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
 
    this.attachementsList=[];
    this.listOfFiles.forEach(e=>{
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
    console.log(this.listOfAttachemnts,this.attachementsList)
    
    this.attachementsList.forEach(element => {
      this.listOfAttachemnts.push(element)
    });
    let formdata = new FormData()
    for (var i = 0; i < this.listOfFiles.length; i++) {
      formdata.append("file", this.listOfFiles[i]);
    }
    formdata.append("vcmLevel",this.selectedObj.level);
    formdata.append("uniqueId",this.selectedObj.uniqueId);
    formdata.append("masterId","000");
    formdata.append("parent",this.selectedObj.parent);
    formdata.append("vcmuniqueId",this.vcmProcess[0].uniqueId);
    let res_data
    this.rest_api.uploadVCMPropDocument(formdata).subscribe(res => {res_data=res
      console.log(res)
    // this.listOfAttachemnts =  this.attachementsList
    this.attachementsList.forEach(element => {
      this.listOfAttachemnts.push(element)
    });
      this.isLoading = false;
      if (this.selectedObj.level == 'L1') {
        TREE_DATA.filter((e) => e.name === this.selectedObj.parent)[0].children
          .filter(n => n.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.listOfAttachemnts;
      }

      if (this.selectedObj.level == 'L2') {
        TREE_DATA.filter((e) => e.name ===this.selectedObj.parent)[0].children
        .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
        .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.listOfAttachemnts;
      }
      this.vcmProcess=TREE_DATA;

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

  saveProperties(val){
    console.log(this.vcmProcess,this.selectedObj)
    // console.log(TREE_DATA);
    // this.vcmProcess=TREE_DATA
    if(val=="L1"){
      TREE_DATA.filter((e) => e.title === this.selectedObj.parent)[0].children
        .filter(n => n.title === this.selectedObj.title)[0].description = this.editProcessDescription;
      TREE_DATA.filter((e) => e.title === this.selectedObj.parent)[0].children
        .filter(n => n.title === this.selectedObj.title)[0].processOwner = this.editProcessOwner;
    }

    if(val=="L2"){
      TREE_DATA.filter((e) => e.title ===this.selectedObj.parent)[0].children
      .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0]
      .description = this.editProcessDescription;
      TREE_DATA.filter((e) => e.title === this.selectedObj.parent)[0].children
      .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
      .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0]
      .processOwner = this.editProcessOwner;
    }
    this.vcmProcess = TREE_DATA
      this.drawer.close();
  }
}
