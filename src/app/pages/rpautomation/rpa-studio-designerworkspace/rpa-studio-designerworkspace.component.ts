import { Component, OnInit,  NgZone ,AfterViewInit,ChangeDetectorRef, EventEmitter,Output,ViewChild, ElementRef, Input , Pipe, PipeTransform, TemplateRef} from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { fromEvent } from 'rxjs';
import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import { RestApiService } from '../../services/rest-api.service';
import { FormGroup, FormControl,Validators,FormBuilder } from '@angular/forms';
import jsPDF from 'jspdf';
import { NotifierService } from 'angular-notifier';
import { Rpa_Hints } from '../model/RPA-Hints';
import { DataTransferService } from "../../services/data-transfer.service";
import { HttpClient,HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
// import { RpaToolsetComponent } from "../rpa-toolset/rpa-toolset.component";
import domtoimage from 'dom-to-image';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RpaStudioDesignerComponent } from '../rpa-studio-designer/rpa-studio-designer.component';
import { SplitComponent } from 'angular-split'

@Component({
  selector: 'app-rpa-studio-designerworkspace',
  templateUrl: './rpa-studio-designerworkspace.component.html',
  styleUrls: ['./rpa-studio-designerworkspace.component.css']
})
export class RpaStudioDesignerworkspaceComponent implements OnInit {
  @Input("bot") public finalbot: any;
  @Input("index") public index:any;
  @Input("toolsetItems") public toolset:any[];
  @Input("environmentsList") public environmentsList:any[];
  @Input("categoriesList") public categoriesList:any[];
  @Output('onCreateBotDetails') public onCreateBotDetails:EventEmitter<any>= new EventEmitter();
  @ViewChild('logspopup',{static:false}) public logsOverlayRef:any;
  @ViewChild('screen', { static: false }) screen: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  filteredEnvironments:any=[];
  VersionsList:any=[]
  // @ViewChild('downloadLink', { static: false }) downloadLink: ElementRef;
  recordandplayid:any;
  jsPlumbInstance;
  public stud: any = [];
  public optionsVisible: boolean = true;
  public scheduler: any;
  schedulerComponentInput:any;
  scheduleOverlayFlag:Boolean=false;
  logsOverlayFlag:Boolean=false;
  logsOverlayModel:any;
  result: any = [];
  fileterdarray:any=[]
  webelementtype:any=[]
  nodes = [];
  selectedNode: any = [];
  changePx: { x: number; y: number; };
  public selectedTask: any;
  public loadflag: Boolean = true;
  fileData: any;
  public hiddenPopUp: boolean = false;
  public hiddenCreateBotPopUp: boolean = false;
  public form: FormGroup;
  unsubcribe: any
  public fields: any[] = [];
  formHeader: string;
  public checkorderflag:Boolean;
  disable: boolean = false;
  lightTheme: boolean = false;
  formVales: any[] = [];
  dragelement: any
  dagvalue: any
  zoomArr = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8];
  indexofArr = 6;
  fieldValues: any[] = [];
  allFormValues: any[] = [];
  saveBotdata: any = [];
  alldataforms: any = [];
  public finaldataobjects: any = []
  dropVerCoordinates: any;
  dragareaid: any;
  outputboxid: any;
  SelectedOutputType: any;
  outputnode: any;
  outputboxresult: any;
  outputboxresulttext: any;
  final_tasks: any = [];
  Image:any;
  files_data:any=[];
  fileobj:any;
  options:any=[];
  restapiresponse:any;
  public rp_url:any="";
  recordedcode:any;
  finalcode:any;
  svg:any;
  finalarray:any=[]
  public insertForm:FormGroup;
  modalRef: BsModalRef;
  outputmodalRef:BsModalRef;
  public passwordtype1:Boolean;
  public passwordtype2:Boolean;
  public form_change:Boolean=false;
  startNodeId:any=""
  stopNodeId:any=""
  actualTaskValue:any=[];
  actualEnv:any=[];
  auditLogs:any=[];
  enableMultiForm:any={
    check:false,
    value:[],
    additionalAttributesList:[]
  };
  isShowExpand:boolean=false;
  splitAreamin_size="200";
  draggableHandle:any;

  @ViewChild('template', { static: false }) template: TemplateRef<any>;
  
  @ViewChild('checkBotTemplate', { static: false }) checkBotTemplate: TemplateRef<any>;
  public nodedata: any;
  categoryList:any=[];
  Webelementtype_array: { "Id": any; "value": any; }[];
  Webelementvalue_array:{"Id":any;"value":any;}[];
  fieldvaluetype_array:{"Id":any;"value":any;}[];
  fieldvalue_array:{"Id":any;"value":any;}[];
  multiformdata: any=[]
  multiarray;any=[];
  spilt_size=70;
  spilt_size1=30;
  public areas = [
    { size: 70, order: 1},
    { size: 30, order: 2},
  ];
  public groupsData:any=[];
  botDetailsForm:FormGroup;
  botNameCheck:boolean=false;
  @ViewChild('splitEl', { static: false }) splitEl: SplitComponent;
  area_splitSize: any = {}

  isBotUpdated:boolean=false;

  constructor(private rest: RestApiService,
    private notifier: NotifierService,
    private hints: Rpa_Hints,
    private dt: DataTransferService,
    private http: HttpClient,
    private RPA_Designer_Component:RpaStudioDesignerComponent,
    // private toolset:RpaToolsetComponent,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private changesDecorator:ChangeDetectorRef,
    private ngZone: NgZone
    ) {

      this.insertForm=this.formBuilder.group({
        userName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        serverName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inBoundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        outBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        outboundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    })
    this.botDetailsForm=  this.formBuilder.group({
      botName: ["", Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_-]*$")])],
      description: ["", Validators.compose([Validators.maxLength(500)])],
      isPredefined: [false]
    });
  }

  ngOnInit() {
     this.passwordtype1=false;
    this.passwordtype2=false;
    this.spinner.show();
    this.jsPlumbInstance = jsPlumb.getInstance();
    var self = this;
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { curviness: 200, cornerRadius:5 }],
      overlays: [
        ["Arrow", { width: 12, length: 12, location: 0.5 }],
        ["Label", { label: "FOO" }]
      ]
    });
    this.SelectedOutputType = "";
    this.dt.changeHints(this.hints.rpaWorkspaceHints);
    this.selectedTask = {
      id: "",
      name: "",
    }
    if (this.finalbot.botId != undefined) {
      // this.finaldataobjects = this.finalbot.tasks.filter((item=>item.version==this.finalbot.version));
      this.finaldataobjects = this.finalbot.tasks;
      this.actualTaskValue=[...this.finalbot.tasks];
      this.actualEnv=[...this.finalbot.envIds];
      this.loadGroups("load");
      this.loadnodes();
      this.getAllVersions();
    }
    this.getSelectedEnvironments();
    this.dragareaid = "dragarea__" + this.finalbot.botName;
    this.outputboxid = "outputbox__" + this.finalbot.botName;
    //this.getCategories();
  }




  getSelectedEnvironments()
  {
    this.filteredEnvironments=[...this.environmentsList.filter((item:any)=>item.categoryId==this.finalbot.categoryId)
      .map(((item2:any)=>{
        if(this.finalbot.envIds.find((item3:any)=>item3==item2.environmentId)!=undefined)
        {
          return {...item2,...{check:true}}
        }else
        {
          return {...item2,...{check:false}}
        }
      }))] 
  }


  checkUncheckEnvironments(envId,value){
    if(this.filteredEnvironments.find((item:any)=>item.environmentId==envId)!=undefined)
      this.filteredEnvironments.find((item:any)=>item.environmentId==envId).check=value;
  }



  ngAfterViewInit() 
  {    
   
    this.jsPlumbInstance = jsPlumb.getInstance();
    var self = this;
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { curviness: 200, cornerRadius:5 }],
      connectorStyle: { stroke: '#404040', strokeWidth: 2 },
      overlays: [
        ["Arrow", { width: 12, length: 12, location: 0.5 }],
        ["Arrow", { width: 12, length: 12, location: 1 }], ["Label", { label: "FOO" }],
      ]
    });

   
  

    this.jsPlumbInstance.bind('connection', info => {
      // alert(info.sourceId);
      var connection = info.connection;
      
      let node_object = this.finaldataobjects.find(object2 => object2.nodeId.split("__")[1] == info.sourceId);

      if(connection.sourceId==this.startNodeId)
      {
        
      let connectionNodeForTarget=this.nodes.find((item:any)=>item.id==connection.targetId);
      if(connectionNodeForTarget.selectedNodeTask=='If condition')
        {
          Swal.fire("Alert","Start Node Should not connect directly to if condition","warning");
            setTimeout(()=>{ 
              this.changesDecorator.detectChanges()
              this.jsPlumbInstance.deleteConnection(connection)
            },1000)
        }
      
      }
      if (node_object != undefined) {

        var source_length = this.jsPlumbInstance.getAllConnections().filter(data => data.sourceId == connection.sourceId).length;
        if (node_object.taskName == "If condition" && source_length < 3 && this.loadflag) {
          Swal.fire({
            title: 'Select True/False case',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Fasle',
            confirmButtonText: 'True'
          }).then((result) => {
            if (result.value) {
                connection.addOverlay(
                  ["Label", {
                  label: "<span class='bg-white text-success'>True<span>",
                  location: 0.8,
                  cssClass: 'aLabel',
                  id: "iflabel"+connection.id
                  }]
                );
               
              let connected_node: any = this.nodes.find(develop => develop.id == connection.targetId);
              let connected_node_id: any = connected_node.name + "__" + connected_node.id;
              let source_node_id = node_object.nodeId;
              if (this.finaldataobjects.find(tasks => tasks.nodeId == source_node_id) != undefined) {
                this.finaldataobjects.find(tasks => tasks.nodeId == source_node_id).attributes.find(attrs => attrs.metaAttrValue == "if").attrValue = connected_node_id;
              }
              
            }
            else {
              connection.addOverlay(
                ["Label", {
                  label: "<span class='bg-white text-danger'>False<span>",
                  location: 0.8,
                  cssClass: 'aLabel',
                  id: "iflabel"+connection.id
                }]
              );
              let connected_node: any = this.nodes.find(develop => develop.id == connection.targetId);
              let connected_node_id: any = connected_node.name + "__" + connected_node.id;
              if (this.finaldataobjects.find(tasks => tasks.nodeId == node_object.nodeId) != undefined) {
                this.finaldataobjects.find(tasks => tasks.nodeId == node_object.nodeId).attributes.find(attrs => attrs.metaAttrValue == "else").attrValue = connected_node_id;
              }

            }
          });
        }


      }
  
      else{
        let connectionNodeForSource=this.nodes.find((item:any)=>item.id==info.sourceId);
        if(connectionNodeForSource!=undefined)
        {
          if(connectionNodeForSource.selectedNodeTask=='If condition')
          {
            Swal.fire("Alert","Please do config before adding connections for if condition","warning");
            setTimeout(()=>{ 
              this.changesDecorator.detectChanges()
              this.jsPlumbInstance.deleteConnection(connection)
            },1000)
          }
        }
       
   

      }
      
      this.setConnectionLabel(info.connection);
    });


    this.jsPlumbInstance.bind("click", function (info) {
      var connection = info.connection;
      this.jsPlumbInstance.detach(info);
    });
    if (this.finalbot.botId != undefined) {
      this.addconnections(this.finalbot.sequences)
      
      //this.child_rpa_studio.spinner.hide()
      this.dragelement = document.querySelector('#' + this.dragareaid);

    }




  }


  addTasksToGroups()
  {
      setTimeout(()=>{
        this.savedGroupsData.forEach((item:any)=>{
          if(item.nodeIds.length!=0)
          {
            item.nodeIds.forEach((node:any)=>{

              let nodeElement:any=document.getElementById(node);
              let groupElement:any=document.getElementById(item.groupId)
              this.jsPlumbInstance.addToGroup(item.groupId, nodeElement);
            })
          }
        })
      })
  }
  public coordinates:any;
  public loadnodes() {
    this.finaldataobjects.forEach((element,index )=> {
      let inseq=String(element.inSeqId);
      let outseq=String(element.outSeqId);
      if(inseq.split("_")[0]=="START"){
        if(element.x.split("|").length==3)
        {

          this.coordinates={
            startTaskX:element.x.split("|")[1],
            startTaskY:element.y.split("|")[1],
            stopTaskX:element.x.split("|")[2],
            stopTaskY:element.y.split("|")[2]
          }
          element.x=element.x.split("|")[0];
          element.y=element.y.split("|")[0];
        }
        let startnode = {
          id: inseq,
          name: "START",
          selectedNodeTask: "",
          selectedNodeId: "",
          path: "/assets/images/RPA/Start.png",
        }
        if(this.coordinates!=undefined)
        {
          startnode["x"]=this.coordinates.startTaskX==undefined?"10px":this.coordinates.startTaskX;
          startnode["y"]=this.coordinates.startTaskY==undefined?"10px":this.coordinates.startTaskY;
        }
        else
        {
          startnode["x"]="10px";
          startnode["y"]="10px";
        }
       
        this.startNodeId=startnode.id
        if(this.nodes.find(item=>item.id==startnode.id)==undefined)
        {
          this.nodes.push(startnode);
          setTimeout(() => {
            this.populateNodes(startnode);
          }, 240);
        }
      }
      if(outseq.split("_")[0]=="STOP"){
          //let coordinates=(this.finaldataobjects[0].nodeId.split("|")!=undefined)?this.finaldataobjects[0].nodeId.split("|"):undefined;
       
        let stopnode = {
          id: outseq,
          name: "STOP",
          selectedNodeTask: "",
          selectedNodeId: "",
          path: "/assets/images/RPA/Stop.png",
          // x: "900px",
          // y: "396px",
          // x: (this.coordinates[3]!=undefined)?(this.coordinates[3]+"px"):"900px",
          // y: (this.coordinates[4]!=undefined)?(this.coordinates[4]+"px"):"300px",

        }
        if(this.coordinates!=undefined)
        {
          stopnode["x"]=this.coordinates.stopTaskX==undefined?"900px":this.coordinates.stopTaskX;
          stopnode["y"]=this.coordinates.stopTaskY==undefined?"300px":this.coordinates.stopTaskY;
         
        }
        else
        {
          stopnode["x"]="900px";
          stopnode["y"]="300px";
        }
        this.stopNodeId=stopnode.id
        if(this.nodes.find(item=>item.id==stopnode.id)==undefined)
        {
          this.nodes.push(stopnode);
          setTimeout(() => {
            this.populateNodes(stopnode);
          }, 240);
        }

      }
      let templatenodes:any=[]
      let nodename = element.nodeId.split("__")[0];
      let nodeid = element.nodeId.split("__")[1];
      templatenodes=this.toolset;
      let node = {
        id: nodeid,
        name: nodename,
        selectedNodeTask: element.taskName,
        selectedNodeId: element.tMetaId,
        path: this.toolset.find(data => data.name == nodename).path,
        tasks: this.toolset.find(data => data.name == nodename).tasks,
      }
      let checkFlag:any=[]
      checkFlag=this.savedGroupsData.filter((groupData:any)=>{
        if(groupData.nodeIds.find(item=>item==nodeid)!=undefined)
          return groupData;
      })
      if(checkFlag.length==0)
      {
        node["x"]= element.x
        node["y"]= element.y
      }
      else
      {
        let group:any=checkFlag[0];
        node["x"]=(parseFloat(group.x.split("px")[0]))+(parseFloat(element.x.split("px")[0]))+"px";
        node["y"]=(parseFloat(group.y.split("px")[0]))+(parseFloat(element.y.split("px")[0]))+"px";
      }
      if(this.nodes.find(item=>item.id==node.id)==undefined)
      {
        this.nodes.push(node);
        setTimeout(() => {
          this.populateNodes(node);
        }, 240);
      }

    });
  }



  public addconnections(sequences) {
    setTimeout(() => {
      this.loadflag = false;
      sequences.forEach(element => {
        this.jsPlumbInstance.connect(
          {
            endpoint: ['Dot', {
              radius: 3,
              cssClass: "myEndpoint",
              width: 8,
              height: 8,
            }],

            source: element.sourceTaskId,
            target: element.targetTaskId,

            anchors: ["Right", "Left"],
            detachable: true,
            
            paintStyle: {  stroke: "#404040",  strokeWidth: 2 },
            // connectorStyle: {
            //   lineWidth: 3,
            //   strokeStyle: "red"
            // },
          //   Connector: ["Flowchart", { curviness: 90, cornerRadius: 5 }],
          //   connectorClass: "path",
          //  // connectorStyle: { stroke: '#404040', strokeWidth: 2 },
          //   connectorHoverStyle: { lineWidth: 3 },
            overlays: [["Arrow", { width: 12, length: 12, location: 1 }],],
          })

          

      });
      this.loadflag = true;
      this.addTasksToGroups();
    });

  }

  delconn:Boolean=false;
  setConnectionLabel(connection) {
   let self=this;
   var delconn=false
   connection.addOverlay(["Label", { 
    label: "<span style='padding:10px'><i class='text-danger fa fa-times' style=' padding: 5px; background: white; cursor: pointer;'></i></span>",
    location:0.5, 
    cssClass: "connLabel",
    id:"label"+connection.id,
    events:{
      click:function(labelOverlay, originalEvent) {
   
      let conn=self.jsPlumbInstance.getConnections({
          source:labelOverlay.component.sourceId,
          target:labelOverlay.component.targetId
        });
        delconn=true
        conn[0].removeOverlay("label"+conn[0].id);
        setTimeout(()=>{

          self.jsPlumbInstance.deleteConnection(conn[0]);
          
          self.delconn=false;
        },100)
        
      }
    } 
    }]);
    
    connection.getOverlay("label"+connection.id).setVisible(false);
    connection.bind("mouseover", function(conn) {
      
      connection.getOverlay("label"+conn.id).setVisible(true);
       
    }); 
    if(self.jsPlumbInstance.getAllConnections().find(item=>item.sourceId==connection.sourceId && item.targetId==connection.targetId)!=undefined)
    connection.bind("mouseout", function(conn) {
        setTimeout(()=>{
          if(!delconn)
          {
            conn.getOverlay("label"+conn.id).setVisible(false);
          }
        },1500);
      
    });
}




  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }




  onDrop(event: DndDropEvent, e: any) {
    this.dragelement = document.querySelector("#" + this.dragareaid);
    this.dagvalue = this.dragelement.getBoundingClientRect().width / this.dragelement.offsetWidth;
    e.event.toElement.oncontextmenu = new Function("return false;");

    this.stud = [];
    this.optionsVisible = true;
    const obs = fromEvent(document.body, '  ').subscribe(e => {
    });
    this.changePx = this.getMousePos(event.event.target, event);

    var mousePos = this.getMousePos(event.event.target, event);
    const dropCoordinates = {
      x: mousePos.x + 'px',
      y: mousePos.y + 'px'
    };
    if(event.data.botId!=undefined)
    {
      this.loadPredefinedBot(event.data.botId, dropCoordinates);
      //this.RPA_Designer_Component.current_instance.loadpredefinedbot(event.data.botId, dropCoordinates)
    }
    else
    {
      const node = event.data;
      node.id = this.idGenerator();
      // node.selectedNodeTask = "";
      // node.selectedNodeId = "";
      const nodeWithCoordinates = Object.assign({}, node, dropCoordinates);
      this.nodes.push(nodeWithCoordinates);
      setTimeout(() => {
        this.populateNodes(nodeWithCoordinates);
        // this.autoSaveLoopEnd(nodeWithCoordinates)
        this.autoSaveTaskConfig(nodeWithCoordinates);
      }, 240);

      if (this.nodes.length == 1) {
        let node = {
          id: "START_" + this.finalbot.botName,
          name: "START",
          selectedNodeTask: "",
          selectedNodeId: "",
          path: "/assets/images/RPA/Start.png",
          x: "2px",
          y: "9px",
        }
        this.startNodeId=node.id
        this.nodes.push(node);
        setTimeout(() => {
          this.populateNodes(node);
        }, 240);


        let stopnode = {
          id: "STOP_" + this.finalbot.botName,
          name: "STOP",
          selectedNodeTask: "",
          selectedNodeId: "",
          path: "/assets/images/RPA/Stop.png",
          x: "941px",
          y: "396px",
        }
        this.stopNodeId=stopnode.id
        this.nodes.push(stopnode);
        setTimeout(() => {
          this.populateNodes(stopnode);
        }, 240);


      }
    }
  }

  autoSaveLoopEnd(node){
   if(node.selectedNodeTask=='Loop-End'){
    this.rest.attribute(node.selectedNodeId).subscribe((res:any)=>{        
         let data=res;       
           let obj={}
        data.map(ele=>{
            obj[ele.name+'_'+ele.id]=ele.value;
         })   
         this.onFormSubmit(obj,false)
    })
     
   }
  }


  idGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  updateCoordinates(dragNode) {
    var nodeIndex = this.nodes.findIndex((node) => {
      return (node.id == dragNode.id);
    });
    this.nodes[nodeIndex].x = dragNode.x;
    this.nodes[nodeIndex].y = dragNode.y;
  }



  populateNodes(nodeData) {
    const nodeIds = this.nodes.map(function (obj) {
      return obj.id;
    });
    var self = this;
    this.jsPlumbInstance.draggable(nodeIds,
      {
        containment: true,
        stop: function (element) {
          self.updateCoordinates(element)
        }
      });

    const rightEndPointOptions = {
      endpoint: ['Dot', {
        radius: 2,
        cssClass: "myEndpoint",
        width: 8,
        height: 8,
      }],

      paintStyle: { stroke: "#d7eaff", fill: "#d7eaff", strokeWidth: 2 },
      isSource: true,
      connectorStyle: { stroke: '#404040', strokeWidth: 2 },
      anchor: 'Right',
      maxConnections: -1,
      cssClass: "path",
      Connector: ["Flowchart", { curviness: 90, cornerRadius: 5 }],
      connectorClass: "path",
      connectorOverlays: [['Arrow', { width: 10, length: 10, location: 1 }]],


    };
    const leftEndPointOptions = {
      endpoint: ['Dot', {
        radius: 2,
        cssClass: "myEndpoint",
        width: 8,
        height: 8,
      }],
      paintStyle: { stroke: "#d7eaff", fill: "#d7eaff", strokeWidth: 2 },
      isTarget: true,
      connectorStyle: { stroke: '#404040', strokeWidth: 2 },
      anchor: 'Left',
      maxConnections: -1,
      Connector: ["Flowchart", { curviness: 90, cornerRadius: 5 }],
      cssClass: "path",
      connectorClass: "path",
      connectorOverlays: [['Arrow', { width: 10, length: 10, location: 1 }]],
    
    };
    if (nodeData.name != "STOP")
      this.jsPlumbInstance.addEndpoint(nodeData.id, rightEndPointOptions);
    if (nodeData.name != "START")
      this.jsPlumbInstance.addEndpoint(nodeData.id, leftEndPointOptions);

  }




  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.event.clientX - rect.left,
      y: evt.event.clientY - rect.top
    };
  }




  callFunction(menu, tempnode) {
    this.optionsVisible = false;
    this.hiddenPopUp = false;
    this.nodes.find(data => data.id == tempnode.id).selectedNodeTask = menu.name
    this.nodes.find(data => data.id == tempnode.id).selectedNodeId = menu.id
    let type = "info";
    let message = `${menu.name} is Selected`
    this.notifier.notify(type, message);
    this.selectedTask = menu;

  }


  deletenode(node) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.nodes.splice(this.nodes.indexOf(node), 1)
        this.jsPlumbInstance.remove(node.id)
        let nodeId=node.name + "__" + node.id;
        let task=this.finaldataobjects.find(task => task.nodeId == nodeId);
        if(task!=undefined)
        {
          this.finaldataobjects.splice(this.finaldataobjects.indexOf(task),1)
        }
      }
    });
  }





  onRightClick(n: any, e: { target: { id: string; } }, i: string | number) {
    this.selectedNode = n;
    this.stud = [];
    if (n.tasks.length > 0) {
      if (this.optionsVisible == true) {
        this.optionsVisible = false;
      } else {
        this.optionsVisible = true;
        n.tasks.forEach(element => {
          let temp: any = {

            name: element.name,
            id: element.taskId
          };
          this.stud.push(temp)
        })

      }

    }

    else {
      this.optionsVisible = false
      this.stud = [{
        name: "No Options"
      }]

    }
  }

  getFields() {
    return this.fields;
  }

  ngDestroy() {
    this.unsubcribe();
  }


  // Will create get attributes and set values and generate form
  getTaskForm(node) {
    
    this.nodedata=node
    this.form_change=false;
    this.enableMultiForm.check=false;
    if (node.selectedNodeTask != "") 
    {
      this.selectedTask = {
        name: node.selectedNodeTask,
        id: node.selectedNodeId
      }
      this.formHeader = node.name + " - " + node.selectedNodeTask;
      this.selectedNode = node;
      let taskdata = this.finaldataobjects.find(data => data.nodeId == node.name + "__" + node.id);
      if (taskdata != undefined) 
      {
        if (taskdata.tMetaId == node.selectedNodeId) 
        {
          let finalattributes: any = [];
          this.rest.attribute(node.selectedNodeId).subscribe((data) => {
            finalattributes = data
            //if(finalattributes.length==1 && finalattributes[0].type=="multiform")
            if(finalattributes[0].type=="multiform")
            {
              
              this.multiformdata=finalattributes
              this.enableMultiForm.check=true;
              let additionalAttributesList=[...finalattributes.filter(item=>item.type!='multiform')];
              if(taskdata.attributes.length!=0)
              {
                let multiFormValue:any=[];
                let multiformAttribute=finalattributes.find(item=>item.type=='multiform');
                taskdata.attributes.forEach((maxmad)=>{
                    
                    if(multiformAttribute.id==maxmad.metaAttrId)
                    {
                      if(maxmad.attrValue=='' || maxmad.attrValue==null)
                      {
                        multiFormValue=[];
                      }
                      else
                      {
                        multiFormValue=[...JSON.parse(maxmad.attrValue)];
                      }
                    }
                    else
                    {
                      if(additionalAttributesList.find(attr => attr.id == maxmad.metaAttrId)!=undefined)
                        additionalAttributesList.find(attr => attr.id == maxmad.metaAttrId).value = maxmad.attrValue;  
                    }
                })
                this.enableMultiForm.additionalAttributesList=additionalAttributesList;
                this.openMultiForm(finalattributes,node,multiFormValue)
              }
              else
              {
                this.enableMultiForm.additionalAttributesList=additionalAttributesList;
                this.openMultiForm(finalattributes, node, []);
              }
            }
            else
            {
              taskdata.attributes.forEach(element => {
                if(finalattributes.find(data => data.id == element.metaAttrId).type=='restapi')
                {
                  if(element.attrValue!='' && element.attrValue!=undefined)
                  {
                    let attr_val=JSON.parse(element.attrValue);
                    let attrnames=Object.getOwnPropertyNames(attr_val);
                    finalattributes.find(data => data.id == element.metaAttrId).value=attr_val[attrnames[0]];
                  }
                }
                else
                {
                  finalattributes.find(data => data.id == element.metaAttrId).value = element.attrValue;
                }

              });
              if(finalattributes.find(attr=>attr.taskId==71)!=undefined)
              {
                this.formVales = finalattributes;
                this.update_record_n_play(finalattributes, node)
              }
              else if(finalattributes.find(attr=>attr.type=='restapi')!=undefined)
              {
                this.addoptions(finalattributes, node);
              }
              else
              {
                this.response(finalattributes,node);
              }
            }
          });
        }
        else {
          this.rest.attribute(node.selectedNodeId).subscribe((data) => {
            this.response(data,node)
          })
        }
      }
      else {

        this.rest.attribute(node.selectedNodeId).subscribe((data) => {
          let attr_response:any=data;
          this.multiformdata=data
          //if(attr_response.length==1 && attr_response[0].type=="multiform")
          if(attr_response.find(item=>item.type=="multiform")!= undefined)
          {
            this.enableMultiForm.check=true
            this.enableMultiForm.additionalAttributesList=[...attr_response.filter(item=>item.type!='multiform')];
            this.openMultiForm(attr_response, node, []);
          }
          else if(node.selectedNodeTask=="Record & Play")
          {
              this.formVales = attr_response;
              this.recordandplayid="recordandplay_"+this.finalbot.botName+"_"+node.id;
              document.getElementById('recordandplay').style.display='block';
          }
          else if(attr_response.find(attr=>attr.type=='restapi')!=undefined)
          {
             this.addoptions(attr_response, node);
          }
          else
          {
            this.response(attr_response,node);
          }
        })
      }
    }else
    {
      Swal.fire("Please select task","","warning");
    }
  }


  openMultiForm(attr_data, node,value)
  {
    this.rest.getMultiFormAttributes(attr_data[0].dependency).subscribe(attributes=>{
      this.enableMultiForm.value=value;
      this.multiarray=value
      this.response(attributes,node)
    })
  }

  update_record_n_play(finalattributes, node)
  {
    if(finalattributes.find(attr=>attr.taskId==71).value!=undefined)
    {
      $("#record_n_play").val(finalattributes.find(attr=>attr.taskId==71).value);
      document.getElementById('recordandplay').style.display='block';
    }
  }


  addoptions(attributes,node)
  {
    /*
      let token={​​​​​
        headers: new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('accessToken')),
      }​​​*/
      let options:any=[];​​
      let restapi_attr=attributes.find(attr => attr.type=='restapi');
      this.rest.get_dynamic_data(restapi_attr.dependency).subscribe(data=>
      {
        this.restapiresponse=data
        if(this.restapiresponse.length!=0){
        let attrnames=Object.getOwnPropertyNames(this.restapiresponse[0]);
        this.restapiresponse.forEach(data_obj=>{
          let key={
              key:data_obj[attrnames[0]],
              label:data_obj[attrnames[1]],
            }
            options.push(key);
        })
      }
        attributes.find(attr => attr.type=='restapi').options=options;
        this.response(attributes,node);
      });


  }



  response(data,node)
  {
    if (data.error == "No Data Found") {
      this.fields = [];
      let type = "info";
      let message = "No Data Found"
      this.notifier.notify(type, message);
    } else {
      this.fields = [];
      this.hiddenPopUp = true;
      this.form_change=true;
      data.forEach(element => {
        element.nodeId=node.id;
        if (element.type == "multipart") {
          element.onUpload = this.onUpload.bind(this)
        }
        if (element.type == "dropdown") {
          ///element.onChange = this.onChange.bind(this)
        }
      });
      this.formVales = data
      //this.alldataforms.push(this.formVales)
      this.fields = data
      this.form = new FormGroup({
        fields: new FormControl(JSON.stringify(this.fields))
      })
      this.unsubcribe = this.form.valueChanges.subscribe((update) => {
        this.fields = JSON.parse(update.fields);
      })
      this.areas = [
        { size: 70, order: 1},
        { size: 30, order: 2},
      ];
      setTimeout(() => {
        this.splitEl.dragProgress$.subscribe(x => {
          this.ngZone.run(() =>{
             this.area_splitSize = x
             this.isShowExpand=false;
             if(x.sizes[1] < 30){
              this.splitAreamin_size="200";
             }
            });
        });
      }, 500);
    }
  }

  onUpload(event ,field) {
    let data:any={
      file:event.target.files[0],
      attrId:field.id,
      nodeId:field.nodeId,
    }
    this.fileobj=event.target.files[0];
    let attr_data=this.files_data.find(check=>(check.nodeId==field.nodeId && field.id==check.attrId))
    if(attr_data==undefined)
    {
      this.files_data.push(data)
    }
    else
    {
      this.files_data.find(check=>(check.nodeId==field.nodeId && field.id==check.attrId)).file=event.target.files[0];
    }
  }


  onChange(e) {
    this.fields.map(ele => {
      if (ele.dependency == e) {
        ele.visibility = true
        ele.required = true
      }
      if (ele.dependency != e && ele.dependency != '') {
        ele.visibility = false
        ele.required = false
      }
      return ele
    })
  }


  recording(command)
  {
      let editorExtensionId="efhogiiggfblodigpphpedpbkclgfcje"
       window["chrome"].runtime.sendMessage(editorExtensionId, {url: this.rp_url,data:command},
        function(response) {
          let code:any;
          code=response;
          let completecode="describe('My First Test', () => { \n it('Test case', () => { \n";
          code.code.codeBlocks.forEach(statment=>{
            completecode=completecode+statment.value+"\n";
          });
          completecode=completecode+"}) \n })";
          $("#record_n_play").val(completecode);
        });
  }

  submitcode()
  {
    let data={
      "codeSnippet":$("#record_n_play").val()
    }
    this.close_record_play();
    this.onFormSubmit(data, true);
  }



  close_record_play(){
    document.getElementById('recordandplay').style.display='none';
  }



  //MultiForm Submit
  submitform(event){
    let multiformResult = event
    // if (this.fieldValues['file1']) {
    //   this.fieldValues['file1'] = this.fieldValues['file1'].substring(12)
    // }
    // if (this.fieldValues['file2']) {
    //   this.fieldValues['file2'] = this.fieldValues['file2'].substring(12)
    // }
    // if (this.fileData != undefined) {
    //   this.fieldValues['file'] = this.fileData
    // }
    this.hiddenPopUp = false; 

//  for(let i=0;i<this.fieldValues.length;i++){
  
//    this.Webelementtype_array = this.fieldValues.map(p=>{
//     return{
//       "Id": p.id,
//       "value": p.webElementType_223
//     }
//     });

//     this.Webelementvalue_array=this.fieldValues.map(p=>{
//       return{
//         "Id":p.id,
//         "value":p.webElementValue_224
//       }
//     })

//     this.fieldvaluetype_array=this.fieldValues.map(p=>{
//       return{
//         "Id":p.id,
//         "value":p.fillValueType_222
//       }
//     })

//     this.fieldvalue_array=this.fieldValues.map(p=>{
//       return{
//         "Id":p.id,
//         "value":p.fillValue_225
//       }
//     })
  
//   //this.fileterdarray.push(this.selectedresource)
  
//  }


 
  
  this.fileterdarray = this.multiformdata.map(p=>{
    let responseData={}
    if(p.type=="multiform")
      responseData={
        "metaAttrId": p.id,
        "metaAttrValue": p.name,
        "attrValue":JSON.stringify(multiformResult.multiform)
      }
    else
    {
      responseData={
        "metaAttrId": p.id,
        "metaAttrValue": p.name,
        "attrValue":multiformResult.otherFormData[p.name+'_'+p.id]
      }
    }

    let index = this.finaldataobjects.findIndex(sweetdata => sweetdata.nodeId == (this.selectedNode.name + "__" + this.selectedNode.id))
    let savedTaskIndex=this.actualTaskValue.findIndex(sweetdata => sweetdata.nodeId == (this.selectedNode.name + "__" + this.selectedNode.id))
    if (index != undefined && index >= 0 && savedTaskIndex != undefined && savedTaskIndex >= 0 ) {
      if(this.actualTaskValue[savedTaskIndex].attributes.find((attrItem:any)=>attrItem.metaAttrId==p.id)!=undefined)
      {
        responseData["attrId"]=this.actualTaskValue[savedTaskIndex].attributes.find((attrItem:any)=>attrItem.metaAttrId==p.id).attrId;
        responseData["botTaskId"]=this.actualTaskValue[savedTaskIndex].botTId;
      }
    }
    
    return responseData;
    //   if(p.name=='webElementType'){
    //     return{
    //       "metaAttrId": p.id,
    //       "metaAttrValue": p.name,
    //       "attrValue":this.Webelementtype_array
    //     }
    //   }
    //  if(p.name=='webElementValue'){
    //    return{
    //     "metaAttrId": p.id,
    //     "metaAttrValue": p.name,
    //     "attrValue":this.Webelementvalue_array
    //    }
    //  }
    //  if(p.name=='fillValueType'){
    //    return{
    //     "metaAttrId": p.id,
    //     "metaAttrValue": p.name,
    //     "attrValue":this.fieldvaluetype_array
    //    }
    //  }
    //  if(p.name=='fillValue'){
    //   return{
    //     "metaAttrId": p.id,
    //     "metaAttrValue": p.name,
    //     "attrValue":this.fieldvalue_array
    //    }
    //  }
     });
  
 
    let cutedata = {

      "taskName": this.selectedTask.name,
      "tMetaId": parseInt(this.selectedTask.id),
      "taskSubCategoryId": "1",
      "inSeqId": 1,
      "outSeqId": 2,
      "nodeId": this.selectedNode.name + "__" + this.selectedNode.id,
      "x": this.selectedNode.x,
      "y": this.selectedNode.y,
      "attributes": this.fileterdarray,
      
    }
    let index = this.finaldataobjects.findIndex(sweetdata => sweetdata.nodeId == cutedata.nodeId)
    let savedTaskIndex=this.actualTaskValue.findIndex(sweetdata => sweetdata.nodeId == cutedata.nodeId)
    // if (savedTaskIndex != undefined && savedTaskIndex >= 0) {
    //   cutedata["botTId"]=this.actualTaskValue[savedTaskIndex].botTId;
    //   this.finaldataobjects[index] = cutedata;
    // } else {
    //   this.finaldataobjects.push(cutedata);
    // }


    if(index != undefined && index >= 0 && savedTaskIndex != undefined && savedTaskIndex >= 0)
    {
      cutedata["botTId"]=this.actualTaskValue[savedTaskIndex].botTId;
      this.finaldataobjects[index] = cutedata;
    }
    else if (index != undefined && index >= 0  &&  savedTaskIndex < 0) {
      this.finaldataobjects[index] = cutedata;
    } 
    else
    {
      this.finaldataobjects.push(cutedata);
    }
    this.notifier.notify("info", "Data Saved Successfully");
  }


  //Normal Task Form Submit
  onFormSubmit(event:any, notifierflag:boolean) {
    this.fieldValues = event;
    this.isBotUpdated=true;
    if (this.fieldValues['file1']) {
      this.fieldValues['file1'] = this.fieldValues['file1'].substring(12)
    }
    if (this.fieldValues['file2']) {
      this.fieldValues['file2'] = this.fieldValues['file2'].substring(12)
    }
    if (this.fileData != undefined) {
      this.fieldValues['file'] = this.fileData
    }
    this.hiddenPopUp = false;
    let objAttr: any;
    let obj: any = [];
    this.formVales.forEach((ele, i) => {
      if (ele.visibility == true) {
        //let objKeys = Object.keys(this.fieldValues);
        objAttr = {
          "metaAttrId": ele.id,
          "metaAttrValue": ele.name,
          "attrValue": '',
          "label":ele.label
        }

        let index = this.finaldataobjects.findIndex(sweetdata => sweetdata.nodeId == (this.selectedNode.name + "__" + this.selectedNode.id))
        let savedTaskIndex=this.actualTaskValue.findIndex(sweetdata => sweetdata.nodeId == (this.selectedNode.name + "__" + this.selectedNode.id))
        if (index != undefined && index >= 0 && savedTaskIndex != undefined && savedTaskIndex >= 0 ) {
          if(this.actualTaskValue[savedTaskIndex].attributes.find((attrItem:any)=>attrItem.metaAttrId==ele.id)!=undefined)          
            objAttr["attrId"]=this.actualTaskValue[savedTaskIndex].attributes.find((attrItem:any)=>attrItem.metaAttrId==ele.id).attrId;
            objAttr["botTaskId"]=this.actualTaskValue[savedTaskIndex].botTId; 
          }
        if(ele.type=="checkbox" && this.fieldValues[ele.name+"_"+ele.id]=="")
        {
          objAttr["attrValue"]="false";
        }
        else if(ele.type=="restapi")
        {
          if(this.fieldValues[ele.name+'_'+ele.id]!='' && this.fieldValues[ele.name+'_'+ele.id]!=undefined)
          {
            let attrnames=Object.getOwnPropertyNames(this.restapiresponse[0]);
            objAttr["attrValue"]=JSON.stringify(this.restapiresponse.find(data=>this.fieldValues[ele.name+'_'+ele.id]==data[attrnames[0]]));
          }
        }
        else if(ele.type=="multipart")
        {
          if(this.fieldValues[ele.name+'_'+ele.id]=="")
          {
            let task=this.finaldataobjects.find(x=>x.nodeId==this.selectedNode.id);
            if(task!=undefined)
            {
              let attval=task.attributes.find(a=>a.metaAttrId==ele.id)
              if(attval!=undefined)
              {
                objAttr["attrValue"]=attval.attrValue;
              }
            }
            else
            {
              objAttr["attrValue"]=this.fieldValues[ele.name+'_'+ele.id];
            }
          }
          else
          {
            objAttr["attrValue"]=this.fieldValues[ele.name+'_'+ele.id];
            let file_res:any=this.files_data.find(rec=>rec.attrId==ele.id && rec.nodeId==this.selectedNode.id)
            if(file_res!=undefined)
            {
              objAttr["file"]=file_res.file;
              objAttr["attrValue"]=file_res.file.name;
            }
          }
        }
        else
        {
          objAttr["attrValue"]=this.fieldValues[ele.name+'_'+ele.id];
        }
        obj.push(objAttr);
      }
    })

    let cutedata = {
      "taskName": this.selectedTask.name,
      "tMetaId": parseInt(this.selectedTask.id),
      "inSeqId": 1,
      "taskSubCategoryId": "1",
      "outSeqId": 2,
      "nodeId": this.selectedNode.name + "__" + this.selectedNode.id,
      "x": this.selectedNode.x,
      "y": this.selectedNode.y,
      "attributes": obj,
    }
    let index = this.finaldataobjects.findIndex(sweetdata => sweetdata.nodeId == cutedata.nodeId)
    let savedTaskIndex=this.actualTaskValue.findIndex(sweetdata => sweetdata.nodeId == cutedata.nodeId)
    if(index != undefined && index >= 0 && savedTaskIndex != undefined && savedTaskIndex >= 0)
    {
      cutedata["botTId"]=this.actualTaskValue[savedTaskIndex].botTId;
      this.finaldataobjects[index] = cutedata;
    }
    else if (index != undefined && index >= 0  &&  savedTaskIndex < 0) {
      this.finaldataobjects[index] = cutedata;
    } 
    else
    {
      this.finaldataobjects.push(cutedata);
    }
    if(notifierflag)
      this.notifier.notify("info", "Data Saved Successfully");
  }

  // async saveBotFun(botProperties, env) {
  //   this.checkorderflag=true;
  //   this.addsquences();
  //   this.arrange_task_order(this.startNodeId);
  //   this.get_coordinates();
  //   await this.getsvg();
  //     this.saveBotdata = {
  //       "botName": botProperties.botName,
  //       "botType": botProperties.botType,
  //       "description": botProperties.botDescription,
  //       "department": botProperties.botDepartment,
  //       "botMainSchedulerEntity": this.scheduler,
  //       "envIds": env,
  //       "isPredefined": botProperties.predefinedBot,
  //       "tasks": this.final_tasks,
  //       "createdBy": "admin",
  //       "lastSubmittedBy": "admin",
  //       "scheduler": this.scheduler,
  //       "svg":this.svg,
  //       "groups":this.getGroupsInfo(),
  //       "sequences": this.getsequences(),
  //     }
  //     if(this.checkorderflag==false)
  //     {
  //       return  false;
  //     }
  //     else
  //     {
  //       return  await  this.rest.saveBot(this.saveBotdata)
  //     }
  // }

  async uploadfile(envids)
  {
    let tasks:any=[];
    tasks=this.finaldataobjects.filter(data=>data.tMetaId==64);
    for(let filedata of tasks)
    {
      let filepath:any=filedata.attributes.find(data_file_rpa=>(data_file_rpa.metaAttrId==278));
      if(filepath!=undefined)
      {
        let form = new FormData();
        let file = new Blob([filepath.file]);
        form.append("file",filepath.file);
        let uploadrest:any=await  this.rest.uploadfile(form,envids);
        await uploadrest.subscribe(res=> {
          if(res[0].Path!=undefined)
          {
            this.notifier.notify("info","File Uploaded Successfully");
          }
        })
      }
    }
  }

  getsequences() {
    let connections: any = [];
    let nodeconn: any;
    this.jsPlumbInstance.getAllConnections().forEach(data => {

      nodeconn = {
        sequenceName: data.getId(),
        sourceTaskId: data.sourceId,
        targetTaskId: data.targetId,
      }
      connections.push(nodeconn)

    })
    return connections;
  }

  closemenu() {
    this.optionsVisible = false;
    this.nodes.forEach(node => {
      if (document.getElementById("output_" + node.id) != undefined) {
        document.getElementById("output_" + node.id).style.display = "none";
      }
    })
  }

  resetDesigner() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset designer!'
    }).then((result:any) => {
      if(result.value)
      {
        this.jsPlumbInstance.deleteEveryEndpoint()
        this.nodes = [];
        this.finaldataobjects = [];
        this.groupsData=[]
      }
    });
  }

  
  checkBotDetails(versionType, comments, botDetails)
  {
    if(this.finalbot.botId==undefined)
    {
      this.botDetailsForm.get("botName").setValue(this.finalbot.botName);
      this.botDetailsForm.get("description").setValue(this.finalbot.description);
      this.botDetailsForm.get("isPredefined").setValue(this.finalbot.isPredefined);
      this.finalbot["versionType"]=versionType;
      this.finalbot["comments"]=comments;
      this.modalRef = this.modalService.show(this.checkBotTemplate);
    }
    else
    {
      this.updateBotFun(versionType, comments);
    }
  }

  validateBotName() {
    let botname = this.botDetailsForm.get("botName").value;
    this.rest.checkbotname(botname).subscribe(data => {
      if (data == true) {
        this.botNameCheck = false;
      } else {
        this.botNameCheck = true;
      }
    })
  }
  
  
  saveBotDetailsAndUpdate(versionType, comments, botDetails)
  {
      this.spinner.show();
      let finalBotDetails={...this.finalbot,...botDetails}
      this.rest.createBot(finalBotDetails).subscribe((response:any)=>{
        this.finalbot=response;
        this.onCreateBotDetails.emit({index:this.index, botName:response.botName})
        let url=window.location.hash;
        window.history.pushState("", "", url.split("botId")[0]+"botId="+response.botId);
        this.updateBotFun(versionType, comments)
      },err=>{
        console.log(err)
        this.spinner.hide();
        Swal.fire("Error","Unable to create bot","error")
      })
    
   
  }
  async updateBotFun(version_type,comments) {
    let env=[...this.filteredEnvironments.filter((item:any)=>item.check==true).map((item2:any)=>{
      return item2.environmentId
    })];
    this.spinner.show();
    this.checkorderflag=true;
    this.addsquences();
    this.arrange_task_order(this.startNodeId);
    this.get_coordinates();
    await this.getsvg();
    this.rpaAuditLogs(env);
    this.saveBotdata = {
      "versionType":version_type,
      "comments":comments,
      "version": this.finalbot.version,
      "botId": this.finalbot.botId,
      "botName": this.finalbot.botName,
      "botType": this.finalbot.botType,
      "description": this.finalbot.botDescription,
      "department": this.finalbot.botDepartment,
      "botMainSchedulerEntity":null,
      "envIds": env,
      "isPredefined": this.finalbot.predefinedBot,
      "tasks": this.final_tasks,
      "createdBy": "admin",
      "groups":this.getGroupsInfo(),
      "lastSubmittedBy": "admin",
      "scheduler": null,
      "svg":this.svg,
      "sequences": this.getsequences()
    }
   
    if(this.checkorderflag==false)
    {
      this.spinner.hide();
      Swal.fire("Warning","Please check connections","warning")
    }
    else
    {
      let previousBotDetails:any={...{},...this.finalbot};
      (await this.rest.updateBot(this.saveBotdata)).subscribe((response:any)=>{
        this.spinner.hide()
        if(response.errorMessage==undefined)
        {
          this.isBotUpdated=false;
          this.finalbot={...{},...response};
          let filterDta= response.tasks.filter((item:any)=>item.version==response.version);
          this.finaldataobjects=[...filterDta];
          this.actualTaskValue=[...filterDta];
          this.actualEnv=[...response.envIds]
          Swal.fire("Success","Bot updated successfully","success");
          this.uploadfile(response.envIds);
          let auditLogsList=[...this.auditLogs.map(item=>{
            item["versionNew"]=response.versionNew;
            item['comments']=response.comments;
            return item
          })];      
          let firstName=localStorage.getItem("firstName");
          let lastName=localStorage.getItem("lastName")
          if((parseFloat(previousBotDetails.versionNew).toFixed(1)) < ((parseFloat(response.versionNew)).toFixed(1)))
            auditLogsList.push({
              botId: response.botId,
              botName: "SortingBot|UpdatedVersion",
              changeActivity: "Updated Version",
              changedBy: `${firstName} ${lastName}`,
              comments: response.comments,
              newValue: response.versionNew,
              previousValue: previousBotDetails.versionNew,
              taskName:"Version Upgrade",
              version: 1,
              versionNew: response.versionNew,
            })
          this.rest.addAuditLogs(auditLogsList).subscribe((response:any)=>{
            if(response.errorMessage==undefined)
            {
              this.notifier.notify("success","Audit logs updated successfully")
            }
            else
            {
              Swal.fire("Error",response.errorMessage, "error");
            }
          },err=>{
            Swal.fire("Error","Unable to update audit logs","error")
          })
        }
        else
        {
          this.spinner.hide()
          Swal.fire("Error",response.errorMesssage, "error");
        }
      },(err)=>{
        this.spinner.hide()
        Swal.fire("Error","Unable to update bot","error");
      })
      //return false;
    } 

  }

  savedGroupsData:any=[]
  loadGroups(check)
  {


    if(check=="update")
    {
      this.groupsData.forEach((item:any)=>{
        this.jsPlumbInstance.removeGroup(item.id);
      })
    }
      this.groupsData=[];
      let savedGroups=[...this.finalbot.groups];
      this.savedGroupsData=[...this.finalbot.groups];
      let i=0;
      savedGroups.forEach(item=>{
        let GroupData:any={
          id:item.groupId,
          el:undefined,
          groupName:item.groupName,
          x:item.x,
          y:item.y,
          height:item.height,
          width:item.width,
          edit:false,
          color:item.color
        }
        this.groupsData.push(GroupData);
        setTimeout(()=>{

          let element:any=document.getElementById(GroupData.id);
          this.groupsData.find((item:any)=>item.id==GroupData.id).el=element;
          let  groupIds:any=[];
          groupIds=this.groupsData.map((group:any)=>{return group.id});
            if(check=='load')
              this.jsPlumbInstance.addGroup(this.groupsData.find((group:any)=>group.id==GroupData.id));
              this.jsPlumbInstance.draggable(groupIds, {
                containment: true,
              });
              i++;
              if(check=='update')
              {
                this.jsPlumbInstance.addGroup(this.groupsData.find((group:any)=>group.id==GroupData.id));
                this.jsPlumbInstance.draggable(groupIds, {
                  containment: true,
                });  
                this.savedGroupsData.find(savedGrp=>savedGrp.groupId==GroupData.id).nodeIds.forEach(sampleItem=>{
                  let nodeElement:any=document.getElementById(sampleItem);
                  this.jsPlumbInstance.addToGroup(GroupData.id, nodeElement);
                })
              }
              this.jsPlumbInstance.repaintEverything()
        },50)
      
      })
  
  }


  saveCron(sche) {
    let data: any;
    if (sche == undefined)
      data = null;
    else if (sche.scheduleIntervals.length == 0)
      data = null;
    else
      data = sche;
    this.scheduler = data;
  }



  successCallBack(data) {
    if (data.error) {
      this.disable = false;
      let type = "info";
      let message = "Failed to Save Data"
      this.notifier.notify(type, message);
    } else {
      let type = "info";
      this.disable = true;
      let message = "Data is Saved Successfully"
      this.notifier.notify(type, message);
    }
  }
  execution(botid) {
    let eqObj: any
    this.rest.execution(botid).subscribe(data => { this.exectionVal(data) }, (error) => {
      alert(error);
    })
  }


  exectionVal(data) {
    if (data.error) {
      let type = "info";
      let message = "Failed to execute"
      this.notifier.notify(type, message);
    } else {
      let type = "info";
      let message = "Bot is executed Successfully"
      this.notifier.notify(type, message);
    }
  }


  reset(e) {
    this.indexofArr = 5;
    this.dagvalue = this.zoomArr[this.indexofArr];
    document.getElementById(this.dragareaid).style.transform = `scale(${this.dagvalue})`
    this.jsPlumbInstance.repaintEverything()

  }

  zoomin(e) {
    if (this.indexofArr < this.zoomArr.length - 1) {
      this.indexofArr += 1;
      this.dagvalue = this.zoomArr[this.indexofArr];
      document.getElementById(this.dragareaid).style.transform = `scale(${this.dagvalue})`
      this.jsPlumbInstance.repaintEverything()
    }
  }


  zoomout(e) {
    if (this.indexofArr > 0) {
      this.indexofArr -= 1;
      this.dagvalue = this.zoomArr[this.indexofArr];
      document.getElementById(this.dragareaid).style.transform = `scale(${this.dagvalue})`
    }
  }




  closeFun() {
    this.hiddenPopUp = false;
    this.hiddenCreateBotPopUp = false
    this.fields = [];
  }

  downloadPng()
  {

    //this.spinner.show()
    var element=document.getElementById(this.dragareaid)
    var botName=this.finalbot.botName;
    domtoimage.toPng(element, { quality : 1,bgcolor : "white"})
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = botName+".png";
        link.href = dataUrl;
        link.click();
        //this.spinner.hide();
      })
      .catch(function (error) {
      });
  }

  downloadJpeg() {

    var element=document.getElementById(this.dragareaid)
    var botName=this.finalbot.botName;
    domtoimage.toPng(element,{ quality: 1,bgcolor : "white"})
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = `${botName}.jpeg`;
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
    });
  }

  downloadPdf() {

    var element=document.getElementById(this.dragareaid)
    var botName=this.finalbot.botName;
    domtoimage.toPng(element)
      .then(function (dataUrl) {
      let img=dataUrl;
      var doc = new jsPDF('l', 'mm', 'a4', 1);
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      doc.save(`${botName}.pdf`);
      })
      .catch(function (error) {
      });
  }


  async getsvg(){
    let data= await domtoimage.toPng(document.getElementById(this.dragareaid), { quality : 1})
    this.svg=data;
  }

  modifyEnableDisable() {
    this.disable = !this.disable;
    if (this.disable) {
      Swal.fire("Designer Disabled Now","","warning")
    }
    else {
      Swal.fire("Designer Enabled Now","","success")
    }
  }





  addsquences() {
    for(let i=0;i<this.finaldataobjects.length;i++) {
      this.finaldataobjects[i].inSeqId=0
      this.finaldataobjects[i].outSeqId=0
    }
    this.jsPlumbInstance.getAllConnections().forEach(dataobject => {
      let source = dataobject.sourceId;
      let target = dataobject.targetId;
      this.finaldataobjects.forEach(tasknode => {
        if (tasknode.taskName == "If condition") {
          let out: any = [];
          let connections: any = this.jsPlumbInstance.getAllConnections().filter(data => data.sourceId == tasknode.nodeId.split("__")[1]);
          connections.forEach(process => {
            out.push(process.targetId);
          })
          this.finaldataobjects.find(checkdata => checkdata.nodeId == tasknode.nodeId).outSeqId = JSON.stringify(out);
          let inseq: any = this.jsPlumbInstance.getAllConnections().find(data => data.targetId == tasknode.nodeId.split("__")[1])
          this.finaldataobjects.find(checkdata => checkdata.nodeId == tasknode.nodeId).inSeqId = inseq.targetId;
        }
        else 
        {
          if (tasknode.nodeId.split("__")[1] == target) {
            this.finaldataobjects.find(data => data.nodeId == tasknode.nodeId).inSeqId = source;
          }
          if (tasknode.nodeId.split("__")[1] == source) {
            this.finaldataobjects.find(data => data.nodeId == tasknode.nodeId).outSeqId = target;
          }
        }
      })
    });
  }




  get_coordinates() {
    this.nodes.forEach(data => {
      let p:any = $("#" + data.id).first();
      let position:any = p.position();
      for (let i = 0; i < this.finaldataobjects.length; i++) {
        let nodeid = (this.finaldataobjects[i].nodeId.split("|")[0]).split("__");
        if (nodeid[1] == data.id) {
          this.finaldataobjects[i].x = position.left + "px";
          this.finaldataobjects[i].y = position.top + "px";
        }
      
      }
    })
    if(this.finaldataobjects.find(item=>item.inSeqId==this.startNodeId)!=undefined)
    {
      let firstTask=this.finaldataobjects.find(item=>item.inSeqId==this.startNodeId)
      let p1:any = $("#" + firstTask.inSeqId).first();
      let position1:any = p1.position();
      this.finaldataobjects.find(item=>item.inSeqId==this.startNodeId).x=(firstTask.x)+"|"+position1.left+"px"
      this.finaldataobjects.find(item=>item.inSeqId==this.startNodeId).y=(firstTask.y)+"|"+position1.top+"px"
    }
  
    if(this.finaldataobjects.find(item=>item.outSeqId==this.stopNodeId)!=undefined)
    {
      let lastTask=this.finaldataobjects.find(item=>item.outSeqId==this.stopNodeId);
      let pn:any=$("#"+lastTask.outSeqId).first();
      let positionn:any = pn.position();
      this.finaldataobjects.find(item=>item.inSeqId==this.startNodeId).x=this.finaldataobjects.find(item=>item.inSeqId==this.startNodeId).x+"|"+positionn.left+"px";  
      this.finaldataobjects.find(item=>item.inSeqId==this.startNodeId).y=this.finaldataobjects.find(item=>item.inSeqId==this.startNodeId).y+"|"+positionn.top+"px";  
    }
  }



  openoutputmenu(node) {
    if (node.selectedNodeTask != "") {
      if (node.selectedNodeTask == "Output Box") {
        if (this.finalbot.botId != undefined) {
          document.getElementById("output_" + node.id).style.display = "block";
          this.outputnode = node;
        }
      }
    }
  }


  rpaAuditLogs(env:any[])
  {
    this.auditLogs=[];
    let finalTasks:any=[];
    finalTasks=this.final_tasks;
    let actualTasks:any=this.actualTaskValue;
    let firstName=localStorage.getItem("firstName");
    let lastName=localStorage.getItem("lastName")
    finalTasks.forEach((item:any)=>{
      if(actualTasks.find(item2=>item.nodeId==item2.nodeId)==undefined)
      {
        this.auditLogs.push(
          {
            "botId": this.finalbot.botId,
            "botName": `${this.finalbot.botName}|AddedTask` ,
            "changeActivity":'-',
            "changedBy": `${firstName} ${lastName}` ,
            //"changedDate":(new Date().toLocaleDateString()+", "+new Date().toLocaleTimeString()),
            "newValue":'-',
            "previousValue":'-',
            "taskName": item.taskName,
            "version": this.finalbot.version
          }
        )
      }
      else
      {
        let actualTask:any=(actualTasks.find(item2=>item.nodeId==item2.nodeId))
        for(let i=0;i<item.attributes.length;i++)
        {
          let actualTaskAttribute=actualTask.attributes.find((att:any)=>att.metaAttrId==item.attributes[i].metaAttrId);
          if(actualTaskAttribute != undefined)
          {
            if(item.attributes[i].attrValue!=actualTaskAttribute.attrValue)
            {
              this.auditLogs.push(
                {
                  "botId": this.finalbot.botId,
                  "botName": `${this.finalbot.botName}|UpdatedConfig` ,
                  "changeActivity":item.attributes[i].label,
                  "changedBy": `${firstName} ${lastName}` ,
                  //"changedDate":(new Date().toLocaleDateString()+", "+new Date().toLocaleTimeString()),
                  "newValue":item.attributes[i].attrValue,
                  "previousValue": actualTaskAttribute.attrValue,
                  "taskName": actualTask.taskName,
                  "version": this.finalbot.version
                }
              )
            }
          }
         
        }
      }
    })
    let RemovedTasks:any=[]
    actualTasks.forEach((item:any)=>{
      if(finalTasks.find((item2:any)=>item2.nodeId==item.nodeId)==undefined)
      {
        this.auditLogs.push(
          {
            "botId": this.finalbot.botId,
            "botName": `${this.finalbot.botName}|RemovedTask` ,
            "changeActivity":'-',
            "changedBy": `${firstName} ${lastName}` ,
           // "changedDate":(new Date().toLocaleDateString()+", "+new Date().toLocaleTimeString()),
            "newValue":'-',
            "previousValue":'-',
            "taskName": item.taskName,
            "version": this.finalbot.version
          }
        )
      }
    })


    this.actualEnv.forEach((item:any)=>{
      if(env.find((envId)=>item==envId)==undefined)
      {
        this.auditLogs.push(
          {
            "botId": this.finalbot.botId,
            "botName": `${this.finalbot.botName}|RemovedEnv` ,
            "changeActivity":'-',
            "changedBy": `${firstName} ${lastName}` ,
           // "changedDate":(new Date().toLocaleDateString()+", "+new Date().toLocaleTimeString()),
            "newValue":'-',
            "previousValue":'-',
            "taskName":String(item),
            "version": this.finalbot.version
          }
        )
      }
    })


    env.forEach((item:any)=>{
      if(this.actualEnv.find((envId)=>item==envId)==undefined)
      {
        this.auditLogs.push(
          {
            "botId": this.finalbot.botId,
            "botName": `${this.finalbot.botName}|AddedEnv` ,
            "changeActivity":'-',
            "changedBy": `${firstName} ${lastName}` ,
           // "changedDate":(new Date().toLocaleDateString()+", "+new Date().toLocaleTimeString()),
            "newValue":'-',
            "previousValue":'-',
            "taskName":String(item),
            "version": this.finalbot.version
          }
        )
      }
    })

  

  }



  outputbox(node,template) {
    this.modalRef=this.modalService.show(template);
    document.getElementById(this.outputboxid).style.display = "block";
    document.getElementById("output_" + node.id).style.display = "none"
  }

  closeoutputbox() {
    document.getElementById(this.outputboxid).style.display = "none";
    this.outputboxresult = undefined;
    this.SelectedOutputType = "";
  }

  getoutput() {
    if (this.SelectedOutputType != "") {
      if (this.finaldataobjects.find(object => object.nodeId.split("__")[1] == this.outputnode.id) != undefined) {
       let task: any = this.finaldataobjects.find(object => object.nodeId.split("__")[1] == this.outputnode.id);
       let postdata: any = {
          "botId": this.finalbot.botId,
          "version": this.finalbot.version,
          "viewType": this.SelectedOutputType,
          "inputRefName": task.attributes.find(item=>item.metaAttrId==135).attrValue,
        }
        this.rest.getoutputbox(postdata).subscribe(outdata => {
          this.outputboxresult = outdata;
          if (this.SelectedOutputType == "Text")
          {
            let data: any = outdata
            setTimeout(()=>{

              let check=this.outputboxresult[0];
              if(check=="" || check==undefined)
              {
                $("#text_"+this.outputboxid).val("No Items To Display");
              }else
              {
                if(check.Value=="" || check.Value==undefined)            
                { 
                  $("#text_"+this.outputboxid).val("No Items To Display");
                }else
                {
                  $("#text_"+this.outputboxid).val(String(this.outputboxresult[0].Value));
                }
              }
            },1000)
          }
          if(this.SelectedOutputType=="Image")
          {
            let image=this.outputboxresult[0].Value;
            this.Image= 'data:' + 'image/png' + ';base64,' +image;
          }
        })
      }
    }
  }

  outputlayoutback() {
    this.outputboxresult = undefined;
    this.SelectedOutputType = "";
  }


  
  arrange_task_order(start) {
    this.final_tasks = [];
    let object = this.finaldataobjects.find(object => object.inSeqId == start);
    this.add_order(object)
  }


  add_order(object) {

    let end = this.stopNodeId;
    if(object!=undefined){
      this.final_tasks.push(object);
    }
 
    if(object==undefined)
    {
      this.checkorderflag=false;
      return;
    }
    if (object.outSeqId == end)
    {
       return;
    }
    else {
      object = this.finaldataobjects.find(object2 => object2.nodeId.split("__")[1] == object.outSeqId);
      if(object == undefined)
      {
        this.checkorderflag=false;
        return;
      }
      else if (object.taskName == "If condition") {
        this.final_tasks.push(object);
        if(JSON.parse(object.outSeqId).length<2)
        {
          this.checkorderflag=false;
          return;
        }
        JSON.parse(object.outSeqId).forEach(report => {
          if (report == end) {
            return;
          }
          else {
            let node = this.finaldataobjects.find(process => process.nodeId.split("__")[1] == report)
            this.add_order(node);
          }
        })
        return;
      } else {
        this.add_order(object);

      }
    }
    return;
  }

  closecredentials()
  {     
    document.getElementById('createcredentials').style.display='none';
    this.resetCredForm();
  }


  resetCredForm(){
    this.insertForm.reset();
    this.insertForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:'0')
    this.insertForm.get("serverName").setValue("")
    this.passwordtype1=false;
  }

  back(){
    document.getElementById("createcredentials").style.display="none";
    this.resetCredForm();
  }
  createcredentials()
  {
    this.hiddenPopUp=false
   // this.modalRef = this.modalService.show(this.template);
    document.getElementById("createcredentials").style.display='block';
    this.insertForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
  }

  saveCredentials(){
    if(this.insertForm.valid)
   {

   // this.insertForm.value.createdBy="admin";
   
    let Credentials = this.insertForm.value;
    this.rest.save_credentials(Credentials).subscribe( res =>{
      let status:any=res;
      this.spinner.hide();
    Swal.fire({
            position: 'center',
            icon: 'success',
            title: status.status,
            showConfirmButton: false,
            timer: 2000
          })
        this.getTaskForm(this.nodedata)
         // this.modalRef.hide();
          document.getElementById('createcredentials').style.display= "none";
          this.resetCredForm();
    });
   
  }
  else{
    alert("Invalid Form");
  }
   }

   inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   } 
  }

  // getCategories(){
  //   this.rest.getCategoriesList().subscribe(data=>{
  //     let response:any=data;
  //     if(response.errorMessage==undefined)
  //     {
  //       this.categoryList=response.data;
  //     }
  //   })
  // }

  minimizeFullScreen(){
    this.isShowExpand=false;
    this.splitAreamin_size="200";
    this.areas = [
      { size: 70, order: 1},
      { size: 30, order: 2},
    ];
  }

  expandFullScreen(){
    this.isShowExpand=true;
    this.splitAreamin_size="null";
    this.areas = [
      { size: 0, order: 1},
      { size: 100, order: 2},
    ];
  }
  
  onDragEnd(e: {gutterNum: number; sizes: number[]}) {
    this.areas[0].size = e.sizes[0];
    this.areas[1].size = e.sizes[1];
    if(e.sizes[1] < 30){
     this.splitAreamin_size="200";
    }else{
      this.splitAreamin_size="null";
    }
  }




  addGroup()
  {

    let GroupData:any={
        id:this.idGenerator(),
        el:undefined,
        groupName:"Activity Group",
        x:"10px",
        y:"20px",
        height:"150px",
        width:"250px",
        edit:false,
        color:'black'
    }
    this.groupsData.push(GroupData);
    setTimeout(()=>{
      let element:any=document.getElementById(GroupData.id);
      this.groupsData.find((item:any)=>item.id==GroupData.id).el=element;
      this.jsPlumbInstance.addGroup(this.groupsData.find((item:any)=>item.id==GroupData.id));
      let  groupIds:any=[];
      groupIds=this.groupsData.map((item:any)=>{return item.id});
      this.jsPlumbInstance.draggable(groupIds, {
        containment: true,
      });
    },500)
  }



  removeGroup(groupId:any)
  {
      this.jsPlumbInstance.removeGroup(groupId);
      let groupdata=this.groupsData.find((item:any)=>item.id==groupId);
      this.groupsData.splice( this.groupsData.indexOf(groupdata), 1);
  }


  onResizeEnd(event:any, groupId:String)
  {
    if(this.groupsData.find((item:any)=>item.id==groupId)!=undefined)
    {
      this.groupsData.find((item:any)=>item.id==groupId).height=String(event.rectangle.height)+"px";
      this.groupsData.find((item:any)=>item.id==groupId).width=String(event.rectangle.width)+"px";
    }
  }


  getGroupsInfo()
  {
      return [...this.groupsData.map((item:any)=>{
      let tempGroupData={...{},...item};
      let connectedNodes=this.jsPlumbInstance.getGroup(item.id).getMembers();
      if(this.savedGroupsData.find((group:any)=>group.groupId==item.id)!=undefined) 
        tempGroupData["id"]=this.savedGroupsData.find((group:any)=>group.groupId==item.id).id;   
      tempGroupData["groupId"]=item.id
      if(connectedNodes.length!=0)
      {
        tempGroupData["nodeIds"]=connectedNodes.map((item2:any)=>{
          return item2.id;
        })
        let pn:any=$("#"+item.id).first();
        let position:any = pn.position();
        tempGroupData.x=position.left + "px";
        tempGroupData.y=position.top+"px";
        delete tempGroupData.edit;
        delete tempGroupData.el;
        if(this.savedGroupsData.find((group:any)=>group.groupId==item.id)==undefined) 
          delete tempGroupData.id;
        return tempGroupData;
      }
    })]
  }



  executeBot()
  {
    this.spinner.show()
    this.rest.execution(this.finalbot.botId).subscribe((response:any)=>{
      this.spinner.hide()
      if(response.errorMessage==undefined)
        Swal.fire("Success",response.status,"success");
      else
        Swal.fire("Error",response.errorMessage, "error")
    },err=>{
      this.spinner.hide()
      Swal.fire("Error","Unable to execute bot","error")
    })
  }



  getAllVersions()
  {
    this.rest.getBotVersion(this.finalbot.botId).subscribe((response:any)=>{
      if(response.errorMessage==undefined)
      {
        let sortedversions:any[]=response.sort((a, b) => (a.vId > b.vId) ? 1 : -1)
        this.VersionsList=[...sortedversions.reverse()];
      }
      else
      {
        Swal.fire("Error",response.errorMessage, "error")
      }
    },err=>{
      Swal.fire("Error","Unable to get versions", "error")
    })
  }

  openScheduler()
  {
    this.schedulerComponentInput={
      botid:this.finalbot.botId,
      version:this.finalbot.version,
      botName:this.finalbot.botName
    }
    this.scheduleOverlayFlag=true;
    document.getElementById('sch').style.display='block'
  }

  closeScheduler()
  {
    document.getElementById('sch').style.display='none'
    this.scheduleOverlayFlag=false;
  }

  openLogs()
  {

    this.logsOverlayFlag=true;
    this.logsOverlayModel=this.modalService.show(this.logsOverlayRef, {class:"logs-modal"})
    
  }

  closeLogsOverlay()
  {
    this.logsOverlayModel.hide();
    this.logsOverlayFlag=false;
  }

  deleteBot()
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
    if (result.value) {
      this.spinner.show();
      this.rest.getDeleteBot(this.finalbot.botId).subscribe(data=>{
        let response:any=data;
        this.spinner.hide()
        if(response.status!=undefined)
        {
            Swal.fire("Success",response.status,"success");
            $("#close_bot_"+this.finalbot.botName).click();
        }
        else
        {
            Swal.fire("Error",response.errorMessage,"error")
        }
      },err=>{
        this.spinner.hide();
        Swal.fire("Error","Unable to delete bot","error")
      })
  }

    })
  }

  loadPredefinedBot(botId, dropCoordinates)
  {
    this.rest.getbotdata(botId).subscribe((response:any)=>{
      if(response.errorMessage==undefined)
      {
        let droppedXcoordinate=dropCoordinates.x.split("px")[0]
        let droppedYcoordinate=dropCoordinates.y.split("px")[0]
        this.spinner.show();

        let j=0;
        response.tasks.forEach(element=>
        {
          let nodename=  element.nodeId.split("__")[0];
          let nodeid=(element.nodeId.split("__")[1]).split("|")[0];
         
          let node={
            id:this.idGenerator(),
            name:nodename,
            selectedNodeTask:element.taskName,
            path:this.toolset.find(data=>data.name==nodename).path,
            selectedNodeId: element.tMetaId,
            tasks:this.toolset.find(data=>data.name==nodename).tasks,
            x:j+parseInt(droppedXcoordinate)+'px',
            y:j+parseInt(droppedYcoordinate)+"px",
        }
        j=j+100;
        if(response.sequences.find(item=>item.sourceTaskId==nodeid)!=undefined)
        {
          response.sequences.find(item=>item.sourceTaskId==nodeid).sourceTaskId=node.id
        }
  
        if(response.sequences.find(item=>item.targetTaskId==nodeid)!=undefined)
        {
          response.sequences.find(item=>item.targetTaskId==nodeid).targetTaskId=node.id
        }
        element.nodeId=nodename+"__"+node.id;
        this.nodes.push(node);
        setTimeout(() => {
          this.populateNodes(node);
        }, 240);
  
  
        })
       
        response.sequences.splice((response.sequences.length-1),1)
        response.sequences.splice(0,1)
       
          this.addconnections(response.sequences);
          this.spinner.hide();
      }
      else
      {
        Swal.fire("Error",response.errorMessage, "error");
      }
    })
  }


  
  autoSaveTaskConfig(nodeData:any){
    if (nodeData.selectedNodeTask != "") 
    {
      this.selectedTask = {
        name: nodeData.selectedNodeTask,
        id: parseInt(nodeData.selectedNodeId)
      }
    }
    this.selectedNode = nodeData;
    this.rest.attribute(nodeData.selectedNodeId).subscribe((res:any)=>{        
      this.formVales=res;
      let data=res;
      let obj={}
      data.map(ele=>{
          obj[ele.name+'_'+ele.id]=ele.value;
        })
      this.onFormSubmit(obj, false)
 })
}

}


@Pipe({name: 'Checkoutputbox'})
export class Checkoutputbox implements PipeTransform {
  transform(value: any,arg:any)
  {
    let allnodes:any=[];
    allnodes=arg.tasks;
    let node:any=value;
    if(allnodes.find(item=>item.nodeId.split('__')[1]==node.id)!=undefined)
    {
      if(allnodes.find(item=>item.nodeId.split('__')[1]==node.id).botTId!=undefined)
        return true;
      else
        return false;
    }else
    {
      return false;
    }
  }
}
