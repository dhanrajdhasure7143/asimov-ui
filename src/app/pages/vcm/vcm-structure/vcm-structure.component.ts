import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource  } from '@angular/material';
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

let TREE_DATA: any[] = [
  {
    name: 'Management Process',
    children:[]
  },
  {
    name: 'Core Process',
    children:[]
  },
  {
    name: 'Support Process',
    children:[]
  },
  {
    vcmname:''
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
  vcmTreeData:any;
  vcm_id:any;
  isLoading:boolean=false;
  vcmData:any[]=[];
  expandTree = false;
  @ViewChild('tree',{static: false}) tree;
  isShow:boolean=false;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  processOwners_list:any=[];
  uploadedDocuments:any=[];
  vcm_data:any;
  selectedVcmName:any;
  processName:any;
  processOwner:any;
  processDesc:any;
  attachments:any=[];
  isPropDisabled:boolean=true;
  isViewProperties:boolean=false;
  node_data:any=[];
  nodeParent:any="";
  uniqueId1:any;
  uniqueId:any;
  l1UniqueId:any;

  vcmData1= [
    {
    "type": "Process",
    "processOwner": "John Mustermann",
    "level": "L1",
    "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
    "title": "manage",
    "parent": "Management Process",
    "children":[]
    },
    
    {
    "type": "Process",
    "processOwner": "John Mustermann",
    "level": "L1",
    "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
    "title": "hr",
    "parent": "Management Process",
    "children":[]
    },
    {
    "type": "Process",
    "processOwner": "John Mustermann",
    "level": "L1",
    "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
    "title": "core",
    "parent": "Core Process",
    "children":[]
    },
    {
    "type": "Process",
    "processOwner": "John Mustermann",
    "level": "L1",
    "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
    "title": "support",
    "parent": "Support Process",
    "children":[]
    },
    {
    "type": "Process",
    "processOwner": "John Mustermann",
    "level": "L1",
    "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
    "title": "support1",
    "parent": "Support Process",
    "children":[]
    },
    {
    "type": "process",
    "processOwner": "John Mustermann",
    "level": "L2",
    "description": "The implementation and generation of an appropriate strategy by the management requires a structured.",
    "title": "manage the company finances",
    "parent": "Management Process",
    "childParent": "manage",
    "children":[]
    },
    {
      "type": "process",
      "processOwner": "John Mustermann",
      "level": "L3",
      "description": "The implementation and generation of an appropriate strategy by the management requires a structured.",
      "title": "VCM test",
      "parent": "Management Process",
      "childParent": "manage",
      "subChildParent": "manage the company finances",
      "bpsId":"5831e9ea-2fcf-af70-a460-7c9623cba4bd",
      "ntype":"bpmn",
      "children":[]
      },
      {
        "type": "process",
        "processOwner": "John Mustermann",
        "level": "L3",
        "description": "",
        "title": "Jklop Bpm",
        "parent": "Management Process",
        "childParent": "manage",
        "subChildParent": "manage the company finances",
        "bpsId":"0b58218c-4182-3524-c7f3-4cd657a784d9",
        "ntype":"bpmn",
        "children":[],
        },
    ];



  vcmData2=[
    {
    "type": "Process",
    "uniqueId": "8058218c-4182-3524-c7f3-4cd657a784d9",
    "processOwner": "Sai Nookala",
    "description": "The implementation",
    "level": "L1",
    "title": "biology",
    "parent": "Management Process",
    "children": [],
    },
    {
      "type": "Process",
      "uniqueId": "8058218c-4182-3524-c7f3-4cd63456",
      "processOwner": "Sai Nookala",
      "description": "The implementation",
      "level": "L1",
      "title": "biology1",
      "parent": "Management Process",
      "children": [],
      },
    {
    "type": "Process",
    "uniqueId": "9058218c-4182-3524-c7f3-4cd657a784d9",
    "processOwner": "Sai Nookala",
    "description": "The implementation",
    "level": "L1",
    "title": "chemistry",
    "parent": "Core Process",
    "children": [],
    "attachments": []
    },
    {
    "type": "Process",
    "uniqueId": "5058218c-4182-3524-c7f3-4cd657a784d9",
    "processOwner": "Sai Nookala",
    "description": "The implementation",
    "level": "L1",
    "title": "Maths",
    "parent": "Support Process",
    "children": [],
    "attachments": []
    },
    {
    "type": "Process",
    "uniqueId": "8058218c-4182-3524-c7f3-4cd657a73421",
    "level1UniqueId": "8058218c-4182-3524-c7f3-4cd657a784d9",
    "processOwner": "Sai Nookala",
    "description": "The implementation",
    "level": "L2",
    "title": "differentiation",
    "parent": "Management Process",
    "childParent": "biology",
    "children": [],
    },
    ]


    overlay_data={"type":"create","module":"bps","ntype":"dmn"};
    randomId: string;bpmnModel:BpmnModel = new BpmnModel();
    selectedNode:any;
  nodeParent1: any;
  l1processName: any;

  constructor(private router: Router,private bpmnservice:SharebpmndiagramService,
    private rest_api: RestApiService,
    private route : ActivatedRoute,
    private dt: DataTransferService) {
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

  editVcm(){
    // console.log(this.vcmTreeData)
    this.isShow=true;
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

  dataMappingToTreeStructer(){
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

    this.vcmData.forEach(e=>{
      objData.forEach(e1=>{
        if(e.level == "L2"){
          if(e.parent == e1.title){
            e1.children.forEach(e2=>{
              if(e2.title == e.childParent ){
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
                  if(e3.title == e.subChildParent ){
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
    this.vcmTreeData = objData;
    this.dataSource.data=objData;
    this.treeControl.dataNodes = this.dataSource.data; 
    // this.treeControl.expandAll();
    this.treeControl.expand(this.treeControl.dataNodes[0]);
    this.treeControl.expand(this.treeControl.dataNodes[1]);
    this.treeControl.expand(this.treeControl.dataNodes[2]);
    // this.tree.treeControl.expandAll();

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
    // this.vcmTreeData = this.dataSource.data;
    this.vcmTreeData = objData;
    this.dataSource.data=objData;
    this.treeControl.dataNodes = this.dataSource.data; 
    this.treeControl.expand(this.treeControl.dataNodes[0]);
    this.treeControl.expand(this.treeControl.dataNodes[1]);
    this.treeControl.expand(this.treeControl.dataNodes[2]);
    // this.treeControl.expandAll();
    // this.tree.treeControl.expandAll();
  }

  collapse(){
    this.treeControl.dataNodes = this.dataSource.data; 
    this.treeControl.collapseAll();
    this.expandTree = true;
  }
  expand(){
    this.treeControl.dataNodes = this.dataSource.data; 
    this.treeControl.expandAll();
    this.tree.treeControl.expandAll();
    this.expandTree = false;
  }

  viewProperties(node){
    console.log(node)
    this.node_data=[];
    if(node== 'all'){
      this.vcmData.forEach(element => {
          this.node_data.push(element)
      });
      console.log("shared data", this.node_data)
      this.isViewProperties = true;
      this.isShow = false;
      let params1= {"id":this.vcm_id,"vcmLevel":"all"};

      this.router.navigate([],{ relativeTo:this.route, queryParams:params1 });
    }else{
    this.node_data = [];
    this.vcm_data["mainParent"] = node.title
    this.vcmData.forEach(element => {
      if (element.parent == node.title) {
        this.node_data.push(element)
      }
    });
    let params1= {"id":this.vcm_id,"vcmLevel":node.title};

      this.router.navigate([],{ relativeTo:this.route, queryParams:params1 });
    console.log("shared data", this.node_data)
    this.isViewProperties = true;
    this.isShow = false;
  }
  }

  backToView(){
    this.isShow=false;
    this.isViewProperties=false;
  }

  closeOverlay(){
    this.drawer.close();
  }

  async getProcessOwnersList(){
    let roles={"roleNames": ["Process Owner"]}
    await this.rest_api.getmultipleApproverforusers(roles).subscribe( res =>  {
    //  console.log(res)
     if(Array.isArray(res))
       this.processOwners_list = res;
   });
  }

  openNodeProperties(node){
    console.log("node",node)
    this.getAttachements(node);
    this.processName=node.title;
    this.processOwner=node.processOwner;
    this.processDesc=node.description;
    this.drawer.open();
  }

  getAttachements(node_obj){
      // this.isLoading=true;
      let reqBody={
        "masterId": this.vcm_data.data.id,
        "parent": node_obj.parent
      }
      let res_data
      this.attachments=[];
    this.rest_api.getvcmAttachements(reqBody).subscribe(res=>{res_data=res
      console.log(res)
      res_data.data.forEach(element => {
        if(element.uniqueId== node_obj.uniqueId){
          this.attachments.push(element)
        }
      });
      // this.isLoading=false;
    })
  }
  
  readVcmValue(value) {
    console.log(value)
    if (value) {
      this.isShow = false;
      this.isViewProperties = false;
    }
  }

  quickEditVcm(){
    // this.vcmTreeData.forEach(element => {
    //   element["name"]=element.title
    // });
    
    // let obj={"vName":this.vcm_data.data.vcmName,
    //   "pOwner":this.vcm_data.data.processOwner,
    //   "data":this.vcmTreeData,
    //   "selectedVcm":this.vcm_data}
    // this.dt.vcmDataTransfer(obj);
    this.router.navigate(["/pages/vcm/edit"],{queryParams: {id: this.vcm_id}})
  }
  onSelectedProcessEdit(node){
    console.log(node)
this.nodeParent=node.title
  }

  onCreateLevel3() {
    this.uniqueId = this.selectedNode.uniqueId;
    console.log(this.selectedNode)
  }

  onCreateLevel1(node) {

    this.l1UniqueId = node.uniqueId;
    this.uniqueId = node.uniqueId;
    this.uniqueId1 = null;

  }
  addL2Nodes(node){
    console.log(node)
    console.log(this.vcmData);
    this.uniqueId=UUID.UUID();
  
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
          attachments:[],
          children:[]
        }
      );
    console.log("vcmData",this.vcmTreeData);
    setTimeout(() => {
      this.dataSource.data = null;
      this.dataSource.data = this.vcmTreeData;
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll();
      this.processName='';
    }, 200);
  }

  editLevelName(node) {
    console.log(node);
    this.uniqueId1 = node.uniqueId;
    this.uniqueId = null;
    this.drawer.close();
  }

  editTitle(node) {
    console.log(node);
    this.uniqueId1 = null;
    this.drawer.close();
  }

  onSelectedNode(node) {
    console.log(node);
    this.selectedNode = node
  }

  addL3Nodes(){
    console.log("vcmData",this.vcmTreeData);
        console.log("this.selectedNode",this.selectedNode)
        this.uniqueId=UUID.UUID();
    
        this.vcmTreeData.filter((e) => e.title === this.selectedNode.parent)[0].children
          .filter(n => n.uniqueId === this.selectedNode.level1UniqueId)[0].children
          .filter(n => n.uniqueId === this.selectedNode.uniqueId)[0]["children"].
          push({
              level: "L3",
              parent: this.selectedNode.parent,
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
        console.log("vcmData",this.vcmTreeData);
    
        setTimeout(() => {
          this.dataSource.data = null;
          this.dataSource.data = this.vcmTreeData;
          this.treeControl.dataNodes = this.dataSource.data;
          this.treeControl.expandAll()
        }, 100);
    }
    viewTotalProperties(){
      
    }

    createLevel1(node){
      console.log(node)
      this.nodeParent1=node.title
    }

    onCreateBpmn() {
      console.log("test")
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


    addL1Nodes(node){
      console.log(node)
      this.vcmTreeData.filter((e) => e.title === node.title)[0].children
        .push({
            level: "L1",
            parent: node.title,
            title: this.l1processName,
            description: '',
            processOwner: '',
            type: "Process",
            level1UniqueId: node.uniqueId,
            uniqueId: UUID.UUID(),
            attachments:[],
            children:[]
          }
        );
        this.nodeParent1=null;
        this.l1processName='';
      console.log("vcmTreeData",this.vcmTreeData);
      setTimeout(() => {
        this.dataSource.data = null;
        this.dataSource.data = this.vcmTreeData;
        this.treeControl.dataNodes = this.dataSource.data;
        this.treeControl.expandAll();
        this.processName='';
      }, 100);
    }
  

}

