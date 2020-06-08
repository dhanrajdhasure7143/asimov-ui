import { Component, OnInit, ViewChild } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { fromEvent } from 'rxjs';
import { jsPlumb } from 'jsplumb';
import { Router } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { element } from 'protractor';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { RestApiService } from '../../services/rest-api.service';
import { ContextMenuContentComponent } from 'ngx-contextmenu/lib/contextMenuContent.component';
import { FormGroup, FormControl } from '@angular/forms';
import { RpaHints } from '../model/rpa-module-hints';



@Component({
  selector: 'app-rpa-studio',
  templateUrl: './rpa-studio.component.html',
  styleUrls: ['./rpa-studio.component.css']
})
export class RpaStudioComponent implements OnInit {
  model: any = {};
  public stud:any = [];
  public emailValue:any = []
  public databaseValue:any = [];
  public developercondValue:any = [];
  public excelValue:any = [];
  public optionsVisible : boolean = true;
  result:any = [];
  jsPlumbInstance;
  nodes = [];
  zoomArr = [0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8];
  indexofArr = 6;
  templateNodes: any = [];
  show: number;
  toolSetData: void;
  
  listEnvironmentData:any =[];
  changePx: { x: number; y: number; };
  // forms
  public hiddenPopUp:boolean = false;
  public hiddenCreateBotPopUp:boolean = false;
  public form: FormGroup;
  unsubcribe: any
  public fields: any[] = [];
  resp: any[] = [];
  formHeader: any[] = [];
  selectedNode: any= [];
  formVales:any[] = [];
  fieldValues: any[] = [];
  allFormValues: any[] = [];
  saveBotdata:any = [];
  selectedTasks: any[] = [];
  exectionValue: any;
  tabsArray: any[] = [];
  tabActiveId: string;
  constructor(private router: Router, private dt:DataTransferService,private rest:RestApiService,
    private hints:RpaHints) { 
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    });
    this.show = 5;

  }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Automation"});
    this.dt.changeChildModule("");
    this.dt.changeHints(this.hints.rpaHomeHints);
    this.rest.toolSet().subscribe(data => {
      let value:any = [];
      let subValue:any = []
      this.toolSetData;
      let data1:any = [];
      // data1 = this.nData
      data1 = data
      data1.General.forEach(element => {
        data1.Advanced.forEach(el => {
        subValue.push(el.NLP);
        subValue.push(el.OCR);
        subValue.push(element.Email);
        this.emailValue.push(element.Email);
        subValue.push(element.Database);
        this.databaseValue.push(element.Database);
        subValue.push(element["Developer Condition"]);
        subValue.push(element["Database"])
        this.developercondValue.push(element["Developer Condition"]);
        subValue.push(element["Excel File"]);
        this.excelValue.push(element["Excel File"]);
        console.log(subValue)
        subValue.forEach(ele => {
          value.push(ele)
          console.log(value);
      // Object.keys(ele).forEach(function(key) {
      //   value.push(Object.keys(ele[key]));
      //   console.log(value)
      // })
    })
    });
  })
  value.forEach(element => {
    let temp:any = {
      name : element.name,
      path : 'data:' + 'image/png' + ';base64,' + element.icon,
      tasks: element.taskList
    };
    this.templateNodes.push(temp)
    })
  })
 
 

  var element:any = document.querySelector('.drag-area');
  let value = element.getBoundingClientRect().width / element.offsetWidth;

  document.querySelector('.zoomout').addEventListener('click',()=>{
     if(this.indexofArr >0){
      this.indexofArr -= 1;
        value = this.zoomArr[this.indexofArr];
     element.style['transform'] = `scale(${value})`
     }
   })

   document.querySelector('.zoomin').addEventListener('click',()=>{
    if(this.indexofArr < this.zoomArr.length-1){
      this.indexofArr += 1;
      value = this.zoomArr[this.indexofArr];
      element.style['transform'] = `scale(${value})`
    }
  })

  document.querySelector('.reset').addEventListener('click',()=>{
    this.indexofArr = 6;
      value = this.zoomArr[this.indexofArr];
      element.style['transform'] = `scale(${value})`
  })
}

  getFields() {
    return this.fields;
  }

  ngDistroy() {
    this.unsubcribe();
  }
  onFormSubmit(event){
    console.log(event);
    this.fieldValues = event
    // localStorage.setItem('formValue', event)
  }
  
  increaseShow() {
    this.show += 5; 
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
    console.log("dfg"+event);
    
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
    const nodeWithCoordinates = Object.assign({}, node, dropCoordinates);
    console.log(nodeWithCoordinates);
    this.nodes.push(nodeWithCoordinates);
    setTimeout(() => {
      this.populateNodes(nodeWithCoordinates);
    }, 240);
  }
  updateCoordinates(dragNode) {
    var nodeIndex = this.nodes.findIndex((node) => {
      return (node.name == dragNode.name);
    });
    this.nodes[nodeIndex].x = dragNode.x;
    this.nodes[nodeIndex].y = dragNode.y;
  }
  populateNodes(nodeData){
        
    const nodeIds = this.nodes.map(function (obj) {
      return obj.name;
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

    this.jsPlumbInstance.addEndpoint(nodeData.name, rightEndPointOptions);
    this.jsPlumbInstance.addEndpoint(nodeData.name, leftEndPointOptions);

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
    this.fields = []
    console.log(menu);
    this.selectedNode.id = menu.id;
    // this.selectedNode.push(menu.id)
    console.log(this.selectedNode);
    
  }
  onRightClick(n: any,e: { target: { id: string; } },i: string | number) {
    this.selectedNode = n
    console.log(e);
    this.stud = [];
    if(n.tasks.length>0){
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
    // if (!n) {
    //   this.optionsVisible = false
    // }
    else 
    {
      this.optionsVisible = false
      this.stud = [{
        name : "No Options"
      }]

    }
  }
  formNodeFunc(node){
    this.formHeader = node
    if(this.selectedNode.id){
    this.rest.attribute(this.selectedNode.id).subscribe((data)=> this.response(data))
    }
  }
  response(data){
    this.fields = [];
    this.hiddenPopUp = true;
    console.log(data);
    this.formVales = data
    this.fields = data
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    });
  }
  closeFun(){
    this.hiddenPopUp = false;
    this.hiddenCreateBotPopUp = false
    this.fields = []
  }
  saveBotFun(){
    console.log(this.formVales);
    this.allFormValues = []
    this.saveBotdata = []
    this.formVales.forEach((ele,i) => {
      let obj:any
      let objKeys = Object.keys(this.fieldValues);
      obj = {
        "metaAttrId": ele.taskId,
        "atrribute_type": ele.type,
        "metaAttrValue": ele.name,
         "attrValue": this.fieldValues[objKeys[i]]
      }
      this.allFormValues.push(obj)    
  })
  console.log(this.allFormValues);
  this.saveBotdata = {
    "botName": "metbotIntegration4",
    "tasks": this.allFormValues,
    "createdBy": "admin",
    "lastSubmittedBy": "admin"
  }
  console.log(this.saveBotdata);
  this.rest.saveBot(this.saveBotdata).subscribe(data => this.successCallBack(data))
  }
  successCallBack(data) {
    console.log(data);
    
  }
  execution(){
    let eqObj:any
    this.rest.execution(eqObj).subscribe(data => {this.exectionVal(data)},(error) => {
      alert(error);
    })
  }
  exectionVal(data){
    console.log(data);
    
  }

  onCreateSubmit() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model))
    this.hiddenCreateBotPopUp = false
    let temp : any={};
    temp = this.model;
    this.model = {};
    this.tabsArray.push(temp);
    this.tabActiveId = temp.botNamee
    console.log(this.tabsArray);
    
  }
  onCreate(){
    this.hiddenCreateBotPopUp = true
  }
  closeBot($event) {
    this.tabsArray = this.tabsArray.filter((bot): boolean => $event !== bot);
    this.tabActiveId = this.tabsArray.length > 0 ? this.tabsArray[this.tabsArray.length - 1].id : '';
  }
} 

