import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from "angular-notifier";
import * as XLSX from 'xlsx';

import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from '../../services/rest-api.service';

declare var target:any;


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  notifier: NotifierService;
  xlsx_csv_mime:string;
  xes_mime:string;
  db_mime:string;
  hints:any[];
  data;

  constructor(private router: Router, private dt:DataTransferService, private rest:RestApiService, private notifierService: NotifierService) { }

  ngOnInit() {
    this.notifier = this.notifierService;
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule("");
    this.xlsx_csv_mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv';
    this.xes_mime = '.xes';
    this.db_mime = '.json';
    this.hints = [
      { selector:'#upload_xl', description:'Upload Excel or CSV File', showNext:true },
      { selector:'#upload_xes', description:'Upload XES file', showNext:true },
      { selector:'#upload_db', description:'Upload JSON file' }
    ];
    this.dt.changeHints(this.hints);
  }

  getUID(id,name){
    if(id == 0){
      let extension = name.split('.')[1];
      if(extension == 'csv'){
        id = 2;
      }
      if(extension.indexOf('xls') > -1){
        id = 1
      }
    }
    return id;
  }
  /* Upload the file from UI to Backend */
  // uploadFile(body, upload_id, file){
  //   this.rest.sendUploadedFile(body, upload_id).subscribe(
  //     res => {
  //       this.dt.changePiData(file);
  //       this.router.navigate(['/pages/processIntelligence/datadocument']);
  //     }, err => {
  //       this.notifier.show({
  //         type: "error",
  //         message: "Oops! Something went wrong"
  //       });
  //   });
  // }
  onSelect(event,upload_id) {
    let file:File = event.addedFiles[0]
    if(file){
      upload_id = this.getUID(upload_id, file.name);
      let body = new FormData();
      body.append("file", file);
      if(upload_id == 1){
        this.readExcelFile(event);
      }
      if(upload_id == 2){
        this.readCSVFile(event);
      }
      //this.uploadFile(body, upload_id, file);
    }else{
      this.error_display(event);
    }
  }

  notification(msg, type){
    this.notifier.show({
      type: type,
      message: msg
    });
  }

  error_display(event){
    let message = "Oops! Something went wrong";
      if(event.rejectedFiles[0].reason == "type")
        message = "Please upload file with proper extension";
      if(event.addedFiles.length > 1)
        message = "Only one file has to be uploaded "
     this.notification(message,"error");
  }

  readExcelFile(evt) {
    const target:DataTransfer = <DataTransfer>(evt.addedFiles);
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <any[][]>(XLSX.utils.sheet_to_json(ws, {header: 1, raw: false, range: 0}));
      // const ws2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]];
      this.dt.changePiData(this.data);    
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
      this.router.navigate(['/pages/processIntelligence/datadocument']);  
    };  
    reader.onerror = function () {  
      _self.notification("Oops! Something went wrong", "error");
    };
  }


}
