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
  vcmProcess:any;
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
  uploadedFiles:any=[];
  isPropDisabled:boolean=true;

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

  constructor(private router: Router,private bpmnservice:SharebpmndiagramService,private rest_api: RestApiService,
    private route : ActivatedRoute) {
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
    // console.log(this.vcmProcess)
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
    // this.vcmProcess = this.dataSource.data;
    this.vcmProcess = objData;
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
    // this.vcmProcess = this.dataSource.data;
    this.vcmProcess = objData;
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

  viewProperties(){
    this.drawer.open();
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
    console.log(node)
    this.uploadedFiles=[];
    this.processName=node.title
    this.processOwner=node.processOwner;
    this.processDesc=node.description;
    this.uploadedFiles=node.attachments
    this.drawer.open();

  }
  
}

