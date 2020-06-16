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
    const piid={"piId":selectedpiIdData.piId}
    this.router.navigate(['/pages/processIntelligence/flowChart',piid])
    // this.rest.getfullGraph(selectedpiIdData.piId).subscribe(data=>{this.fullgraph=data
    //   // console.log("fullgraph",this.fullgraph.data.allSelectData);
    //   let fullgraph=JSON.parse(this.fullgraph.data)
    //   console.log("fullgraph",fullgraph);
      
    //   this.model1 = fullgraph.allSelectData.nodeDataArraycase
    //   this.model2 = this.flowchartData(this.model1)
      // this.flowGraph()
      // })
    
  }
  
}



