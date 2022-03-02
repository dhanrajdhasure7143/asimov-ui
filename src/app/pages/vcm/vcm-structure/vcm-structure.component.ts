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
  // @ViewChild('tree',{static: false}) tree : MatTree<any>;
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  vcmProcess:any;
  vcm_id:any;
  isLoading:boolean=false;
  vcmData:any[]=[];
  expandTree = false;
  @ViewChild('tree',{static: false}) tree;

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
  }
  // ngAfterViewInit() {
    
  // }


  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  edit(){
    // sessionStorage.setItem('vcmTree',JSON.stringify(this.vcmProcess));
    // this.router.navigate(['/pages/vcm/create-vcm']);
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

  getselectedVcm(){
    this.isLoading=true;
    let res_data
    this.rest_api.getselectedVcmById(this.vcm_id).subscribe(res=>{res_data=res
      console.log(res);
      this.vcmData=res_data.data.vcmV2;
      // this.vcmData=this.vcmData1
      this.isLoading=false;
      this.dataMappingToTreeStructer1();
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
}

