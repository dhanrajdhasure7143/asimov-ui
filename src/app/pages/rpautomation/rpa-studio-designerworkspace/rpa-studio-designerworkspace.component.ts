import { Component, OnInit,  NgZone ,AfterViewInit, ViewChild, ElementRef, Input , Pipe, PipeTransform, TemplateRef} from '@angular/core';
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
import { RpaStudioComponent } from "../rpa-studio/rpa-studio.component";
import { RpaToolsetComponent } from "../rpa-toolset/rpa-toolset.component";
import domtoimage from 'dom-to-image';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-rpa-studio-designerworkspace',
  templateUrl: './rpa-studio-designerworkspace.component.html',
  styleUrls: ['./rpa-studio-designerworkspace.component.css']
})
export class RpaStudioDesignerworkspaceComponent implements OnInit {

  recordandplayid:any;
  jsPlumbInstance;
  public stud: any = [];
  public optionsVisible: boolean = true;
  public scheduler: any;
  result: any = [];
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
  @ViewChild('screen', { static: false }) screen: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('downloadLink', { static: false }) downloadLink: ElementRef;
  public finaldataobjects: any = []
  @Input("bot") public finalbot: any;
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
  public rp_url:any;
  recordedcode:any;
  finalcode:any;
  svg:any;
  public insertForm:FormGroup;
  modalRef: BsModalRef;
  outputmodalRef:BsModalRef;
  public passwordtype1:Boolean;
  public passwordtype2:Boolean;
  public form_change:Boolean=false;
  startNodeId:any=""
  stopNodeId:any=""
  @ViewChild('template', { static: false }) template: TemplateRef<any>;
  public nodedata: any;
  categoryList:any=[];
  constructor(private rest: RestApiService,
    private notifier: NotifierService,
    private hints: Rpa_Hints,
    private dt: DataTransferService,
    private http: HttpClient,
    private child_rpa_studio: RpaStudioComponent,
    private toolset:RpaToolsetComponent,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
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
  }

