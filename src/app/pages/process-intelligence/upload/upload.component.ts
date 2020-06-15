import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { NgxXml2jsonService } from 'ngx-xml2json';

import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from '../../services/rest-api.service';
import { GlobalScript } from '../../../shared/global-script';
import { PiHints } from '../model/process-intelligence-module-hints';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import Swal from 'sweetalert2';
import * as go from 'gojs';

declare var target:any;
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  xlsx_csv_mime:string;
  xes_mime:string;
  db_mime:string;
  data;
  public dbDetails:any={};
  public isSave:boolean=true;
  selectedFile: File = null;
  filedetails:any;
  process_graph_list:any=[];
  fullgraph:any=[];
  public model1;
  public model2;
  public nodeArray: any[];
  linkData = [];
  linkdataArray = [];
  isgraph:boolean=false;
  public model:go.Model;
  public myDiagram: go.Diagram ;


  constructor(private router: Router, 
    private dt:DataTransferService, 
    private rest:RestApiService, 
    private global: GlobalScript, 
    private hints:PiHints, 
    private ngxXml2jsonService: NgxXml2jsonService,) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule("");
    this.xlsx_csv_mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv,.xlsx,.xls';
    this.xes_mime = '.xes';
    this.db_mime = '.json';
    this.dt.changeHints(this.hints.uploadHints);
    this.getAlluserProcessPiIds();
   
  }
    onUpload(event,id) {
      this.selectedFile = <File>event.addedFiles[0];
      const fd = new FormData();
     fd.append('file', this.selectedFile),
      fd.append('permissionStatus', 'yes'),
    this.rest.fileupload(fd).subscribe(res => {this.filedetails=res
                  // console.log('res',this.filedetails.data);
                  let fileName=this.filedetails.data.split(':');
                  localStorage.setItem("fileName",fileName[1])
                  this.onSelect(event,id)
                  },err=>{
                    Swal.fire({
                      title: 'Error',
                      text: 'Please try again!',
                      icon: 'error',
                    })
                  });
}
  

  getUID(id,name){
    if(id == 0){
      let extension = this.getFileExtension(name);
    if(extension == 'csv'){
      id = 2;
    }
    if(extension.indexOf('xls') > -1){
      id = 1
    }
    }
      return id;
    }
    
    getFileExtension(filename)
   {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1];
   }
 
  onSelect(event,upload_id) {
    let file:File = event.addedFiles[0];
    if(file)
      this.checkUploadId(event, this.getUID(upload_id, file.name));
    else
      this.error_display(event);
  }

  checkUploadId(event, upload_id){
    if(upload_id == 1)
      this.readExcelFile(event);
    if(upload_id == 2)
      this.readCSVFile(event);
    if(upload_id == 3)
      this.readXESFile(event);
  }

  error_display(event){
    let message = "Oops! Something went wrong";
      if(event.rejectedFiles[0].reason == "type")
        message = "Please upload file with proper extension";
      if(event.addedFiles.length > 1)
        message = "Only one file has to be uploaded "
        this.global.notify(message, "error");
  }

  readExcelFile(evt) {
    const target:DataTransfer = <DataTransfer>(evt.addedFiles);
    const reader: FileReader = new FileReader();
    
    reader.onload = (e: any) => {
      console.log('this.data',e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <any[][]>(XLSX.utils.sheet_to_json(ws, {header: 1, raw: false, range: 0}));
      // const ws2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]];

      this.dt.changePiData(this.data);
      let excelfile=[];
      excelfile=this.data;
      // console.log(excelfile);
      localStorage.removeItem("fileData")
localStorage.setItem("fileData",JSON.stringify(excelfile))
      this.router.navigate(['/pages/processIntelligence/datadocument']);
    };
    reader.readAsBinaryString(target[0]);
  }

  readCSVFile(e){
    let reader = new FileReader();
    reader.readAsText(e.addedFiles[0]);
    let _self = this;  
    reader.onload = () => {
      let csvRecordsArray:string[][] = []; 
      (<string>reader.result).split(/\r\n|\n/).forEach((each,i)=>{
        csvRecordsArray.push(each.split(','));
      })
      this.dt.changePiData(csvRecordsArray); 
      let excelfile=[];
      excelfile=csvRecordsArray;
      // console.log(excelfile);
      localStorage.removeItem("fileData")
localStorage.setItem("fileData",JSON.stringify(excelfile))
      this.router.navigate(['/pages/processIntelligence/datadocument']);    
    };  
    reader.onerror = function () { 
      _self.global.notify("Oops! Something went wrong", "error"); 
    };
  }

  readXESFile(e): void{
    let file = e.addedFiles[0];
    let fileReader: FileReader = new FileReader();
    var _self =this;
    fileReader.onload = function(x) {
      let _xml = `${fileReader.result}`
      const parser = new DOMParser();
      const xml = parser.parseFromString(_xml, "text/xml");
      let _obj = _self.ngxXml2jsonService.xmlToJson(xml);
      if(!_obj['log'])
      console.log(_obj['log']);
      var resultTable = _obj['log']['trace'][0]['event'];
      let xesData = [];
      resultTable.forEach(e => {
        let tmp_arr = [];
        e.string.forEach(ev => {
          tmp_arr.push(ev['@attributes']['value']);
        })
        xesData.push(tmp_arr);
      });
      _self.dt.changePiData(xesData)
      _self.router.navigateByUrl('/pages/processIntelligence/datadocument');  
    }
    fileReader.readAsText(file);
  }
//   onDbSelect(){
//     document.getElementById("foot").classList.remove("slide-down");
//     document.getElementById("foot").classList.add("slide-up");
// }
// slideDown(){
//   document.getElementById("foot").classList.add("slide-down");
//   document.getElementById("foot").classList.remove("slide-up");
// }
testConnection(){
console.log("userName",this.dbDetails);
  this.isSave=false;
}

onDbSelect(){
  var modal = document.getElementById('myModal');
  modal.style.display="block";
  }
  closePopup(){
    var modal = document.getElementById('myModal');
    modal.style.display="none";
    }
  downloadCSV() {
    var data=[];
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: ['Case_id', 'Start_Timestamp', 'End_Timestamp', 'Activity', 'Resource','Role']
    };

    new ngxCsv(data,'Sample_Template',options);
  }

  getAlluserProcessPiIds(){
    this.rest.getAlluserProcessPiIds().subscribe(data=>{this.process_graph_list=data
      console.log('data',this.process_graph_list)})
  }
  loopTrackBy(index, term){
    return index;
  }
  onGraphSelection(selectedpiIdData){
    this.isgraph=true;
    console.log("selected PIID",selectedpiIdData);
    this.rest.getfullGraph(selectedpiIdData.piId).subscribe(data=>{this.fullgraph=data
      // console.log("fullgraph",this.fullgraph.data.allSelectData);
      let fullgraph=JSON.parse(this.fullgraph.data)
      console.log("fullgraph",fullgraph);
      
      this.model1 = fullgraph.allSelectData.nodeDataArraycase
      this.model2 = this.flowchartData(this.model1)
      // this.flowGraph()
      })
    
  }

  flowchartData(dataArray) {
    this.linkData = [];
    this.linkdataArray = [];
    this.nodeArray = dataArray;
     var linkToolArray=[];
    for (var i = 1; i < this.nodeArray.length-1; i++) {
      // console.log('linkArray',this.nodeArray[i].linkArray);
      var datalink = this.nodeArray[i].linkArray;
      // console.log('datalink',datalink);
      var link=[]
      var linktool=[]
      var label = this.nodeArray[i].name;
      
      for(var j=0; j< datalink.length; j++){
        // link.push(datalink[j].linkNode)
        // console.log('datalink.length',datalink[j].length);
        
        // if(link != undefined ||link != null){
        var obj = {};
          obj['from'] = this.getFromKey(label);
          obj['to'] = this.getFromKey(datalink[j].linkNode);
          obj['text'] = this.nodeArray[i].toolCount[0];
          obj['toolData']=datalink[j].tool
           obj['toolDataCount']=datalink[j].toolCount

          this.linkdataArray.push(obj);
      // }
    }
          
      // var label = this.nodeArray[i].name;
      // if (link != undefined) {
        // for (var a = 0; a < link.length; a++) {
        //   var obj = {};
        //   obj['from'] = this.getFromKey(label);
        //   obj['to'] = this.getFromKey(link[a]);
        //   obj['text'] = this.nodeArray[i].toolCount[0];
        //   // obj['linktool'] = linkToolArray[l]
        //   this.linkdataArray.push(obj);
        // }

        console.log('linkdataArray',this.linkdataArray);
        if (this.nodeArray[i].tool.includes('Start Frequency')) {
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          obj['from'] = -1;
          obj['to'] = this.getFromKey(this.nodeArray[i].name);
          obj['text'] = this.nodeArray[i].toolCount[3]
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
        }
        if (this.nodeArray[i].tool.includes('End Frequency')) {
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          obj['from'] = this.getFromKey(this.nodeArray[i].name);
          obj['to'] = -2;
          obj['text'] = this.nodeArray[i].toolCount[4]
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
        }

      // }
    }
    // for(var x=0; x<link.length; x++){
    //   var obj = {};
    //   obj['from'] = this.getFromKey(link[x].linkNode);
    //       obj['to'] = this.getFromKey(link[x].linkNode);
    //       obj['toolData']=link[x].tool
    //       obj['toolDataCount']=link[x].toolCount
    //       this.linkdataArray.push(obj);
    // }
    // this.model1=this.pgModel.allData.nodeDataArraycase;

    // this.model2=this.linkdataArray;
    // console.log('linkarray', this.linkdataArray)
    return this.linkdataArray;
  }
  getFromKey(name) {
    for (var i = 0; i < this.nodeArray.length; i++) {
      if (name == this.nodeArray[i].name) {
        return this.nodeArray[i].key;
      }
    }
  }
  flowGraph() {
 
    var $ = go.GraphObject.make; // for conciseness in defining templates
    // some constants that will be reused within templates
    var roundedRectangleParams = {
        parameter1: 2, // set the rounded corner
        // spot1: go.Spot.TopLeft,
        // spot2: go.Spot.BottomRight // make content go all the way to inside edges of rounded corners
    };
    this.myDiagram =
        $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
            {
              initialContentAlignment: go.Spot.TopCenter,
                initialAutoScale: go.Diagram.Uniform,
                hasHorizontalScrollbar: true,
                hasVerticalScrollbar: true,
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelScroll,
                // enable undo & redo
                "undoManager.isEnabled": true,
	"PartResized": function(e) { e.diagram.layoutDiagram(true); },

          });
    // when the document is modified, add a "*" to the title and enable the "Save" button
    // this.myDiagram.addDiagramListener("Modified", function(e) {});


  

    // define the Node template
    this.myDiagram.nodeTemplate =
        $(go.Node, "Auto", {
                isShadowed: true,
                shadowBlur: 2,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)" ,
                width:180,
                height:40,

            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("zOrder"),
            // define the node's outer shape, which will surround the TextBlock
            $(go.Shape, "RoundedRectangle", roundedRectangleParams, {
                name: "SHAPE",
                fill: "white",
                strokeWidth: 0.5,
                stroke: "black",
                portId: "", // this Shape is the Node's port, not the whole Node
                fromLinkable: false,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: false,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
            }),

              $(go.Panel,
            $(go.TextBlock, {
                    font: "bold 8pt helvetica, bold, ",
                    margin: 4,
                    stroke: "rgba(0, 0, 0, .87)",
                    editable: false,
                    name: "NodeTEXT",
                    alignment: go.Spot.TopCenter,
                    position: new go.Point(0, -30),
                },
                new go.Binding("text","name").makeTwoWay()),),

                $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                      { name: "countNode",
                      width: 40, 
                      height: 15, 
                      fill: "#0162cb",
                      alignment: go.Spot.BottomCenter, 
                      margin: 2,
                      stroke:null,
                        },
                      ),
                $(go.Panel,
                  $(go.TextBlock , {
                    name: "TEXT",
                    font: "bold 7pt helvetica, bold ,",
                    stroke: "white",
                    position: new go.Point(0, 20),
                    editable: false,
          },new go.Binding("text","count").makeTwoWay()),
              ),
        );
 
    // unlike the normal selection Adornment, this one includes a Button
    this.myDiagram.nodeTemplate.selectionAdornmentTemplate =
        $(go.Adornment, "Spot",
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle", roundedRectangleParams, {
                    fill: null,
                    stroke: "lightgray",
                    strokeWidth: 3,
                }),
            ),
        );
  
    this.myDiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Spot", {
                desiredSize: new go.Size(35, 35),
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Circle", {
                fill: "#52ce60",
                stroke: null,
                portId: "",
                fromLinkable: false,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: false,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
                alignment: go.Spot.Bottom,
                // cursor: "pointer"
            }),
            $(go.TextBlock, "Start", {
                font: "bold 8pt helvetica, bold arial, sans-serif",
                stroke: "whitesmoke"
            }),
        ),
    );
  
    this.myDiagram.nodeTemplateMap.add("End",
        $(go.Node, "Spot", {
                desiredSize: new go.Size(35, 35)
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Circle", {
                fill: "maroon",
                stroke: null,
                portId: "",
                fromLinkable: false,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: false,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
                // cursor: "pointer"
            }),
            // $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "whitesmoke" }),
            $(go.TextBlock, "End", {
                font: "bold 8pt helvetica, bold arial, sans-serif",
                stroke: "whitesmoke"
            })
        )
    );
    // replace the default Link template in the linkTemplateMap
  this.myDiagram.linkTemplate =$(go.Link,
      { curve: go.Link.Bezier,
        //  corner: 10,
        //  adjusting: go.Link.Stretch, 
         reshapable: true, 
         toShortLength: 7 },
        new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness"),
        new go.Binding("zOrder"),
      // mark each Shape to get the link geometry with isPanelMain: true
      $(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 7 },
              new go.Binding('strokeWidth','extraNode',function(progress) {
          return progress ? 0 : 7;
        }),
        new go.Binding('strokeWidth','highData',function(highData) {
          return highData ? 7 : 7;
        }),
        ),
      $(go.Shape, { isPanelMain: true, stroke: "blue", strokeWidth: 5 },
      new go.Binding('strokeWidth','extraNode',function(extraNode) {
        return extraNode ? 0 : 7;
      }),
        // new go.Binding('stroke','progress',function(progress) {
        //   return progress ? "green" : 'blue';
        // }), 
        new go.Binding('stroke', 'highData', function(highData) {
          return highData ? "red"  : 'blue';
        }),
        new go.Binding('strokeWidth','redColor',function(highData) {
          return highData ? 7 : 7;
        }),
      ),
      $(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 3, name: "PIPE", strokeDashArray: [10, 10] },
      new go.Binding('stroke','extraNode',function(progress) {
        return progress ? "purple" : "white";
      })
      ,
      // new go.Binding('strokeDashArray', 'inprogress', function(inprogress) {
      //   return inprogress ? [5,5] /* green */ : [10,10];
      // }),
      ),
      $(go.Shape, { toArrow: "Triangle", scale: 1.3, fill: "black", stroke: null }),
      $(go.TextBlock,{ segmentOffset: new go.Point(0, 20) }, // the label text
                    {
                        textAlign: "center",
                        font: "12pt helvetica, arial, sans-serif",
                        margin: 0,
                        editable:false
                    },
                    // editing the text automatically updates the model data
                    new go.Binding("text").makeTwoWay()),
        );
        
    this.myDiagram.model = new go.GraphLinksModel(this.model1, this.model2);
  }
  
}



