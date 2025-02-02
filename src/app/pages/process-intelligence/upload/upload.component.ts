import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from '../../services/rest-api.service';
import { GlobalScript } from '../../../shared/global-script';
import { PiHints } from '../model/process-intelligence-module-hints';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { APP_CONFIG } from 'src/app/app.config';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from "src/app/shared/model/table_columns"
import { ConfirmationService } from 'primeng/api';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

declare var target: any;
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers:[columnList]
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
  dtTrigger: Subject<any> = new Subject();
  isSearch: boolean = true;
  dateFormats:any;
  processId: number;
  isOtherPort:boolean=false;
  otherPortNumber:any;
  portNumber:any;
  isIncrement: boolean=false;
  isTimestammp: boolean=false;
  connectionResp:any;
  tableList:any = [];
  isTableEnable:boolean=false;
  sortIndex:number=2;
  displayedColumns: string[] = ["piId","createdTime","piName","categoryName" ,"status","action"];
  customUserRole: any;
  enableuploadbuttons: boolean=false;
  enableWorkspace: boolean=false;
  showprocessgraph: boolean=false;
  userRole: any;
  categoryName: any;
  public isButtonVisible = false;
  isUploadFileName:string;
  isLoading:boolean=true;
  categories_list:any[]=[];
  freetrail: string;
  overlay_data:any={};
  refreshSubscription:Subscription;
  @ViewChild('database') mytemplateForm : NgForm;
  modesList=[{name:"Incrementing",value:"incrementing"},{name:"Timestamp",value:"timestamp"},{name:"Incrementing with Timestamp",value:"timestamp+incrementing"}]
  noDataMessage: boolean;
  table_searchFields:any[]=[];
  categories_list_new:any[]=[];
  hiddenPopUp:boolean=false;
  hiddenPopUp1: boolean=false;
  columns_list:any=[];

  constructor(private router: Router,
    private dt: DataTransferService,
    private rest: RestApiService,
    private global: GlobalScript,
    private hints: PiHints,
    private ngxXml2jsonService: NgxXml2jsonService,
    private notifier:NotifierService,
    private loader: LoaderService,
    private confirmationService: ConfirmationService,
    private columnList: columnList,
    private cryptoService : CryptoService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    @Inject(APP_CONFIG) private config) {  }

  ngOnInit() {
    this.dt.piHeaderValues('');
    localStorage.removeItem("project_id");
    if(document.getElementById("filters"))
    document.getElementById("filters").style.display = "block";
    this.xlsx_csv_mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv,.xlsx,.xls';
    this.xes_mime = '.xes';
    this.db_mime = '.json';
    this.dt.changeHints(this.hints.uploadHints);
    this.getAlluserProcessPiIds();
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect')  || this.userRole.includes('Process Analyst')  || this.userRole.includes('RPA Developer')  || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin") ;
    this.columns_list = this.columnList.pi_columns
    this.rest.getCustomUserRole(2).subscribe(role=>{
      this.customUserRole=role.message[0].permission;
      this.customUserRole.forEach(element => {
        if(element.permissionName.includes('PI_upload_full')){
          this.enableuploadbuttons=true;
        } if(element.permissionName.includes('PI_Workspace_full')){
          this.enableWorkspace=true;
        }
      }
          );
        })
    this.freetrail=localStorage.getItem('freetrail')
    this.refreshSubscription=this.dt.isTableRefresh.subscribe(res => {
      if (res) {
        if (res.isRfresh) {
          this.hiddenPopUp=false;
          this.hiddenPopUp1=false;
          this.getAlluserProcessPiIds();
        }
      }
    })

    this.table_searchFields=["piId","convertedTime_new","piName","categoryName","status"]
   
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

  onUpload(event, id) {     //for Upload csv/xls/xes/xes.gz file
    if (this.freetrail == 'true') {
      if (this.process_graph_list.length == this.config.pigraphfreetraillimit) {
        this.confirmationService.confirm({
          message: "You have limited access to this product. Please contact the EZFlow support team for more details.",
          header: "Info",
          rejectVisible: false,
          acceptLabel: "Ok",
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          acceptIcon: 'null',
          accept: () => {}
        });
      } else {
        if (event.addedFiles.length == 0) {
          this.toastService.showError(this.toastMessages.fileExtensionErr);
        } else {
          this.loader.show();
          this.selectedFile = <File>event.addedFiles[0];
          const fd = new FormData();
          fd.append('file', this.selectedFile),
            fd.append('permissionStatus', 'yes'),
            this.rest.fileupload(fd).subscribe(res => {
              this.filedetails = res
              let fileName = this.filedetails.data.split(':');
              this.rest.fileName.next(fileName[1]);
              this.onSelect(event, id)
              this.loader.hide();
            }, err => {
              this.toastService.showError('Please try again!');
              this.loader.hide();
            });
        }
      }
    } else {
      if (event.addedFiles.length == 0) {
        this.toastService.showError(this.toastMessages.fileExtensionErr);
      } else {
        this.loader.show();
        this.selectedFile = <File>event.addedFiles[0];
        const fd = new FormData();
        fd.append('file', this.selectedFile),
          fd.append('permissionStatus', 'yes'),
          this.rest.fileupload(fd).subscribe(res => {
            this.filedetails = res
            let fileName = this.filedetails.data.split(':');
            this.rest.fileName.next(fileName[1]);
            this.onSelect(event, id)
            this.loader.hide();
          }, err => {
            this.toastService.showError(this.toastMessages.plzTryAgain);
            this.loader.hide();
          });
      }
    }
  }

  getUID(id, name) {    // get id based uploaded extension file
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

  getFileExtension(filename) {        // get uploaded file extension
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

  checkUploadId(event, upload_id) { // read file based on selected file
    if (upload_id == 1){
      this.readExcelFile(event);
    }
    if (upload_id == 2){
      if(this.freetrail == 'true'){
        this.toastService.showError(this.toastMessages.onlyExlAccss);
      }else{
      this.readCSVFile(event);
      }
    }
    if (upload_id == 3){
      let file: File = event.addedFiles[0];
    let extension = this.getFileExtension(file.name);
      switch(extension){
        case 'xes':
          this.readXESFile(event);
          break;
        case 'gz':
          this.openXESGZFile()
      }
    }
  }

  openXESGZFile(){
    this.overlay_data={"type":"create","module":"pi"};
    // var modal = document.getElementById('myModal');
    // modal.style.display="block";
    this.hiddenPopUp1=true;
  }

  error_display(event) {
    let message = "Oops! Something went wrong";
    if (event.rejectedFiles[0].reason == "type")
      message = "Please upload file with proper extension";
    if (event.addedFiles.length > 1)
      message = "Only one file has to be uploaded "
    this.global.notify(message, "error");
  }

  readExcelFile(evt) {    // read xls files
    const target: DataTransfer = <DataTransfer>(evt.addedFiles);
    const reader: FileReader = new FileReader();
    const datepipe: DatePipe = new DatePipe('en-US');
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr,  { type: 'binary', cellText: false, cellDates:true });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <any[][]>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '', blankrows: true, range: 0, dateNF:'YYYY-MM-DD HH:mm:ss' }));

      this.dt.changePiData(this.data);
      let excelfile = [];
      excelfile = this.data;
      if(this.freetrail== 'true'){
        if(excelfile.length>100){
          this.confirmationService.confirm({
            message: "The data limit was exceeded for the user.",
            header: "Info",          
            rejectVisible: false,
            acceptLabel: "Ok",
            acceptButtonStyleClass: 'btn bluebg-button',
            defaultFocus: 'none',
            acceptIcon: 'null',
            accept: () => {}
          });
      //    Swal.fire({
      //      title: 'Error',
      //      text: "Data limit exceeded for user",
      //      position: 'center',
      //      icon: 'error',
      //      showCancelButton: false,
      //      customClass: {
      //       confirmButton: 'btn bluebg-button',
      //       cancelButton:  'btn new-cancelbtn',
      //     },
	
      //      heightAuto: false,
      //      confirmButtonText: 'Ok'
      //  })
      } else{
        this.router.navigate(['/pages/processIntelligence/datadocument']);
      }
     } else{
      if(excelfile.length<=2||excelfile[0].length==0||(excelfile[1].length==0&&excelfile[2].length==0)||excelfile[1].length==1){
        this.toastService.showError(this.toastMessages.noDataFoundErr);
      }else{
        this.router.navigate(['/pages/processIntelligence/datadocument']);
      }
    }
    };
    reader.readAsBinaryString(target[0]);
  }

  readCSVFile(e) {        //  read CSV files
    let reader = new FileReader();
    reader.readAsText(e.addedFiles[0]);
    let _self = this;
    reader.onload = () => {
      let csvRecordsArray: string[][] = [];
      (<string>reader.result).split(/\r\n|\n/).forEach((each, i) => {
        if(each)
        csvRecordsArray.push(each.split(','));
      })
      this.dt.changePiData(csvRecordsArray); // share file data using behavior subject
      let excelfile = [];
      excelfile = csvRecordsArray;
      if(excelfile.length<=2||excelfile[0].length==0||(excelfile[1].length==0&&excelfile[2].length==0)||excelfile[1].length==1){
        this.toastService.showError(this.toastMessages.noDataFoundErr);
      }else{
        this.router.navigate(['/pages/processIntelligence/datadocument']);
      }
    };
    reader.onerror = function () {
      _self.global.notify("Oops! Something went wrong.", "error");
    };
  }

  readXESFile(e): void {    // read XES files
    let me = this;
    let file = e.addedFiles[0];
    let fileReader: FileReader = new FileReader();
    var _self = this;
    let toastSrvce = this.toastService;
    let toastMsg = this.toastMessages
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
      if(xesData.length<=2||(xesData[0].length==0 && xesData[1].length==0)){
        // message.add({
        //   severity: "error",
        //   summary: "Error",
        //   detail: "No data was found in the uploaded file!",
        // });
        toastSrvce.showError(toastMsg.noDataFoundErr);
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

  onDbSelect() {    // file upload from DB
    this.isTableEnable=false;
    this.isTimestammp=false;
    this.isIncrement=false;
    this.hiddenPopUp=true;
    // var modal = document.getElementById('myModal1');
    // modal.style.display = "block";
    this.rest.fileName.next(null);
    this.mytemplateForm.resetForm();
    this.isDisabled=true;
  }

  closePopup() {    // close overlay
    // var modal = document.getElementById('myModal1');
    // modal.style.display = "none";
  }

  downloadCSV() { // Download sample csv file
    var data = [];
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: ['S.No', 'CaseID', 'Activity', 'Start Timestamp', 'End Timestamp', 'Resource']
    };
    new ngxCsv(data, 'Sample_Template', options);
  }

  getAlluserProcessPiIds() {        // get user process ids list on workspace
    this.hiddenPopUp1=false;
    this.hiddenPopUp = false;
    this.loader.show();
    this.dt.processDetailsUpdateSuccess({"isRfresh":false});
    this.rest.getAlluserProcessPiIds().subscribe((data:any) => {
    this.process_List = data;
    if(data.data.length==0)
    {
      this.noDataMessage=true;
    }
    else
    {
      this.noDataMessage=false;
    }
      this.process_List.data.sort(function (a, b) {
        a = new Date(a.createdTime);
        b = new Date(b.createdTime);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      this.process_graph_list = this.process_List.data
      this.process_graph_list.forEach(element => {
        element['convertedTime_new']= new Date(element.convertedTime)
      });
      this.loader.hide();
      this.getAllCategories();
    })
  }

  loopTrackBy(index, term) {
    return index;
  }

  onGraphSelection(selectedpiIdData) {    // View selected graph on workspace
    if(selectedpiIdData.status == "Inprogress"){
      this.confirmationService.confirm({
        message: "This graph is currently being processed. Please try again later.",
        header: "Info",      
        rejectVisible: false,
        acceptLabel: "Ok",
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        acceptIcon: 'null',
        accept: () => {}
      });
      // Swal.fire({
      //   position: 'center',
      //   icon: 'info',
      //   title: 'This graph is under processing, please try again later',
      //   showConfirmButton: true,
      //   heightAuto: false,
      // })
    return
    }
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

  getAllCategories() {    // get all categories list for dropdown
    this.rest.getCategoriesList().subscribe(res => {
    this.categoryList = res
    this.categories_list=this.categoryList.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
    this.categories_list.forEach(element => {
      this.categories_list_new.push(element.categoryName)
    });
    this.columns_list.map(item=>{
      if(item.ColumnName === "categoryName"){
        item["dropdownList"]=this.categories_list_new;
      }
    })
    let selected_category=localStorage.getItem("pi_search_category");
      if(this.categories_list.length == 1){
        this.categoryName=this.categories_list[0].categoryName;
      }else{
        this.categoryName=selected_category?selected_category:'allcategories';
      }
      if (this.categoryList.data.length === 0) {
        this.confirmationService.confirm({
          message: "No categories available. Please contact the system admin to get access.",
          header: "Info",
          acceptLabel: "Ok",
          rejectVisible: false,
          acceptButtonStyleClass: "btn bluebg-button",
          defaultFocus: "none",
          acceptIcon: "null",
          accept: () => {
            // Add your logic here for contacting the system administrator
          },
        });
      }

    })
  }

  onsearchSelect() {
    this.isSearch = false;
    var searcgraph = document.getElementById("myTableId_filter")
    searcgraph.style.display = "block";
  }

  changeType(){
    this.dbDetails.portNumber=this.config.dbPort
    this.dbDetails.dbName=this.config.dbName
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
    this.dbDetails.increment='';
    this.dbDetails.timestamp='';
    if(this.mytemplateForm.controls["increment"])
    this.mytemplateForm.controls["increment"].markAsUntouched();
    if(this.mytemplateForm.controls["timestamp"])
    this.mytemplateForm.controls["timestamp"].markAsUntouched();
  }

testDbConnection(){     // check DB connection with port id and psw
  this.processId = Math.floor(100000 + Math.random() * 900000);
  this.loader.show();
    let modekey
    let modekey1
    let connectorBody:any= {}
      connectorBody={
        "name": "dbconnector-"+this.processId,
        "batch.max.rows": "1000",
        "catalog.pattern": "public",
        "connection.attempts": "10",
        "connection.backoff.ms": "10000",
        "connection.user": this.dbDetails.userName,
        // "connection.password": this.dbDetails.password,
        "connection.password": this.cryptoService.encrypt(this.dbDetails.password),
        "connection.url": "jdbc:"+this.dbDetails.dbType+"://"+this.dbDetails.hostName+":"+this.dbDetails.portNumber+"/"+this.dbDetails.dbName,
        "db.timezone": "UTC",
        "validate.non.null": "true",
        "mode": this.dbDetails.mode,
        "numeric.mapping": "best_fit",
        "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
        "poll.interval.ms": 10000,
        "topic.prefix": this.config.piConnector+"connector-"+this.processId,
        "quote.sql.identifiers": "ALWAYS",
        "table.whitelist": this.dbDetails.tableName,
        "table.poll.interval.ms": "60000",
        "table.types": "TABLE",
        "key.converter": "io.confluent.connect.avro.AvroConverter",
        "key.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
        "value.converter": "io.confluent.connect.avro.AvroConverter",
        "value.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
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
        this.loader.hide();
        if(this.connectionResp.data.length==0){
          this.isDisabled = false;
            this.notifier.show({
              type: 'success',
              message: "Connected successfully!"
              });
          }else{
            this.loader.hide();
            this.notifier.show({
              type: 'error',
              message: "Error"+this.connectionResp.data[0].errors
            });
          }
      })
}

  slideUp(){    //Open bottom Overlay
    this.closePopup();
    this.overlay_data={"type":"create","module":"pi"};
    // var modal = document.getElementById('myModal');
    // modal.style.display="block";
    this.hiddenPopUp1=true;
  }

  generateGraph(e){       // Graph generation from bottom overlay
    this.rest.fileName.subscribe(res => {
      this.isUploadFileName = res;
    });
    if (this.isUploadFileName) {
      if (this.isUploadFileName.includes('gz')) {
        this.generateXESGZGraph(e);
      } 
    }else {
      let modekey
      let modekey1
      let connectorBody:any= {}
      connectorBody={
        "name": "dbconnector-"+this.processId,
          "config": {
          "batch.max.rows": "1000",
          "catalog.pattern": "public",
          "connection.attempts": "10",
          "connection.backoff.ms": "10000",
          "connection.user": this.dbDetails.userName,
          // "connection.password": this.dbDetails.password,
          "connection.password": this.cryptoService.encrypt(this.dbDetails.password),
          "connection.url": "jdbc:"+this.dbDetails.dbType+"://"+this.dbDetails.hostName+":"+this.dbDetails.portNumber+"/"+this.dbDetails.dbName,
          "db.timezone": "UTC",
          "validate.non.null": "true",
          "mode": this.dbDetails.mode,
          "numeric.mapping": "best_fit",
          "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
          "poll.interval.ms": 10000,
          "topic.prefix": this.config.piConnector+"connector-"+this.processId,
          "quote.sql.identifiers": "ALWAYS",
          "table.whitelist": this.dbDetails.tableName,
          "table.poll.interval.ms": "60000",
          "table.types": "TABLE",
          "key.converter": "io.confluent.connect.avro.AvroConverter",
          "key.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
          "value.converter": "io.confluent.connect.avro.AvroConverter",
          "value.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
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
      this.rest.saveConnectorConfig(connectorBody,e.categoryName,this.processId,e.processName,e.categoryId).subscribe(res=>{
        this.hiddenPopUp1=false;
        this.router.navigate(['/pages/processIntelligence/flowChart'],{queryParams:{piId:this.processId}});
      })
    }
  }

  generateXESGZGraph(e){    //Graph generate for uploaded XES.GZ file
    this.processId = Math.floor(100000 + Math.random() * 900000);
      this.rest.fileName.subscribe(res => {
        this.isUploadFileName = res;
      });
      const connectorBody = {
        "name": "xes-" + this.processId,
        "config": {
          "connector.class": "com.epsoft.asimov.connector.xes.XesSourceConnector",
          "tasks.max": "1",
          "file": this.config.dataPath + "/" + this.isUploadFileName,
          "topic": this.config.piConnector+"connector-xes-" + this.processId,
          "key.converter": "io.confluent.connect.avro.AvroConverter",
          "key.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
          "value.converter": "io.confluent.connect.avro.AvroConverter",
          "value.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
          "transforms": "TimestampConverter,ValueToKey,InsertField",
          "transforms.TimestampConverter.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
          "transforms.TimestampConverter.format": "MM/dd/yyyy HH:mm:ss",
          "transforms.TimestampConverter.field": "startTime",
          "transforms.TimestampConverter.target.type": "string",
          "transforms.ValueToKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
          "transforms.ValueToKey.fields": "caseID",
          "transforms.InsertField.type": "org.apache.kafka.connect.transforms.InsertField$Value",
          "transforms.InsertField.static.field": "piIdName",
          "transforms.InsertField.static.value": this.processId + "-p" + this.processId
        }
      }
      this.rest.saveConnectorConfig(connectorBody, e.categoryName, this.processId, e.processName,e.categoryId).subscribe(res => {
        this.router.navigate(['/pages/processIntelligence/flowChart'], { queryParams: { piId: this.processId } });
      })
  }
  
getDBTables(){      //get DB tables list
  this.loader.show();
  var reqObj =  {
      "dbType": this.dbDetails.dbType,
      // "password": this.dbDetails.password,
      "password": this.cryptoService.encrypt(this.dbDetails.password),
      "url": "jdbc:"+this.dbDetails.dbType+"://"+this.dbDetails.hostName+":"+this.dbDetails.portNumber+"/"+this.dbDetails.dbName,
      "userName": this.dbDetails.userName
    }
  this.rest.getDBTableList(reqObj)
    .subscribe(res => {
     this.isTableEnable=true;
      var tData: any = res;
      if(tData.data.length != 0){
        this.tableList = tData.data;
        this.tableList.sort(function (a, b) {
          return a.localeCompare(b);
        });
        this.tableList = [...new Set(this.tableList)];
      }
      this.loader.hide();
    },
    (err=>{
      this.isTableEnable=false;
      this.tableList = [];
        this.notifier.show({
          type: 'error',
          message: err.error.message
        });
        this.loader.hide();
    }))
}

  onChangeTable(){
    this.dbDetails.mode="";
    this.mytemplateForm.controls["increase"].markAsUntouched();
    this.dbDetails.increment="";
    if(this.mytemplateForm.controls["increment"])
    this.mytemplateForm.controls["increment"].markAsUntouched();
    this.dbDetails.timestamp="";
    if(this.mytemplateForm.controls["timestamp"])
    this.mytemplateForm.controls["timestamp"].markAsUntouched();
    this.isTimestammp=false;
    this.isIncrement=false;
  }

  onKeyUpPassword(){
    this.dbDetails.hostName=''
    this.mytemplateForm.controls["hostname"].markAsUntouched();
    this.onChangeValues();
  }

  onRetryGraphGenerate(processDt){
    var _self = this;
    this.rest.retryFailedProcessGraph(processDt.piId).subscribe((res:any)=>{
      if(res.is_error == false){
        this.confirmationService.confirm({
          message: "Great " + res.display_msg.info,
          header: "Info",
          rejectVisible: false,
          acceptLabel: "Ok",
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          acceptIcon: 'null',
          accept: () => {
            this.toastService.showInfo(this.toastMessages.redirect2PrcssMap);
            setTimeout(() => {
              _self.router.navigate(["/pages/processIntelligence/flowChart"], { queryParams: { piId: processDt.piId } });
            }, 1500);
          }
        });
       
      } else{
        this.toastService.showError("Oops!" + res.display_msg.info);
      }
    },(err)=>{
    })

  }

  onDeleteSelectedProcess(ele){   
    let req_body={
      "piId":ele.piId
    }
    this.confirmationService.confirm({
      message: "Do you want to delete this process? This can't be undo.",
      header: "Are you sure?",
      rejectLabel: "No",
      acceptLabel: "Yes",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.rest.deleteSelectedProcessID(req_body).subscribe(
          (res) => {
            this.toastService.showSuccess(ele.piName,'delete'); 
            this.getAlluserProcessPiIds();
          },
          (err) => {
            this.toastService.showError(this.toastMessages.deleteError);
          }
        );
      }
    });

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   heightAuto: false,
    //   customClass: {
    //     confirmButton: 'btn bluebg-button',
    //     cancelButton:  'btn new-cancelbtn',
    //   },
    //   confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //   if (result.value) {
    //     this.loader.show();
    //     this.rest.deleteSelectedProcessID(req_body).subscribe(res=>{
    //       let status:any = res;
    //       Swal.fire({
    //         title: 'Success',
    //         text: ele.piName+" Deleted Successfully !!",
    //         position: 'center',
    //         icon: 'success',
    //         showCancelButton: false,
    //         heightAuto: false,
    //         customClass: {
    //           confirmButton: 'btn bluebg-button',
    //           cancelButton:  'btn new-cancelbtn',
    //         },
    
    //         confirmButtonText: 'Ok'
    //       })
    //       this.loader.hide();
    //       this.getAlluserProcessPiIds();
    //       },err => {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Oops...',
    //           text: 'Something went wrong!',
    //           heightAuto: false,
    //         })
    //         this.loader.hide();         
    //       })
    //   }
    // });
  }

  onDeleteSelectedProcess1(id,status){
    if(status=='Inprogress'){
      this.confirmationService.confirm({
        message: "You can't delete an in-progress process!",
        header: "Info",
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        acceptIcon: 'null',
        rejectVisible: false,
        acceptLabel: "Ok",
        accept: () => {}
      });
      return;
    }
    Swal.fire({
      title: 'Enter Process Id',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      heightAuto: false,
      confirmButtonText: 'Delete',
    }).then((result) => {
      let value:any=result.value
      if(value!=undefined)
      if(id==value){
        let req_body={
          "piId":id
        }
        this.loader.show();
        this.rest.deleteSelectedProcessID(req_body).subscribe(res=>{
          this.getAlluserProcessPiIds();
          this.toastService.showSuccess(this.toastMessages.processDelete,'response'); 
          this.loader.hide();
        },err => {
          this.toastService.showError(this.toastMessages.deleteError);
          this.loader.hide();
          })
      }else{
        this.toastService.showError(this.toastMessages.processIdErr);
      }
    })
  }
  editProcess(obj){
    this.overlay_data={"type":"edit","module":"pi","selectedObj":obj};
    // var modal = document.getElementById('myModal');
    this.hiddenPopUp1=true;
    // modal.style.display="block";
  }
  onChangeValues(){
    this.isTableEnable = false;
    this.dbDetails.tableName = "";
    this.dbDetails.mode = "";
    this.isDisabled=true;
    this.dbDetails.increment='';
    this.dbDetails.timestamp='';
    this.isIncrement=false;
    this.isTimestammp=false;
    this.mytemplateForm.controls["tablename"].markAsUntouched();
    if(this.mytemplateForm.controls["increase"])
    this.mytemplateForm.controls["increase"].markAsUntouched();
    if(this.mytemplateForm.controls["increment"])
    this.mytemplateForm.controls["increment"].markAsUntouched();
    if(this.mytemplateForm.controls["timestamp"])
    this.mytemplateForm.controls["timestamp"].markAsUntouched();
  }
  closeOverlay(event){
    this.hiddenPopUp=false;
    this.hiddenPopUp1=false;
  }

}