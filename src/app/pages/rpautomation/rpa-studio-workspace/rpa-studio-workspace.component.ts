import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import Swal from 'sweetalert2';
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
  public hiddenPopUp:boolean = false;
  public hiddenCreateBotPopUp:boolean = false;
  public form: FormGroup;
  unsubcribe: any
  public fields: any[] = [];
  formHeader:string;
  formVales:any[] = [];
  dragelement:any
  dagvalue:any
  zoomArr = [0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8];
  indexofArr = 6;
  fieldValues: any[] = [];
  allFormValues: any[] = [];
  saveBotdata:any = [];
  alldataforms:any=[];
  public finaldataobjects:any=[]
  constructor(private rest:RestApiService,private notifier: NotifierService, private hints:RpaDragHints,  private dt:DataTransferService,) {
    
   }

   ngOnInit() 
   {
    this.dt.changeHints(this.hints.rpaWorkspaceHints );
   }



  ngAfterViewInit() {

    this.jsPlumbInstance = jsPlumb.getInstance();
    var self = this;
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { curviness: 90 }],
      overlays: [
        ["Arrow", { width: 12, length: 12, location: 0.5 }]
      ]
    });
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
    node.id = this.idGenerator();
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
      endpoint: ['Rectangle', { 
        radius: 4,
        cssClass:"myEndpoint", 
        width:8, 
        height:8
      }],
      isSource: true,
      connectorStyle: { stroke: '#006ed5',strokeWidth: 2 },
      anchor: 'Right',
      maxConnections: -1,
      cssClass: "path",
      Connector: ["Flowchart", { curviness: 90 ,cornerRadius:5}],
      connectorClass: "path",
      connectorOverlays: [['Arrow', {width: 12, length: 12, location: 1 }]],

    };

    const leftEndPointOptions = {
      endpoint: ['Rectangle', { 
        radius: 4,
        cssClass:"myEndpoint", 
        width:8, 
        height:8
      }],
      isTarget: true,
      connectorStyle: { stroke: '#006ed5',strokeWidth: 2 },
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




  callFunction(menu){
    this.optionsVisible = false;
    this.hiddenPopUp = false;
   // this.fields = []
    //console.log(menu);
      this.formHeader= this.selectedNode.name+" - "+menu.name;
      //this.selectedNode.id = menu.id;
      let type ="info";
      let message = `${menu.name} is Selected`
      this.notifier.notify( type, message );
    //this.selectedNode.push(menu.id)
      this.selectedTask=menu; 
      console.log(menu);
    
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
    console.log(node)
    if(this.selectedTask.id)
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


  onFormSubmit(event){  
    this.fieldValues = event
    this.hiddenPopUp=false;
    let objAttr:any;
    let obj:any=[];
    this.formVales.forEach((ele,i) => { 
      let objKeys = Object.keys(this.fieldValues);
      objAttr = {
        "metaAttrId": ele.id,
        "metaAttrValue": ele.name,
        "attrValue": this.fieldValues[objKeys[i]]
      }
      obj.push(objAttr);
        
  })
  let cutedata={
    "taskName":this.selectedNode.name,
    "taskId":this.selectedNode.id,
    "inSeqId":1,
    "outSeqId":2,
    "attributes":obj
  }
  this.finaldataobjects.push(cutedata);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: "Saved Successfully",
      showConfirmButton: false,
      timer: 2000})
  }

  saveBotFun(botProperties,env)
  {
    //console.log(environments)
    console.log(this.formVales);
    this.saveBotdata = {
    "botName": botProperties.botName,
    "botType" : botProperties.botType,
    "description":botProperties.botDescription,
    "department":botProperties.botDepartment,
    "botMainSchedulerEntity":this.scheduler,
    "envIds":env,
    "tasks": this.finaldataobjects,
    "createdBy": "admin",
    "lastSubmittedBy": "admin",
    "scheduler" : this.scheduler
  }
    console.log(this.saveBotdata)
    return this.rest.saveBot(this.saveBotdata)
  }


  
  updateBotFun(botProperties)
  {

    console.log(this.formVales);
    this.saveBotdata = [];
    let mainObj:any = [];
    let tstAtt:any;
    let obj:any = [];
    let objAttr:any;
    this.formVales.forEach((ele,i) => {
     
      let objKeys = Object.keys(this.fieldValues);
      objAttr = {
        "metaAttrId": ele.taskId,
        "atrribute_type": ele.type,
        "metaAttrValue": ele.name,
         "attrValue": this.fieldValues[objKeys[i]]
      }
     
      obj.push(objAttr);
        
  })
  
  tstAtt={"attributes":obj};
  mainObj.push(tstAtt);
  this.allFormValues.push(obj);
  console.log(this.allFormValues);
  this.saveBotdata = {
    "botId":botProperties.botId,
    "botName": botProperties.botName,
    "botType" : botProperties.botType,
    "description":botProperties.description,
    "department":botProperties.department,
    "envIds":botProperties.envIds,
    "tasks": mainObj,
    "createdBy": "admin",
    "lastSubmittedBy": "admin",
    "scheduler" : botProperties.scheduler
  }

    return this.rest.updateBot(this.saveBotdata)
  }


  saveCron(sche){
  this.scheduler = sche
    }
  
  

  successCallBack(data) {
    if(data.error){
      let type ="info";
      let message = "Failed to Save Data"
      this.notifier.notify( type, message );
    }else{
      let type ="info";
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
  downloadPDF() {
    const HTML_Width = $('#content').width();
    const HTML_Height = $('#content').height();
    const top_left_margin = 15;
    const PDF_Width = HTML_Width + (top_left_margin * 2);
    const PDF_Height = (PDF_Width) + (top_left_margin * 2);
    const canvas_image_width = HTML_Width;
    const canvas_image_height = HTML_Height;

    const totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    window.scrollTo(0, 0);
    html2canvas($('#content')[0], { allowTaint: true }).then((canvas) => {
      canvas.getContext('2d');

      console.log(canvas.height + '  ' + canvas.width);


      const imgData = canvas.toDataURL('data:' + 'image/png' + ';base64,', 1.0);
      const pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      // pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);



      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }

      pdf.save('RPA.pdf');
    });
  }

}
