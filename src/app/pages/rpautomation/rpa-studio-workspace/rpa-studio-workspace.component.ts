import { Component, OnInit, AfterViewInit, ViewChild, ElementRef,Input } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { fromEvent } from 'rxjs';
import { jsPlumb } from 'jsplumb';
import { RestApiService } from '../../services/rest-api.service';
import { FormGroup, FormControl } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as $ from 'jquery';
import { NotifierService } from 'angular-notifier';
import { RpaDragHints } from '../model/rpa-workspace-module-hints';
import { DataTransferService } from "../../services/data-transfer.service";
import { HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import { data } from 'jquery';
import { colorSets } from '@swimlane/ngx-charts/release/utils';
import { RpaStudioComponent } from "../rpa-studio/rpa-studio.component";
import { element } from 'protractor';
//import {RpaStudioActionsComponent} from "../rpa-studio-actions/rpa-studio-actions.component";
@Component({
  selector: 'app-rpa-studio-workspace',
  templateUrl: './rpa-studio-workspace.component.html',
  styleUrls: ['./rpa-studio-workspace.component.css']
})
export class RpaStudioWorkspaceComponent implements AfterViewInit {
  jsPlumbInstance;
  public stud:any = [];
  public optionsVisible : boolean = true;
  public scheduler:any;
  result:any = [];
  nodes = [];
  selectedNode: any= [];
  changePx: { x: number; y: number; };
  public selectedTask:any;
  // forms
  fileData:any;
  public hiddenPopUp:boolean = false;
  public hiddenCreateBotPopUp:boolean = false;
  public form: FormGroup;
  unsubcribe: any
  public fields: any[] = [];
  formHeader:string;
  disable: boolean = false;
  lightTheme: boolean = false;
  formVales:any[] = [];
  dragelement:any
  dagvalue:any
  zoomArr = [0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8];
  indexofArr = 6;
  fieldValues: any[] = [];
  allFormValues: any[] = [];
  saveBotdata:any = [];
  alldataforms:any=[];
  @ViewChild('screen',{static: false}) screen: ElementRef;
  @ViewChild('canvas',{static: false}) canvas: ElementRef;
  @ViewChild('downloadLink',{static: false}) downloadLink: ElementRef;
  public finaldataobjects:any=[]
  @Input("bot") public finalbot:any;
  dropVerCoordinates: any;
  constructor(private rest:RestApiService,private notifier: NotifierService, private hints:RpaDragHints,  private dt:DataTransferService, private http:HttpClient, private child_rpa_studio:RpaStudioComponent) {
    
   }

   ngOnInit() 
   {
    this.jsPlumbInstance = jsPlumb.getInstance();
    var self = this;
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { curviness: 90 }],
      overlays: [
        ["Arrow", { width: 12, length: 12, location: 0.5 }]
      ]
    });
    this.dt.changeHints(this.hints.rpaWorkspaceHints );
    if(this.finalbot.botId!= undefined)
    {
      this.finaldataobjects=this.finalbot.tasks;
      console.log(this.child_rpa_studio.templateNodes)
      this.loadnodes();
      
    }
   }



  ngAfterViewInit() {
/*
    this.jsPlumbInstance = jsPlumb.getInstance();
    var self = this;
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { curviness: 90 }],
      overlays: [
        ["Arrow", { width: 12, length: 12, location: 0.5 }]
      ]
    });
*/
    if(this.finalbot.botId!= undefined)
    {
      console.log(this.finalbot.sequences)
      //  this.loadnodes()
        this.addconnections()
    }

  }




  public loadnodes()
  {
    this.finaldataobjects.forEach(element => {

      let nodename=  element.nodeId.split("__")[0];
      let nodeid=element.nodeId.split("__")[1];
      let node={
        id:nodeid,
        name:nodename,
        selectedNodeTask:element.taskName,
        path:this.child_rpa_studio.templateNodes.find(data=>data.name==nodename).path,
        tasks:this.child_rpa_studio.templateNodes.find(data=>data.name==nodename).tasks,
        x:element.x,
        y:element.y,
      }
      console.log(node)
      this.nodes.push(node);
        setTimeout(() => {
          this.populateNodes(node);
        }, 240);
      
    });
  }
  public addconnections()
  {
    //this.jsPlumbInstance.reset();
    //jsPlumb.reset();
    //this.jsPlumbInstance = jsPlumb.getInstance();
    this.finalbot.sequences.forEach(element => {
      
      this.jsPlumbInstance.connect(
        {
          endpoint: ['Dot', {
            radius: 2,
            cssClass:"myEndpoint", 
            width:8, 
            height:8,
          }],
          source:element.sourceTaskId, 
          target:element.targetTaskId,
          anchor:"Continuous",
          connectorStyle: { stroke: '#404040',strokeWidth: 2 },
          maxConnections: -1,
          cssClass: "path",
          Connector: ["Flowchart", { curviness: 90 ,cornerRadius:5}],
          connectorClass: "path",
          overlays: [
            ["Arrow", { width: 12, length: 12, location: 1 }]
          ],
          isTarget: true,
     
        }

      )

      
    });
    console.log(data);
  
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  onDrop(event: DndDropEvent,e:any) {
    this.dragelement = document.querySelector('.drag-area');
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
    console.log(node)
    node.id = this.idGenerator();
    node.selectedNodeTask="";
    const nodeWithCoordinates = Object.assign({}, node, dropCoordinates);
    console.log(nodeWithCoordinates);
    this.nodes.push(nodeWithCoordinates);
    setTimeout(() => {
      this.populateNodes(nodeWithCoordinates);
    }, 240);
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
  
  
  
  populateNodes(nodeData){
        
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
        cssClass:"myEndpoint", 
        width:8, 
        height:8,
      }],
    paintStyle:{stroke:"#0062cf", fill:"#0062cf",strokeWidth:2  },
      isSource: true,
      connectorStyle: { stroke: '#404040',strokeWidth: 1.5 },
      anchor: 'Right',
      maxConnections: -1,
      cssClass: "path",
      Connector: ["Flowchart", { curviness: 90 ,cornerRadius:5}],
      connectorClass: "path",
      connectorOverlays: [['Arrow', {width: 10, length: 10, location: 1 }]],

    };

    const leftEndPointOptions = {
      endpoint: ['Dot', {
        radius: 2,
        cssClass:"myEndpoint", 
        width:8, 
        height:8,
      }],
      paintStyle:{stroke:"#0062cf", fill:"#0062cf" ,strokeWidth:2},
      isTarget: true,
      connectorStyle: { stroke: '#404040',strokeWidth: 1.5 },
      anchor: 'Left',
      maxConnections: -1,
      Connector: ["Flowchart", { curviness: 90 ,cornerRadius:5}],
      cssClass: "path",
      connectorClass: "path",
      connectorOverlays: [
      ]
    };

    this.jsPlumbInstance.addEndpoint(nodeData.id, rightEndPointOptions);
    this.jsPlumbInstance.addEndpoint(nodeData.id, leftEndPointOptions);

  }



  
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.event.clientX - rect.left,
      y: evt.event.clientY - rect.top
    };
  }




  callFunction(menu,tempnode){
    this.optionsVisible = false;
    this.hiddenPopUp = false;
     this.nodes.find(data=>data.id==tempnode.id).selectedNodeTask=menu.name
    this.formHeader= this.selectedNode.name+" - "+menu.name;
    
      let type ="info";
      let message = `${menu.name} is Selected`
      this.notifier.notify( type, message );
    //this.selectedNode.push(menu.id)
      this.selectedTask=menu; 
      console.log(menu);
    
  }


  deletenode(node)
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
      this.nodes.splice(this.nodes.indexOf(node),1)
      this.jsPlumbInstance.remove(node.id)

      //this.nodes = this.nodes.filter((node): boolean => nodeId !== node.id);
      //this.jsPlumbInstance.removeAllEndpoints(nodeId);
    } 
    else if (result.dismiss === Swal.DismissReason.cancel) {
    }
  })

  }

  onRightClick(n: any,e: { target: { id: string; } },i: string | number) {
    this.selectedNode = n
    console.log(e);
    this.stud = [];
    if(n.tasks.length>0){
      if(this.optionsVisible == true)
      {
        this.optionsVisible = false;
      }else
      { 
        this.optionsVisible = true;
        let value:any = []
        n.tasks.forEach(element => {
        let temp:any = {
          name : element.name,
          id : element.taskId
        };
        this.stud.push(temp)
      })

      }
    
    }
    
    else 
    {
      this.optionsVisible = false
      this.stud = [{
        name : "No Options"
      }]

    }
  }

  getFields() {
    return this.fields;
  }

  ngDistroy() {
    this.unsubcribe();
  }

  formNodeFunc(node)
  {
   /* console.log(node)
    if(this.selectedTask.id)
    {
      this.rest.attribute(this.selectedTask.id).subscribe((data)=>{
       this.response(data)
      })
    }*/
     //console.log(node)
     let task=this.finaldataobjects.find(data =>data.nodeId.split("__")[1]==node.id );
     if(task==undefined)
     {
       this.rest.attribute(this.selectedTask.id).subscribe((data)=>{
         this.response(data)
       })
     }
     else if(this.selectedTask==undefined)
     {
       let finalattributes:any=[];
       this.rest.attribute(task.tMetaId).subscribe((data)=>{ 
         finalattributes=data  
         task.attributes.forEach(element => {
               finalattributes.find(data=>data.id==element.metaAttrId).value=element.attrValue;
           });
           
           this.response(finalattributes)
       });
     }
     else if(task.tMetaId==this.selectedTask.id)
     {
       let finalattributes:any=[];
       this.rest.attribute(this.selectedTask.id).subscribe((data)=>{ 
         finalattributes=data  
         task.attributes.forEach(element => {
               finalattributes.find(data=>data.id==element.metaAttrId).value=element.attrValue;
           });
           
           this.response(finalattributes)
       });
     }
     else if(this.selectedTask.id != task.tMetaId)
     {
       this.rest.attribute(this.selectedTask.id).subscribe((data)=>{
         this.response(data)
       })
     }
  
  }



  
  response(data)
  {
    if(data.error == "No Data Found"){
      this.fields = [];
      this.hiddenPopUp = false;
      let type ="info";
      let message = "No Data Found"
      this.notifier.notify( type, message );
    }else{
    this.fields = [];
    this.hiddenPopUp = true;
    console.log(data);
    data.forEach(element => {
      if(element.type == "multipart"){
        element.onUpload = this.onUpload.bind(this)
      }
      if(element.type == "dropdown"){
        element.onChange = this.onChange.bind(this)
      }
    });
    this.formVales = data
    this.alldataforms.push(this.formVales)
    this.fields = data
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    })
  }
  }

  onUpload(event){

    console.log(event)
    this.fileData = event.target.value.substring(12)
    // if (event.target.files && event.target.files[0]) {
    //   var reader = new FileReader();
  
    //   reader.onload = (event: ProgressEvent) => {
    //     this.fileData = (<FileReader>event.target).result;
    //   }
  
    //   reader.readAsDataURL(event.target.files[0]);
    // }
    // this.fileData = files.target.value
    //  return e.target.files[0].name
  }
  onChange(e){
    console.log(e)
    this.fields.map(ele => {
      if(ele.dependency == e){
        ele.visibility = true
        ele.required = true
      }
      if(ele.dependency != e && ele.dependency != ''){
        ele.visibility = false
        ele.required = false
      }
      return ele
    })
  }
  onFormSubmit(event){ 
    console.log("hii"+ event);
    this.fieldValues = event
    if(this.fieldValues['file1']){
      this.fieldValues['file1'] = this.fieldValues['file1'].substring(12)
    }
    if(this.fieldValues['file2']){
      this.fieldValues['file2'] = this.fieldValues['file2'].substring(12)
    }
    if(this.fileData != undefined){
      this.fieldValues['file'] = this.fileData
      }
    
    
    this.hiddenPopUp=false;
    let objAttr:any;
    let obj:any=[];
    this.formVales.forEach((ele,i) => {
      if(ele.visibility == true){
      let objKeys = Object.keys(this.fieldValues);
      objAttr = {
        "metaAttrId": ele.id,
        "metaAttrValue": ele.name,
        "attrValue": this.fieldValues[objKeys[i]]
      }
      obj.push(objAttr);
    } 
  })
  let cutedata={
    
    "taskName":this.selectedTask.name,
    "tMetaId":this.selectedTask.id,
    "inSeqId":1,    
    "taskSubCategoryId":"1",
    "outSeqId":2,
    "nodeId":this.selectedNode.name+"__"+this.selectedNode.id,
    "x":this.selectedNode.x,
    "y":this.selectedNode.y,
    "attributes":obj,
  }
  this.finaldataobjects.push(cutedata);
  console.log(this.finaldataobjects)
  this.notifier.notify( "info", "Data Saved Successfully" );
  }

  saveBotFun(botProperties,env)
  {
    console.log(botProperties.predefinedBot)
    console.log(this.formVales);
    this.saveBotdata = {
    "botName": botProperties.botName,
    "botType" : botProperties.botType,
    "description":botProperties.botDescription,
    "department":botProperties.botDepartment,
    "botMainSchedulerEntity":this.scheduler,
    "envIds":env,
    "isPredefined":botProperties.predefinedBot,
    "tasks": this.finaldataobjects,
    "createdBy": "admin",
    "lastSubmittedBy": "admin",
    "scheduler" : this.scheduler,
    "sequences": this.getsequences(),
  }
    console.log(this.saveBotdata)
    return this.rest.saveBot(this.saveBotdata)
   // return this.("/rpa-service/save-bot",this.saveBotdata);
  }


  getsequences()
  { 
    let connections:any=[];
    let nodeconn:any;
    this.jsPlumbInstance.getAllConnections().forEach(data => {
      nodeconn={
        sequenceName:data.getId(),
        sourceTaskId:data.sourceId,
        targetTaskId:data.targetId,
      }
      connections.push(nodeconn)
    })
    return connections;
  }

  closemenu()
  {
      this.optionsVisible=false;
  }

  resetdata()
  { 
    this.jsPlumbInstance.deleteEveryEndpoint()
    this.nodes=[];
    this.finaldataobjects=[];
  }
  
  updateBotFun(botProperties,env)
  {

    console.log(this.formVales);
    console.log(botProperties.predefinedBot)
    console.log(this.formVales);
    this.saveBotdata = {
          "version":botProperties.version, 
          "botId":botProperties.botId,      
          "botName": botProperties.botName,
          "botType" : botProperties.botType,
          "description":botProperties.botDescription,
          "department":botProperties.botDepartment,
          "botMainSchedulerEntity":this.scheduler,
          "envIds":env,
          "isPredefined":botProperties.predefinedBot,
          "tasks": this.finaldataobjects,
          "createdBy": "admin",
          "lastSubmittedBy": "admin",
          "scheduler" : this.scheduler,
          "sequences": this.getsequences(),
      }
    console.log(this.saveBotdata)
    return this.rest.updateBot(this.saveBotdata)
  }


  saveCron(sche){
  this.scheduler = sche
    }
  
  

  successCallBack(data) {
    if(data.error){
      this.disable=false;
      let type ="info";
      let message = "Failed to Save Data"
      this.notifier.notify( type, message );
    }else{
      let type ="info";
      this.disable=true;
      let message = "Data is Saved Successfully"
      this.notifier.notify( type, message );
    console.log(data);
    }
    console.log(data);
    
  }
  execution(botid){
    let eqObj:any
    this.rest.execution(botid).subscribe(data => {this.exectionVal(data)},(error) => {
      alert(error);
    })
  }


  exectionVal(data){
    if(data.error){
      let type ="info";
      let message = "Failed to execute"
      this.notifier.notify( type, message );
    }else{
      let type ="info";
      let message = "Bot is executed Successfully"
      this.notifier.notify( type, message );
    console.log(data);
    }
  }


  reset(e){
      this.indexofArr = 6;
      this.dagvalue = this.zoomArr[this.indexofArr];
      this.dragelement.style['transform'] = `scale(${this.dagvalue})`
  }
  
  zoomin(e){
    if(this.indexofArr < this.zoomArr.length-1){
      this.indexofArr += 1;
      this.dagvalue = this.zoomArr[this.indexofArr];
      this.dragelement.style['transform'] = `scale(${this.dagvalue})`
    }
  }
  zoomout(e){
    if(this.indexofArr >0){
      this.indexofArr -= 1;
      this.dagvalue = this.zoomArr[this.indexofArr];
     this.dragelement.style['transform'] = `scale(${this.dagvalue})`
     }
  }
  closeFun(){
    this.hiddenPopUp = false;
    this.hiddenCreateBotPopUp = false
    this.fields = []
  }

  downloadPng(){
    html2canvas(this.screen.nativeElement,{
      width: 1200,
      height: 600,
      scrollX: 400,
      scrollY: 200,
      foreignObjectRendering: true
    }).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'bot_image.png';
      this.downloadLink.nativeElement.click();
    });
  }

  downloadJpeg(){
  
    html2canvas(this.screen.nativeElement,{

      width: 1000,
      height: 480,
      scrollX: 350,
      scrollY: 140,
      foreignObjectRendering: true }).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/jpeg');
      this.downloadLink.nativeElement.download = 'bot_image.jpeg';
      this.downloadLink.nativeElement.click();
    });
  }

  downloadPdf() { 
    
    const div = document.getElementById('screen');
    const options = {
      background: 'white',
      scale: 1,
      width: 1200,
      height: 600,
      scrollX: 400,
      scrollY: 200,
      foreignObjectRendering: true
    };

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");
      var doc = new jsPDF('l', 'mm', 'a4', 1);

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((doc) => {
      doc.save('bot_image.pdf');  
    });
  }

  modifyEnableDisable()
  {
      this.disable = !this.disable;
      if (this.disable) {
      Swal.fire({
      position:'top-end',
      icon:"warning",
      title:"Designer Disabled Now",
      showConfirmButton:false,
      timer:2000})
          }
      else {
      Swal.fire({
      position:'top-end',
      icon:'success',
      title:'Designer Enabled Now',
      showConfirmButton:false,
      timer:2000})
      }
    }
  
  
  


  squences()
  {
    this.jsPlumbInstance.getAllConnections().forEach(element => {
    
    });
  }

}