  ngOnInit() {
     this.passwordtype1=false;
    this.passwordtype2=false;
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
      this.finaldataobjects = this.finalbot.tasks;
      this.loadnodes();
    }
    this.dragareaid = "dragarea__" + this.finalbot.botName;
    this.outputboxid = "outputbox__" + this.finalbot.botName;
    this.getCategories();
  }



  ngAfterViewInit() {

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
              let connected_node: any = this.nodes.find(develop => develop.id == connection.targetId);
              let connected_node_id: any = connected_node.name + "__" + connected_node.id;
              let source_node_id = node_object.nodeId;
              if (this.finaldataobjects.find(tasks => tasks.nodeId == source_node_id) != undefined) {
                this.finaldataobjects.find(tasks => tasks.nodeId == source_node_id).attributes.find(attrs => attrs.metaAttrValue == "if").attrValue = connected_node_id;
              }
            }
            else {
              let connected_node: any = this.nodes.find(develop => develop.id == connection.targetId);
              let connected_node_id: any = connected_node.name + "__" + connected_node.id;
              if (this.finaldataobjects.find(tasks => tasks.nodeId == node_object.nodeId) != undefined) {
                this.finaldataobjects.find(tasks => tasks.nodeId == node_object.nodeId).attributes.find(attrs => attrs.metaAttrValue == "else").attrValue = connected_node_id;
              }

            }
          });
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
      this.child_rpa_studio.spinner.hide()
      this.dragelement = document.querySelector('#' + this.dragareaid);
      this.dagvalue = this.dragelement.getBoundingClientRect().width / this.dragelement.offsetWidth;

    }

  }



  public coordinates:any;
  public loadnodes() {
    this.finaldataobjects.forEach((element,index )=> {
      let inseq=String(element.inSeqId);
      let outseq=String(element.outSeqId);
     
        if(inseq.split("_")[0]=="START"){
      
        this.coordinates=(this.finaldataobjects[0].x.split("|")!=undefined)?this.finaldataobjects[0].nodeId.split("|"):undefined;
        
        if(this.coordinates!=undefined)
        {
          this.finaldataobjects[0].nodeId=this.coordinates[0];
        }
        let startnode = {
          id: inseq,
          name: "START",
          selectedNodeTask: "",
          selectedNodeId: "",
          path: "/assets/images/RPA/Start.png",
          x: (this.coordinates[1]!=undefined)?(this.coordinates[1]+"px"):"10px",
          y: (this.coordinates[2]!=undefined)?(this.coordinates[2]+"px"):"9px",
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
      // if (element.outSeqId == "STOP_" + this.finalbot.botName) {
        console.log(this.coordinates)
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
          x: (this.coordinates[3]!=undefined)?(this.coordinates[3]+"px"):"900px",
          y: (this.coordinates[4]!=undefined)?(this.coordinates[4]+"px"):"300px",

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
      templatenodes=this.toolset.templateNodes;
      let node = {
        id: nodeid,
        name: nodename,
        selectedNodeTask: element.taskName,
        selectedNodeId: element.tMetaId,
        path: this.toolset.templateNodes.find(data => data.name == nodename).path,
        tasks: this.toolset.templateNodes.find(data => data.name == nodename).tasks,
        x: element.x,
        y: element.y,
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
      
    });

  }

  delconn:Boolean=false;
  setConnectionLabel(connection) {
   let self=this;
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
        self.delconn=true;
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
      if(self.delconn==false)
      setTimeout(()=>{
        connection.getOverlay("label"+conn.id).setVisible(false);
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

    const node = event.data;
    node.id = this.idGenerator();
    // node.selectedNodeTask = "";
    // node.selectedNodeId = "";
    const nodeWithCoordinates = Object.assign({}, node, dropCoordinates);
    this.nodes.push(nodeWithCoordinates);
    setTimeout(() => {
      this.populateNodes(nodeWithCoordinates);
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

  ngDistroy() {
    this.unsubcribe();
  }

  formNodeFunc(node) {
    this.nodedata=node
    this.form_change=false;
    
    if (node.selectedNodeTask != "") {
      this.selectedTask = {
        name: node.selectedNodeTask,
        id: node.selectedNodeId
      }
      this.formHeader = node.name + " - " + node.selectedNodeTask;
      this.selectedNode = node;
      let taskdata = this.finaldataobjects.find(data => data.nodeId == node.name + "__" + node.id);
      if (taskdata != undefined) {
        if (taskdata.tMetaId == node.selectedNodeId) {
          let finalattributes: any = [];
          this.rest.attribute(node.selectedNodeId).subscribe((data) => {
            finalattributes = data
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
          if(node.selectedNodeTask=="Record & Play")
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



  response(data,node) {
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
      this.alldataforms.push(this.formVales)
      this.fields = data
      this.form = new FormGroup({
        fields: new FormControl(JSON.stringify(this.fields))
      })
      this.unsubcribe = this.form.valueChanges.subscribe((update) => {
        this.fields = JSON.parse(update.fields);
      })
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
    this.onFormSubmit(data);
  }



  close_record_play(){
    document.getElementById('recordandplay').style.display='none';
  }


  onFormSubmit(event) {
    this.fieldValues = event
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
        let objKeys = Object.keys(this.fieldValues);
        objAttr = {
          "metaAttrId": ele.id,
          "metaAttrValue": ele.name,
          "attrValue": ''
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
      "tMetaId": this.selectedTask.id,
      "inSeqId": 1,
      "taskSubCategoryId": "1",
      "outSeqId": 2,
      "nodeId": this.selectedNode.name + "__" + this.selectedNode.id,
      "x": this.selectedNode.x,
      "y": this.selectedNode.y,
      "attributes": obj,
    }
    let index = this.finaldataobjects.findIndex(sweetdata => sweetdata.nodeId == cutedata.nodeId)
    if (index != undefined && index >= 0) {
      this.finaldataobjects[index] = cutedata;
    } else {
      this.finaldataobjects.push(cutedata);

    }
    this.notifier.notify("info", "Data Saved Successfully");
  }

  async saveBotFun(botProperties, env) {
    this.checkorderflag=true;
    this.addsquences();
    this.get_coordinates();
    this.arrange_task_order(this.startNodeId);
    await this.getsvg();
      this.saveBotdata = {
        "botName": botProperties.botName,
        "botType": botProperties.botType,
        "description": botProperties.botDescription,
        "department": botProperties.botDepartment,
        "botMainSchedulerEntity": this.scheduler,
        "envIds": env,
        "isPredefined": botProperties.predefinedBot,
        "tasks": this.final_tasks,
        "createdBy": "admin",
        "lastSubmittedBy": "admin",
        "scheduler": this.scheduler,
        "svg":this.svg,
        "sequences": this.getsequences(),
      }
     
      if(this.checkorderflag==false)
      {
        return  false;
      }
      else
      {
        return  await  this.rest.saveBot(this.saveBotdata)
      }
  }

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

  resetdata() {
    this.jsPlumbInstance.deleteEveryEndpoint()
    this.nodes = [];
    this.finaldataobjects = [];
  }

  async updateBotFun(botProperties, env) {
    this.checkorderflag=true;
    this.addsquences();
    this.get_coordinates();
    this.arrange_task_order(this.startNodeId);
    await this.getsvg();
    this.saveBotdata = {
      "version": botProperties.version,
      "botId": botProperties.botId,
      "botName": botProperties.botName,
      "botType": botProperties.botType,
      "description": botProperties.botDescription,
      "department": botProperties.botDepartment,
      "botMainSchedulerEntity": this.scheduler,
      "envIds": env,
      "isPredefined": botProperties.predefinedBot,
      "tasks": this.final_tasks,
      "createdBy": "admin",
      "lastSubmittedBy": "admin",
      "scheduler": this.scheduler,
      "svg":this.svg,
      "sequences": this.getsequences()
    }
   
    if(this.checkorderflag==false)
     return false;
    else
      return this.rest.updateBot(this.saveBotdata)
      

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
    this.fields = []
  }

  downloadPng()
  {
    var element=document.getElementById(this.dragareaid)
    
    var botName=this.finalbot.botName;
    domtoimage.toPng(element)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = botName+".png";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
  }

  downloadJpeg() {

    var element=document.getElementById(this.dragareaid)
    var botName=this.finalbot.botName;
    domtoimage.toPng(element,{ quality: 1,background: "white"})
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = `${botName}.jpeg`;
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
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
          console.error('oops, something went wrong!', error);
      });
  }


  async getsvg()
  {
    let data= await domtoimage.toPng(document.getElementById(this.dragareaid))
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
        else {
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
        let nodeid = this.finaldataobjects[i].nodeId.split("__");
        if (nodeid[1] == data.id) {
          this.finaldataobjects[i].x = position.left + "px";
          this.finaldataobjects[i].y = position.top + "px";
        }
      }
    })
   
    if(this.finaldataobjects[0].inSeqId.split("_")[0]=="START")
    {
      let p1:any = $("#" + this.finaldataobjects[0].inSeqId).first();
      let position1:any = p1.position();
      this.finaldataobjects[0].nodeId=this.finaldataobjects[0].nodeId+"|"+position1.left+"|"+position1.top
    }
    if(this.finaldataobjects[this.finaldataobjects.length-1].outSeqId.split("_")[0]=="STOP")
    {
      let pn:any=$("#"+this.finaldataobjects[this.finaldataobjects.length-1].outSeqId).first();
      let positionn:any = pn.position();
      this.finaldataobjects[0].nodeId=this.finaldataobjects[0].nodeId+"|"+positionn.left+"|"+positionn.top;  
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
              $("#text_"+this.outputboxid).val((this.outputboxresult[0].Value));
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
    this.final_tasks.push(object);
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
        this.formNodeFunc(this.nodedata)
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

  getCategories()
  {
    this.rest.getCategoriesList().subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined)
      {
        this.categoryList=response.data;
      }
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
