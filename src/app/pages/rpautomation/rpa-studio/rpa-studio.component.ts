import { Component, OnInit, ViewChild } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { fromEvent } from 'rxjs';
import { jsPlumb } from 'jsplumb';
import { element } from 'protractor';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { RestApiService } from '../../services/rest-api.service';
import { ContextMenuContentComponent } from 'ngx-contextmenu/lib/contextMenuContent.component';


@Component({
  selector: 'app-rpa-studio',
  templateUrl: './rpa-studio.component.html',
  styleUrls: ['./rpa-studio.component.css']
})
export class RpaStudioComponent implements OnInit {
  @ViewChild(ContextMenuComponent) public basicMenu:ContextMenuComponent
  result:any = [];
  jsPlumbInstance;
  image: any =  '../../../../assets/images/PNG_Format/network@2x.png';
      new :any = '../../../../assets/images/PNG_Format/browser.png'
      image2 :any = '../../../../assets/images/PNG_Format/browser@2x.png'
      image3 :any = '../../../../assets/images/PNG_Format/search_1@2x.png'
            image4 :any = '../../../../assets/images/PNG_Format/network@2x.png'
            image5 :any = '../../../../assets/images/PNG_Format/Database.png'
            image6 :any = '../../../../assets/images/PNG_Format/Database@2x.png'
            image7 :any = '../../../../assets/images/PNG_Format/Expanded.png'
            image8 :any = '../../../../assets/images/PNG_Format/Expanded@2x.png'
            image9 : any ='../../../../assets/images/PNG_Format/filter.png'
            image0 :any = '../../../../assets/images/PNG_Format/ftp.png'
  nodes = [];
  public simpleList = [
    [
      { 'name': 'John' },
      { 'name': 'Smith' },
      { 'name': 'George' },
    ],
    [
      { 'name': 'Jennifer' },
      { 'name': 'Laura' },
      { 'name': 'Georgina' },
    ]
  ];
  zoomArr = [0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8];
  indexofArr = 6;
  templateNodes: any = [];
  // public templateNodes = [
  //     { 'name': 'John', 'path': this.image },
  //     { 'name': 'Smith', 'path': this.new },
  //     { 'name': 'George', 'path': this.image2 },
  //     { 'name': 'Jennifer', 'path': this.image3 },
  //     { 'name': 'Laura', 'path': this.image4 },
  //     { 'name': 'Georgina', 'path': this.image0},
  //     { 'name': 'Timmy', 'path': this.image6 },
  //     { 'name': 'Karen', 'path': this.image8 },
  // ];
  show: number;
  toolSetData: void;
  // @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  constructor(private rest:RestApiService) { 
    this.show = 5;

  }

  ngOnInit() {
    this.rest.toolSet().subscribe(data => {
      let value:any = [];
      let subValue:any = []
      this.toolSetData;
      console.log(data);
      let data1:any = [];
      data1 = data
      data1.General.forEach(element => {
        data1.Advanced.forEach(el => {
        subValue.push(el.NLP);
        subValue.push(el.OCR);
        subValue.push(element.Email);
        subValue.push(element.Database)
        subValue.push(element["Developer Condition"])
        subValue.push(element["Excel File"])
        console.log(subValue)
        subValue.forEach(ele => {
          value.push(ele)
          console.log(value);
      // Object.keys(ele).forEach(function(key) {
      //   value.push(Object.keys(ele[key]));
      //   console.log(value)
    })
    });
  })
  value.forEach(element => {
    element.forEach(ele1 => {
      console.log(ele1);
    let temp:any = {
      name : ele1.name,
      path : 'data:' + 'image/png' + ';base64,' + ele1.icon
    };
    // temp = ele1
    this.templateNodes.push(temp)
    })
  })
  let obj = {
    "dfv" : this.result
  }
  console.log(obj);
  
  })

  var element:any = document.querySelector('.drag-area');
let value = element.getBoundingClientRect().width / element.offsetWidth;

  document.querySelector('.zoomout').addEventListener('click',()=>{
    console.log('value of index  zoom out is',this.indexofArr)
     if(this.indexofArr >0){
      this.indexofArr -= 1;
        value = this.zoomArr[this.indexofArr];
     element.style['transform'] = `scale(${value})`
     }
   })

   document.querySelector('.zoomin').addEventListener('click',()=>{
    console.log('value of index zoomin is',this.indexofArr)
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

  onDrop(event: DndDropEvent) {
    const obs = fromEvent(document.body, '  ').subscribe(e => {
      // console.log(e);
    });

    var mousePos = this.getMousePos(event.event.target, event);
    const dropCoordinates = {
      // x: event.event.clientX - 170 < 0 ? event.event.clientX - (event.event.clientX - 170) : event.event.clientX - 170 + 'px',
      // y: event.event.clientY - 370 < 0 ? event.event.clientY - (event.event.clientY - 370) : event.event.clientY - 370 + 'px'

      x: mousePos.x + 'px',
      y: mousePos.y + 'px'
    };
    console.log(event.data);
    
    const node = event.data;
    const nodeWithCoordinates = Object.assign({}, node, dropCoordinates);
    this.nodes.push(nodeWithCoordinates);
    console.log(this.nodes);
    console.log(this.jsPlumbInstance);
    
    

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
      // paintStyle: { cornerRadius: 5, fill: '#CA2C68' },
      isSource: true,
      connectorStyle: { stroke: '#006ed5',strokeWidth: 2 },
      anchor: 'Right',
      maxConnections: -1,
      // paintStyle: { stroke: "#fff"},
      cssClass: "path",
      Connector: ["Flowchart", { curviness: 90 ,cornerRadius:5}],
      connectorClass: "path",
      // connectorOverlays: [
      //   ["Arrow", { width: 12, length: 12, location: 0.5 }]
      // ],
      connectorOverlays: [['Arrow', {width: 12, length: 12, location: 1 }]],

    };

    const leftEndPointOptions = {
      endpoint: ['Rectangle', { 
        radius: 4,
        cssClass:"myEndpoint", 
        width:8, 
        height:8
      }],
      // paintStyle: { cornerRadius: 5, fill: '#CA2C68' },
      isTarget: true,
      connectorStyle: { stroke: '#006ed5',strokeWidth: 2 },
      anchor: 'Left',
      maxConnections: -1,
      // paintStyle: { stroke: "#fff"},
      Connector: ["Flowchart", { curviness: 90 ,cornerRadius:5}],
      cssClass: "path",
      connectorClass: "path",
      connectorOverlays: [
        // ["Arrow", { width: 12, length: 12, location: 0.5 }]
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
  
}
