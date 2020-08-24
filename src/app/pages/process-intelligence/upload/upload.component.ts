import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { NgxXml2jsonService } from 'ngx-xml2json';

import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from '../../services/rest-api.service';
import { GlobalScript } from '../../../shared/global-script';
import { PiHints } from '../model/process-intelligence-module-hints';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { APP_CONFIG } from 'src/app/app.config';

declare var target: any;
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  xlsx_csv_mime: string;
  xes_mime: string;
  db_mime: string;
  data;
  public dbDetails: any = {};
  public isDisabled: boolean = true;
  selectedFile: File = null;
  filedetails: any;
  process_List: any;
  process_graph_list: any = [];
  fullgraph: any = [];
  public model1;
  public model2;
  public nodeArray: any[];
  linkData = [];
  linkdataArray = [];
  isgraph: boolean = false;
  searchgraph: any;
  orderAsc: boolean = true;
  categoryList: any = [];
  category: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isSearch: boolean = true;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dateFormats:any;
  processId: number;
  isOtherPort:boolean=false;
  otherPortNumber:any;
  portNumber:any;
  isIncrement: boolean=false;
  isTimestammp: boolean=false;
  connectionResp:any;
  tableList:any = [];

  constructor(private router: Router,
    private dt: DataTransferService,
    private rest: RestApiService,
    private global: GlobalScript,
    private hints: PiHints,
    private ngxXml2jsonService: NgxXml2jsonService,
    private notifier:NotifierService,
    @Inject(APP_CONFIG) private config) {  }

  ngOnInit() {
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule("");
    this.xlsx_csv_mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv,.xlsx,.xls';
    this.xes_mime = '.xes';
    this.db_mime = '.json';
    this.dt.changeHints(this.hints.uploadHints);
    this.getAlluserProcessPiIds();
    this.getAllCategories();
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
  onUpload(event, id) {
    // console.log("event",event.addedFiles.length);
    if(event.addedFiles.length==0){
      Swal.fire({
        title: 'Error',
        text: 'Please upload file with proper extension!',
        icon: 'error',
      })
    } else{
    this.selectedFile = <File>event.addedFiles[0];
    const fd = new FormData();
    fd.append('file', this.selectedFile),
      fd.append('permissionStatus', 'yes'),
      this.rest.fileupload(fd).subscribe(res => {
      this.filedetails = res
        let fileName = this.filedetails.data.split(':');
        this.rest.fileName.next(fileName[1]);
        this.onSelect(event, id)
      }, err => {
        Swal.fire({
          title: 'Error',
          text: 'Please try again!',
          icon: 'error',
        })
      });
    }
  }

  getUID(id, name) {
    if (id == 0) {
      let extension = this.getFileExtension(name);
      if (extension == 'csv') {
        id = 2;
      }
      if (extension.indexOf('xls') > -1) {
        id = 1
      }
    }
    return id;
  }

  getFileExtension(filename) {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1];
  }

  onSelect(event, upload_id) {
    let file: File = event.addedFiles[0];
    if (file)
      this.checkUploadId(event, this.getUID(upload_id, file.name));
    else
      this.error_display(event);
  }

  checkUploadId(event, upload_id) {
    if (upload_id == 1)
      this.readExcelFile(event);
    if (upload_id == 2)
      this.readCSVFile(event);
    if (upload_id == 3)
      this.readXESFile(event);
  }

  error_display(event) {
    let message = "Oops! Something went wrong";
    if (event.rejectedFiles[0].reason == "type")
      message = "Please upload file with proper extension";
    if (event.addedFiles.length > 1)
      message = "Only one file has to be uploaded "
    this.global.notify(message, "error");
  }

  readExcelFile(evt) {
    const target: DataTransfer = <DataTransfer>(evt.addedFiles);
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <any[][]>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, range: 0 }));
      // const ws2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]];

      this.dt.changePiData(this.data);
      let excelfile = [];
      excelfile = this.data;
      console.log("excelfile",excelfile,excelfile[1]);
      if(excelfile[0].length==0||(excelfile[1].length==0&&excelfile[2].length==0)){
        Swal.fire({
          title: 'Error',
          text: 'No data found in file!',
          icon: 'error',
        })
      }else{
        localStorage.removeItem("fileData")
        localStorage.setItem("fileData", JSON.stringify(excelfile))
        this.router.navigate(['/pages/processIntelligence/datadocument']);
      }
    };
    reader.readAsBinaryString(target[0]);
  }

  readCSVFile(e) {
    let reader = new FileReader();
    reader.readAsText(e.addedFiles[0]);
    let _self = this;
    reader.onload = () => {
      let csvRecordsArray: string[][] = [];
      (<string>reader.result).split(/\r\n|\n/).forEach((each, i) => {
        csvRecordsArray.push(each.split(','));
      })
      this.dt.changePiData(csvRecordsArray);
      let excelfile = [];
      excelfile = csvRecordsArray;
      if(excelfile[0].length==0||(excelfile[1].length==0&&excelfile[2].length==0)){
        Swal.fire({
          title: 'Error',
          text: 'No data found in uploaded file!',
          icon: 'error',
        })
      }else{
        localStorage.removeItem("fileData")
        localStorage.setItem("fileData", JSON.stringify(excelfile))
        this.router.navigate(['/pages/processIntelligence/datadocument']);
      }
    };
    reader.onerror = function () {
      _self.global.notify("Oops! Something went wrong", "error");
    };
  }

  readXESFile(e): void {
    let me = this;
    let file = e.addedFiles[0];
    let fileReader: FileReader = new FileReader();
    var _self = this;
    fileReader.onload = function (x) {
      let _xml = `${fileReader.result}`
      const parser = new DOMParser();
      const xml = parser.parseFromString(_xml, "text/xml");
      let _obj = _self.ngxXml2jsonService.xmlToJson(xml);

      var resultTable = _obj['log']['trace'];
      let xesData = [];

      var e = resultTable;
      for (var i = 0; i < e.length; i++) {
        var dType = [{
          'attributes': []
        }]
        if (me.checkIsArray(e[i].event) == true) {
          e[i].event.forEach(d => {
            let tmp_arr = [];
            if (me.checkIsArray(e[i].string) == true) {
            e[i].string.forEach(t => {
              if (t['@attributes']['key'] == 'concept:name') {
                   tmp_arr.push(t['@attributes']['value']);
                 }
            });
            } else {
               tmp_arr.push(e[i].string['@attributes']['value']);
            }
           
            d.string.forEach(ss => {
              if (ss['@attributes']['key'] == 'concept:name') {
                tmp_arr.push(ss['@attributes']['value']);
              }

              if (ss['@attributes']['key'] == 'org:resource') {
                tmp_arr.push(ss['@attributes']['value']);
              }
            });
            tmp_arr.push(d.date['@attributes']['value']);
            xesData.push(tmp_arr);
          });

        } else {
          let string = [];
          let date = []
          let tmp_arr = []
          if (me.checkIsArray(e[i].string) == true) {
            e[i].string.forEach(t => {
              if (t['@attributes']['key'] == 'concept:name') {
                   tmp_arr.push(t['@attributes']['value']);
                 }
            });
            } else {
               tmp_arr.push(e[i].string['@attributes']['value']);
            }
          //tmp_arr.push(e[i].string['@attributes']['value']);
          for (let key in e[i].event) {
            if (e[i].event.hasOwnProperty(key)) {
              if (key == 'string') {
                string.push(e[i].event[key]);
              }
              if (key == 'date') {
                date.push(e[i].event[key])
              }
            }
          }
   
          string[0].forEach(ss => {

            if (ss['@attributes']['key'] == 'concept:name') {
              tmp_arr.push(ss['@attributes']['value']);
            }

            if (ss['@attributes']['key'] == 'org:resource') {
              tmp_arr.push(ss['@attributes']['value']);
            }

          });
          date.forEach(sd => {
            tmp_arr.push(sd['@attributes']['value']);
          });
          xesData.push(tmp_arr);
        }
      }
      _self.dt.changePiData(xesData)
      // console.log("xesData",xesData);
      
      if(xesData[0].length==0 && xesData[1].length==0){
        Swal.fire({
          title: 'Error',
          text: 'No data found in file!',
          icon: 'error',
        })
      }else{
        _self.router.navigateByUrl('/pages/processIntelligence/xesdocument');
      }
    }
    fileReader.readAsText(file);
  }

  checkIsArray(v) {
    if (Array.isArray)
      return Array.isArray(v);
  }

  onDbSelect() {
    this.dbDetails={};
    var modal = document.getElementById('myModal1');
    modal.style.display = "block";
  }
  closePopup() {
    var modal = document.getElementById('myModal1');
    modal.style.display = "none";
  }
  downloadCSV() {
    var data = [];
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: ['S.No', 'Order Number', 'Start Timestamp', 'End Timestamp', 'Resource']
    };

    new ngxCsv(data, 'Sample_Template', options);
  }

  getAlluserProcessPiIds() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      language: { searchPlaceholder: 'Search', },
      // "order": [[ 0, 'asc' ], [ 1, 'asc' ]]
      "order": [],
    };
    this.rest.getAlluserProcessPiIds().subscribe(data => {
    this.process_List = data
      this.process_List.data.sort(function (a, b) {
        a = new Date(a.createdTime);
        b = new Date(b.createdTime);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      this.process_graph_list = this.process_List.data
      this.dtTrigger.next();
    })
  }
  loopTrackBy(index, term) {
    return index;
  }
  onGraphSelection(selectedpiIdData) {
    this.isgraph = true;
    let selected_process_id = selectedpiIdData.piId
    this.router.navigate(["/pages/processIntelligence/flowChart"], { queryParams: { wpiId: selected_process_id } });

  }
  getcategoryName(categoryName) {
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  }
  sortDataTable(arrayColNames, asc) { // if not asc, desc
    for (var i = 0; i < arrayColNames.length; i++) {
      var columnName = arrayColNames[i];
      this.process_graph_list = this.process_graph_list.sort(function (a, b) {
        if (asc) {
          return (a[columnName] > b[columnName]) ? 1 : -1;
        } else {
          return (a[columnName] < b[columnName]) ? 1 : -1;
        }
      });
    }
  }
  getAllCategories() {
    this.rest.getCategoriesList().subscribe(res => {
    this.categoryList = res
    })
  }
  searchByCategory(category) {
    if (category == "allcategories") {
      this.dtElement.dtInstance.then((dtInstance) => {
        this.process_graph_list = this.process_List.data;
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    } else {
      this.process_graph_list = []
      this.dtElement.dtInstance.then((dtInstance) => {

        this.process_List.data.forEach(element => {
          if (element.categoryName == category) {
            this.process_graph_list.push(element)
          }
        });
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      })
    }
  }
  onsearchSelect() {
    this.isSearch = false;
    var searcgraph = document.getElementById("myTableId_filter")
    searcgraph.style.display = "block";
  }
  changeType(){
    //this.dbDetails.hostName=this.config.dbHostName //10.11.0.104-QA
    this.dbDetails.portNumber="5432"
    this.dbDetails.dbName=this.config.dbName // eiap_qa - QA
   // this.dbDetails.tableName="public.accounts_payable"
  }
  onChangeMode(value){
    if(value=="incrementing"){
      this.isIncrement=true;
      this.isTimestammp=false;
    }else if(value=="timestamp"){
      this.isTimestammp=true;
      this.isIncrement=false;
    }else{
      this.isTimestammp=true;
      this.isIncrement=true;
    }
  }

testDbConnection(){
  this.processId = Math.floor(100000 + Math.random() * 900000);
    // this.portNumber=this.dbDetails.portNumber
    let modekey
    let modekey1
    let connectorBody:any= {}
    connectorBody={
      // "name": "dbconnector-113",
      "name": "dbconnector-"+this.processId,
      // "config": {
      "batch.max.rows": "1000",
      "catalog.pattern": "public",
      "connection.attempts": "10",
      "connection.backoff.ms": "10000",
      "connection.user": this.dbDetails.userName,
      "connection.password": this.dbDetails.password,
      // "connection.url": "jdbc:postgresql://10.11.0.104:5432/asimov_aiotal",
      "connection.url": "jdbc:"+this.dbDetails.dbType+"://"+this.dbDetails.hostName+":"+this.dbDetails.portNumber+"/"+this.dbDetails.dbName,
      "db.timezone": "UTC",
      //"incrementing.column.name": "id",
      "validate.non.null": "true",
      // "mode": "incrementing",
      "mode": this.dbDetails.mode,
      "numeric.mapping": "best_fit",
      "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
      "poll.interval.ms": 3600000,
      "topic.prefix": this.config.piConnector+"connector-"+this.processId,
      "quote.sql.identifiers": "ALWAYS",
      // "table.whitelist": "public.accounts_payable",
      "table.whitelist": this.dbDetails.tableName,
      "table.poll.interval.ms": "60000",
      "table.types": "TABLE",
      "key.converter": "io.confluent.connect.avro.AvroConverter",
      "key.converter.schema.registry.url": "http://10.11.0.101:8081",
      "value.converter": "io.confluent.connect.avro.AvroConverter",
      "value.converter.schema.registry.url": "http://10.11.0.101:8081",
      "transforms": "RenameField,ReplaceField,convert_endTime_string,convert_startTime_string,createKey,extractInt,InsertField",
      "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
      "transforms.RenameField.renames": "start_time:startTime,end_time:endTime,operation:activity,agent:resource,caseid:caseID",
      "transforms.ReplaceField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
      "transforms.ReplaceField.whitelist": "caseID,startTime,endTime,activity,resource",
      "transforms.convert_startTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
      "transforms.convert_startTime_string.field": "startTime",
      "transforms.convert_startTime_string.target.type": "string",
      "transforms.convert_startTime_string.format": "MM/dd/yyyy HH:mm:ss",
      "transforms.convert_endTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
      "transforms.convert_endTime_string.field": "endTime",
      "transforms.convert_endTime_string.target.type": "string",
      "transforms.convert_endTime_string.format": "MM/dd/yyyy HH:mm:ss",
      "transforms.createKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
      "transforms.createKey.fields": "caseID",
      "transforms.extractInt.type": "org.apache.kafka.connect.transforms.ExtractField$Key",
      "transforms.extractInt.field": "caseID",
      "transforms.InsertField.type": "org.apache.kafka.connect.transforms.InsertField$Value",
      "transforms.InsertField.static.field": "piIdName",
      "transforms.InsertField.static.value": this.processId+"-p"+this.processId
        // }
      }
      if(this.dbDetails.mode=="incrementing"){
        modekey="incrementing.column.name"
        connectorBody[modekey]=this.dbDetails.increment
      }else if(this.dbDetails.mode=="timestamp"){
        modekey="timestamp.column.name"
        connectorBody[modekey]=this.dbDetails.timestamp
      }else{
        modekey1="incrementing.column.name"
        connectorBody[modekey1]=this.dbDetails.increment
        modekey="timestamp.column.name"
        connectorBody[modekey]=this.dbDetails.timestamp
      }

   
    this.rest.getJDBCConnectorConfig(connectorBody).subscribe(res => {this.connectionResp=res
      
      if(this.connectionResp.data.length==0){
        this.isDisabled = false;
        this.notifier.show({
          type: 'success',
          message: "Connected Successfully."
      });
      }else{
        console.log(this.connectionResp.data[0].errors);
          this.notifier.show({
              type: 'error',
              message: "Error"+this.connectionResp.data[0].errors
          });
      }
           
      })
}
slideUp(){
  this.closePopup();
  var modal = document.getElementById('myModal');
  modal.style.display="block";
  }

generateGraph(e){
  let modekey
  let modekey1
  let connectorBody:any= {}
  connectorBody={
    // "name": "dbconnector-113",
    "name": "dbconnector-"+this.processId,
    "config": {
    "batch.max.rows": "1000",
    "catalog.pattern": "public",
    "connection.attempts": "10",
    "connection.backoff.ms": "10000",
    "connection.user": this.dbDetails.userName,
    "connection.password": this.dbDetails.password,
    // "connection.url": "jdbc:postgresql://10.11.0.104:5432/asimov_aiotal",
    "connection.url": "jdbc:"+this.dbDetails.dbType+"://"+this.dbDetails.hostName+":"+this.dbDetails.portNumber+"/"+this.dbDetails.dbName,
    "db.timezone": "UTC",
    //"incrementing.column.name": "id",
    "validate.non.null": "true",
    // "mode": "incrementing",
    "mode": this.dbDetails.mode,
    "numeric.mapping": "best_fit",
    "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
    "poll.interval.ms": 3600000,
    "topic.prefix": this.config.piConnector+"connector-"+this.processId,
    "quote.sql.identifiers": "ALWAYS",
    // "table.whitelist": "public.accounts_payable",
    "table.whitelist": this.dbDetails.tableName,
    "table.poll.interval.ms": "60000",
    "table.types": "TABLE",
    "key.converter": "io.confluent.connect.avro.AvroConverter",
    "key.converter.schema.registry.url": "http://10.11.0.101:8081",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": "http://10.11.0.101:8081",
    "transforms": "RenameField,ReplaceField,convert_endTime_string,convert_startTime_string,createKey,extractInt,InsertField",
    "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
    "transforms.RenameField.renames": "start_time:startTime,end_time:endTime,operation:activity,agent:resource,caseid:caseID",
    "transforms.ReplaceField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
    "transforms.ReplaceField.whitelist": "caseID,startTime,endTime,activity,resource",
    "transforms.convert_startTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
    "transforms.convert_startTime_string.field": "startTime",
    "transforms.convert_startTime_string.target.type": "string",
    "transforms.convert_startTime_string.format": "MM/dd/yyyy HH:mm:ss",
    "transforms.convert_endTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
    "transforms.convert_endTime_string.field": "endTime",
    "transforms.convert_endTime_string.target.type": "string",
    "transforms.convert_endTime_string.format": "MM/dd/yyyy HH:mm:ss",
    "transforms.createKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
    "transforms.createKey.fields": "caseID",
    "transforms.extractInt.type": "org.apache.kafka.connect.transforms.ExtractField$Key",
    "transforms.extractInt.field": "caseID",
    "transforms.InsertField.type": "org.apache.kafka.connect.transforms.InsertField$Value",
    "transforms.InsertField.static.field": "piIdName",
    "transforms.InsertField.static.value": this.processId+"-p"+this.processId
    }
    }
    if(this.dbDetails.mode=="incrementing"){
      modekey="incrementing.column.name"
      connectorBody.config[modekey]=this.dbDetails.increment
    }else if(this.dbDetails.mode=="timestamp"){
      modekey="timestamp.column.name"
      connectorBody.config[modekey]=this.dbDetails.timestamp
    }else{
      modekey1="incrementing.column.name"
      connectorBody.config[modekey1]=this.dbDetails.increment
      modekey="timestamp.column.name"
      connectorBody.config[modekey]=this.dbDetails.timestamp
    }
  this.rest.saveConnectorConfig(connectorBody,e.categoryName,this.processId,e.processName).subscribe(res=>{
    this.router.navigate(['/pages/processIntelligence/flowChart'],{queryParams:{piId:this.processId}});
})
}
getDBTables(){
 var reqObj =  {
    "dbType": this.dbDetails.dbType,
    "password": this.dbDetails.password,
    "url": "jdbc:"+this.dbDetails.dbType+"://"+this.dbDetails.hostName+":"+this.dbDetails.portNumber+"/"+this.dbDetails.dbName,
    "userName": this.dbDetails.userName
  }
  this.rest.getDBTableList(reqObj)
    .subscribe(res => {
      console.log(res)
      var tData: any = res;
      if(tData.data.length != 0){
        this.tableList = tData.data;
      }
    },
    (err=>{
      this.tableList = [];
    
      this.notifier.show({
        type: 'error',
        message: err.error.message
    });
    }))
}
}



