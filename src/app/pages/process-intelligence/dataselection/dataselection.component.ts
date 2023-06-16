import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { PiHints } from '../model/process-intelligence-module-hints';
import { GlobalScript } from '../../../shared/global-script';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { APP_CONFIG } from 'src/app/app.config';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { fromMatPaginator, paginateRows } from './../../business-process/model/datasource-utils';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-dataselection',
  templateUrl: './dataselection.component.html',
  styleUrls: ['./dataselection.component.css']
})
export class DataselectionComponent implements OnInit {
  fileData:any=[];
  validCells:any=[];
  invalidCells:any=[];
  isValidPiData:boolean = false;
  headerData: any = [];
  header_names_array:string[]=['Case_Id','Start_Timestamp','End_Timestamp','Activity','Resource','Role'];
  isDesc: boolean = false;
  selectedRow: any;
  case_id:any;
  step_id:number;
  headerName: any='caseID';
  bkp_headerData;
  searchTerm:string;
  id:any=[];
  public selected:any;
  headerId:any;
  headerArray:any[]=[];
  name:any;
  isgenerate:boolean=false;
  isUploadFileName: any;
  cathead1: any;
  cathead2: any;
  cathead3: any;
  cathead4: any;
  cathead5: any;
  cathead6: any;
  cathead7: any;
  cathead8: any;
  cathead9: any;
  cathead10: any;
  cathead11: any;
  cathead12: any;
  cathead13: any;
  headertypeArray:any=[];
  processId:any;
  p=1;
  isDateformat:any;
  count=0;
  dateformat:any;
  content_no:number=1;
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  overlay_data={}
  hiddenPopUp1:boolean=false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router:Router, 
                private dt:DataTransferService, 
                private hints:PiHints, 
                private global:GlobalScript,
                private rest:RestApiService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                @Inject(APP_CONFIG) private config) {
                
                 }

  ngOnInit() {
    this.resetColMap();
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule({"route":"/pages/processIntelligence/selection", "title":"Data Selection"});
    this.dt.changeHints(this.hints.dataSelectionHints);
    var headertype=JSON.parse(localStorage.getItem('headertypeObj'))
    for(var i=0;i<headertype.length;i++){
      for (let [key, value] of Object.entries(headertype[i])) {
        this.headertypeArray.push(value)
      } 
    }
    this.cathead1=this.headertypeArray[0]
    this.cathead2=this.headertypeArray[1];
    this.cathead3=this.headertypeArray[2];
    this.cathead4=this.headertypeArray[3];
    this.cathead5=this.headertypeArray[4];
    this.cathead6=this.headertypeArray[5];
    this.cathead7=this.headertypeArray[6];
    this.cathead8=this.headertypeArray[7];
    this.cathead9=this.headertypeArray[8];
    this.cathead10=this.headertypeArray[9];
    this.cathead11=this.headertypeArray[10];
    this.cathead12=this.headertypeArray[11];
      let restwo;
      this.dt.current_piData.subscribe(response => { restwo = response })
      var res=restwo;
        this.fileData = res;
        this.headerData = res[0];
        this.bkp_headerData = res[0];
        this.fileData = this.fileData.slice(1);
      setTimeout(() => {
        this.assignPagenation(this.fileData)
      }, 500);
  }

  getDataTypeChange(a,b){

  }

  slideUp(){    //Open bottom overlay for Enter process name and generate graph
    this.overlay_data={"type":"create","module":"pi"};
    // var modal = document.getElementById('myModal');
    // modal.style.display="block";
    this.hiddenPopUp1 = true;
  }
  
  generateGraph(e){   //Generate process graph for csv and xls
    this.processId = Math.floor(100000 + Math.random() * 900000);
    var renamesObj=[];
    for(var i=0; i<this.headerArray.length; i++){
      for (let [key, value] of Object.entries(this.headerArray[i])) {
        var obj={}
        var lowercase=value
        if(lowercase=='Start Timestamp' || lowercase=='Start Time'){
          lowercase='start Time'
        }
        if(lowercase=='End Timestamp' || lowercase=='End Time' || lowercase=='Complete Timestamp' || lowercase=='Complete Time'){
          lowercase='end Time'
        }
        if(lowercase=='Operation' || lowercase=='Activity' || lowercase=='Actvity'){
          lowercase='activity'
        }
        if(lowercase=='Agent' || lowercase=='Resource' || lowercase =='Assigned To'){
          lowercase='resource'
        }
        obj[key]=lowercase.toString().split(' ').join('')
        renamesObj.push(obj) ;
      }
    }
  let renamestring='';
  for(var k=0;k<renamesObj.length;k++){
    for (let [key, value] of Object.entries(renamesObj[k])) {
      if(key != 'S.No'){
      renamestring+=key.trim()+':'+value+',';
      }
      
    }
  }
  renamestring=renamestring.slice(0,-1)

  var renamesObjOne=[]
  for(var j=0;j<renamesObj.length;j++){
    for (let [key, value] of Object.entries(renamesObj[j])) {
      if(key != 'S.No'){
      renamesObjOne.push(value)
      }
    }  
  }
      var date=new Date()
      var tenantId="abc456789"
  this.rest.fileName.subscribe(res => {
    this.isUploadFileName = res;
  });
  if(this.isUploadFileName.includes("csv")){
    const connectorBody ={
      "name": "CsvSchemaSpool-" + this.processId,
        "config": {
        "connector.class": "com.github.jcustenborder.kafka.connect.spooldir.SpoolDirCsvSourceConnector",
        "input.path": this.config.dataPath,
        "input.file.pattern": this.isUploadFileName,
        "error.path": this.config.dataPath,
        "topic": this.config.piConnector + "connector-spooldir-" + this.processId,
        "finished.path": this.config.dataPath + "/data",
        "halt.on.error": "false",
        "csv.first.row.as.header": "true",
        "cleanup.policy": "DELETE",
        "schema.generation.enabled": "true",
        "parser.timestamp.date.formats": "yyyy/MM/dd’ ‘HH:mm:ss.SSSZ",
        "csv.case.sensitive.field.names": "true",
        "parser.timestamp.timezone": "UTC",
        "key.converter": "io.confluent.connect.avro.AvroConverter",
        "key.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
        "value.converter": "io.confluent.connect.avro.AvroConverter",
        "value.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
        "transforms": "RenameField,ReplaceField,ValueToKey,InsertField,convert_startTime_unix,convert_startTime_string,convert_endTime_unix,convert_endTime_string"
        ,
        "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
        "transforms.RenameField.renames": renamestring,
        "transforms.ReplaceField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
        "transforms.ReplaceField.whitelist": renamesObjOne.join(),
        "transforms.ValueToKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
        "transforms.ValueToKey.fields": "caseID",
        "transforms.InsertField.type": "org.apache.kafka.connect.transforms.InsertField$Value",
        "transforms.InsertField.static.field": "piIdName",
        "transforms.InsertField.static.value": this.processId + "-p" + this.processId,
        "transforms.convert_startTime_unix.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
        "transforms.convert_startTime_unix.field": "startTime",
        "transforms.convert_startTime_unix.target.type": "unix",
        "transforms.convert_startTime_unix.format": this.isDateformat,
        "transforms.convert_startTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
        "transforms.convert_startTime_string.field": "startTime",
        "transforms.convert_startTime_string.target.type": "string",
        "transforms.convert_startTime_string.format": "MM/dd/yyyy HH:mm:ss",
        "transforms.convert_endTime_unix.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
        "transforms.convert_endTime_unix.field": "endTime",
        "transforms.convert_endTime_unix.target.type": "unix",
        "transforms.convert_endTime_unix.format":this.isDateformat,
        "transforms.convert_endTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
        "transforms.convert_endTime_string.field": "endTime",
        "transforms.convert_endTime_string.target.type": "string",
        "transforms.convert_endTime_string.format": "MM/dd/yyyy HH:mm:ss"
        }
      }

      this.rest.saveConnectorConfig(connectorBody,e.categoryName,this.processId,e.processName).subscribe(res=>{
            this.router.navigate(['/pages/processIntelligence/flowChart'],{queryParams:{piId:this.processId}});
      },err=>{
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Oops! Internal server error. Please try again later."
        });
        // Swal.fire("Error", "Internal server error, Please try again later", "error");
      })
    }else{
          const xlsxConnectorBody={
            "name": "xls-"+this.processId,
            "config": {
              "connector.class": "com.epsoft.asimov.connector.xlsx.XlsxConnector",
              "tasks.max": "1",
              "file": this.config.dataPath+"/"+this.isUploadFileName,
              "topic": this.config.piConnector+"connector-xls-"+this.processId,
              "key.converter": "io.confluent.connect.avro.AvroConverter",
              "key.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
              "value.converter": "io.confluent.connect.avro.AvroConverter",
              "value.converter.schema.registry.url": this.config.schemaRegistryEndPoint,
              "transforms": "RenameField,ReplaceField,convert_startTime_unix,convert_startTime_string,convert_endTime_unix,convert_endTime_string,InsertField,ValueToKey",
              "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
              "transforms.RenameField.renames": renamestring,
              "transforms.convert_startTime_unix.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
              "transforms.convert_startTime_unix.field": "startTime",
              "transforms.convert_startTime_unix.target.type": "unix",
              "parseDateFormat": this.isDateformat,
              "transforms.convert_startTime_unix.format": this.isDateformat,
              "transforms.ReplaceField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
              "transforms.ReplaceField.whitelist":renamesObjOne.join(),
              "transforms.convert_startTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
              "transforms.convert_startTime_string.field": "startTime",
              "transforms.convert_startTime_string.target.type": "string",
              "transforms.convert_startTime_string.format": "MM/dd/yyyy HH:mm:ss",
              "transforms.ValueToKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
              "transforms.ValueToKey.fields": "caseID",
              "transforms.InsertField.type": "org.apache.kafka.connect.transforms.InsertField$Value",
              "transforms.InsertField.static.field": "piIdName",
              "transforms.InsertField.static.value":this.processId+"-p"+this.processId,
              "transforms.convert_endTime_unix.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
              "transforms.convert_endTime_unix.field": "endTime",
              "transforms.convert_endTime_unix.target.type": "unix",
              "transforms.convert_endTime_unix.format":this.isDateformat,
              "transforms.convert_endTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
              "transforms.convert_endTime_string.field": "endTime",
              "transforms.convert_endTime_string.target.type": "string",
              "transforms.convert_endTime_string.format": "MM/dd/yyyy HH:mm:ss"
            }
          }
        this.rest.saveConnectorConfig(xlsxConnectorBody,e.categoryName,this.processId,e.processName).subscribe(res=>{
              this.router.navigate(['/pages/processIntelligence/flowChart'],{queryParams:{piId:this.processId}});
        },err=>{
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Oops! Internal server error. Please try again later."
          });
        // Swal.fire("Error", "Internal server error, Please try again later", "error");
        })
    }
  }

  sort(ind,property) {    //Sort table data
    this.isDesc = !this.isDesc; //change the direction    
    let direction = this.isDesc ? 1 : -1;
    let index = this.headerData.indexOf(property);
    
    return this.checkNsort(direction, index);
  }

  checkNsort(direction, index){
    this.fileData.sort(function (a, b) {
      let value = 0;
      if (a[index] < b[index]) {
        value = -1 * direction;
      }
      if (a[index] > b[index]) {
        value = 1 * direction;
      }
      return value;
    });
  }

  loopTrackBy(index, term){
    return index;
  }

  selectedCell(tr_index, index,e, v,row){       //case id selection mapping
    let obj={}
      this.name=''
      if(v=='S.No' || index==0){
        for(var x = 0;x < this.fileData.length;x++){
          if(!this.validCells['row'+x])
            this.validCells['row'+x]=[];
            this.validCells['row'+x].push('cell'+index);
          }
        return;
      }else{
    this.id.push(v.trim())
    if(this.id.length == 0){
      this.headerName=''
    }
    else if(this.id.length == 1){
      if(v.includes('Time')){
        this.confirmationService.confirm({
          message: "The Case ID cannot be a timestamp.",
          header: "Info",         
          rejectVisible: false,
          acceptLabel: "Ok",
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          acceptIcon: 'null',
          accept: () => {}
        });

        // Swal.fire("Oops!", "Case ID canot be Timestamp", "warning");
        this.id=[];
      }else{
        this.confirmationService.confirm({
          message: "Do you want to use this as the Case ID?",
          header: "Are you sure?",            
          rejectLabel: "No",
          acceptLabel: "Yes",
          rejectButtonStyleClass: 'btn reset-btn',
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          rejectIcon: 'null',
          acceptIcon: 'null',
          accept: () => {
            this.name=v.trim();
            this.step_id=1
            obj[this.name]='caseID';
            this.headerArray.push(obj)
            this.headerName = 'caseID';
            this.selected=v;
            this.content_no +=1;
            for(var x = 0;x < this.fileData.length;x++){
              if(!this.validCells['row'+x])
                this.validCells['row'+x]=[];
                this.validCells['row'+x].push('cell'+index);
            }            
          },
          reject: () => {
            this.id=[];
            this.validCells = [];
            this.invalidCells = [];
            this.headerArray=[];
          }
        });

      // Swal.fire({
      //   title: 'Confirmation?',
      //   text: "Are you sure want to use this as caseID!",
      //   icon: 'warning',
      //   showCancelButton: true,
      //   customClass: {
      //     confirmButton: 'btn bluebg-button',
      //     cancelButton:  'btn new-cancelbtn',
      //   },
      //   confirmButtonText: 'Yes',
      //   allowOutsideClick:false
      // }).then((result) => {
      //   if (result.value) {
      //     this.name=v.trim();
      //     this.step_id=1
      //   obj[this.name]='caseID';
      //   this.headerArray.push(obj)
      //   this.headerName = 'caseID';
      //   this.selected=v;
      //   this.content_no +=1;
      //   for(var x = 0;x < this.fileData.length;x++){
      //       if(!this.validCells['row'+x])
      //         this.validCells['row'+x]=[];
      //         this.validCells['row'+x].push('cell'+index);
      //       }
      //   }else if (result.dismiss === Swal.DismissReason.cancel){
      //     this.id=[];
      //     this.validCells = [];
      //     this.invalidCells = [];
      //     this.headerArray=[];
      //   }
      // })
    }
    }else if(this.id.length == 2){
      if(v.includes('Time')){
        
        this.confirmationService.confirm({
          message: "The Activity must be a string!",
          header: "Info",
          rejectVisible: false,
          acceptLabel: "Ok",
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          acceptIcon: 'null',
          accept: () => {}
        });

        // Swal.fire("Oops!", "Activity must be string!", "warning");
        this.id.pop();
        
      }else{
      this.selected=v;
      this.headerName='Activity';
      this.name=v;
      this.step_id = this.step_id + 1;
      obj[this.name]=v;
    this.headerArray.push(obj)
      for(var x = 0;x < this.fileData.length;x++){
        if(!this.validCells['row'+x])
          this.validCells['row'+x]=[];
          this.validCells['row'+x].push('cell'+index);
        }
        this.content_no +=1;
      }
    }
    else{
      this.headerName = v.trim();
      this.selected=v;
      this.step_id = this.step_id + 1;      
        this.name=v
        obj[this.name]=v;
      this.headerArray.push(obj)
      for(var x = 0;x < this.fileData.length;x++){
        if(!this.validCells['row'+x])
          this.validCells['row'+x]=[];
          this.validCells['row'+x].push('cell'+index);
        }
        this.content_no +=1;
    }
      if(this.step_id == this.headerData.length-1){
        this.isgenerate=true;
      }
      else{
        this.isgenerate=false;
      }
    } 
  }

  resetColMap(){  //reset data mapping
    this.step_id = 0;
    this.content_no =1;
    this.validCells = [];
    this.invalidCells = [];
    this.isValidPiData = false;
  }

  searchTable(){    // Search value in table
    let _self = this;
    this.fileData = this.fileData.filter(each_row => {
      each_row.forEach(each_cell => {
        return each_cell.indexOf(_self.searchTerm)>-1;
      })
    })
  }  

  resetcaseId(){  //reset case id selection
    this.step_id = 0;
    this.content_no =1;
    this.validCells = [];
    this.invalidCells = [];
    this.headerArray=[];
    this.id=[];
    this.headerName='caseID'
    this.selected=''
    this.isgenerate=false;
  }

  getCaseName(name){
      if(name.indexOf('Timestamp') != -1 || name.indexOf('Time') != -1){
        return 'Timestamp';
    } else {
      return name;
    }
  }
  
  getDateFormat(value,headername){
    if(headername.indexOf('Time')!=-1 ||headername.indexOf('Timestamp')!=-1){
      this.findDatePattern(value);
      return value
    }else{    
      return value;
    }
  }

  findDatePattern(dateInput){   //Find the max repated date formate for uploaded file    
    var splitDate;
    var yearformat;
    var timeOne;
    var OnlyDate=dateInput.split(' ',1)
    if(OnlyDate[0].includes('-')){
      splitDate=dateInput.split('-')
          if(splitDate[0].length==4){
            var splitDate1=splitDate[2].split(' ',1)
              yearformat="yyyy";
                if(splitDate[1]==12 && splitDate1[0]==12){
                      // this.dateformat=' ';
                }else if(splitDate[1]<12 && splitDate1[0]<12){
                  // this.dateformat='';
                }else if(splitDate[1]>12 && splitDate1[0]<12){
                      this.dateformat='dd-MM';
                }else if(splitDate[1]<12 && splitDate1[0]>12){
                      this.dateformat='MM-dd';
                }else if(splitDate[1]==12 && splitDate1[0]>12){
                      this.dateformat='MM-dd';
                }else if(splitDate[1]>12 && splitDate1[0]==12){
                      this.dateformat='dd-MM';
                }
                if(this.dateformat == undefined){
                  this.dateformat = 'dd-MM'
                }
              var fullDateFormat=yearformat+'-'+this.dateformat      
            }else{
                if(splitDate[0]==12 && splitDate[1]==12){
                      // this.dateformat=' ';
                }else if(splitDate[0]<12 && splitDate[1]<12){
                      // this.dateformat=' ';
                }else if(splitDate[0]>12 && splitDate[1]<12){
                      this.dateformat='dd-MM'
                }else if(splitDate[0]<12 && splitDate[1]>12){
                      this.dateformat='MM-dd'
                }else if(splitDate[0]==12 && splitDate[1]>12){
                      this.dateformat='MM-dd'
                }else if(splitDate[0]>12 && splitDate[1]==12){
                      this.dateformat='dd-MM';
                }
                var splitYear=splitDate[2].split(' ',1)
                    if(splitYear[0].length==4){
                      yearformat='yyyy'
                    }else{
                      yearformat='yy'
                    }
                    if(this.dateformat == undefined){
                      this.dateformat = 'dd-MM'
                    }
                var fullDateFormat=this.dateformat+'-'+yearformat
                }
    }else if(OnlyDate[0].includes('.')){
      splitDate=dateInput.split('.')
      if(splitDate[0].length==4){
        var splitDate1=splitDate[2].split(' ',1)
          yearformat="yyyy";
            if(splitDate[1]==12 && splitDate1[0]==12){
                  // this.dateformat=' ';
            }else if(splitDate[1]<12 && splitDate1[0]<12){
                  // this.dateformat=' ';
            }else if(splitDate[1]>12 && splitDate1[0]<12){
                  this.dateformat='dd.MM';
            }else if(splitDate[1]<12 && splitDate1[0]>12){
                  this.dateformat='MM.dd';
            }else if(splitDate[1]==12 && splitDate1[0]>12){
                  this.dateformat='MM.dd';
            }else if(splitDate[1]>12 && splitDate1[0]==12){
                  this.dateformat='dd.MM';
            }
            if(this.dateformat == undefined){
              this.dateformat = 'dd.MM'
            }
          var fullDateFormat=yearformat+'.'+this.dateformat      
        }else{
            if(splitDate[0]==12 && splitDate[1]==12){
                  // this.dateformat=' ';
            }else if(splitDate[0]<12 && splitDate[1]<12){
                  // this.dateformat=' ';
            }else if(splitDate[0]>12 && splitDate[1]<12){
                  this.dateformat='dd.MM'
            }else if(splitDate[0]<12 && splitDate[1]>12){
                  this.dateformat='MM.dd'
            }else if(splitDate[0]==12 && splitDate[1]>12){
                  this.dateformat='MM.dd'
            }else if(splitDate[0]>12 && splitDate[1]==12){
                  this.dateformat='dd.MM';
            }
            var splitYear=splitDate[2].split(' ',1)
                if(splitYear[0].length==4){
                  yearformat='yyyy'
                }else{
                  yearformat='yy'
                }
                if(this.dateformat == undefined){
                  this.dateformat = 'dd.MM'
                }
            var fullDateFormat=this.dateformat+'.'+yearformat
            }
    }else if(OnlyDate[0].includes('/')){
      splitDate=dateInput.split('/')
      if(splitDate[0].length==4){
      var splitDate1=splitDate[2].split(' ',1)

              yearformat="yyyy";
                if(splitDate[1]==12 && splitDate1[0]==12){
                      // dateformat='MM/dd';
                }else if(splitDate[1]<12 && splitDate1[0]<12){
                      // dateformat='MM/dd';
                }else if(splitDate[1]>12 && splitDate1[0]<12){
                      this.dateformat='dd/MM';
                }else if(splitDate[1]<12 && splitDate1[0]>12){
                      this.dateformat='MM/dd';
                }else if(splitDate[1]==12 && splitDate1[0]>12){
                      this.dateformat='MM/dd';
                }else if(splitDate[1]>12 && splitDate1[0]==12){
                      this.dateformat='dd/MM';
                }
                if(this.dateformat == undefined){
                  this.dateformat = 'dd/MM'
                }
              var fullDateFormat=yearformat+'/'+this.dateformat      
            }else{
                if(splitDate[0]==12 && splitDate[1]==12){
                      // this.dateformat=' ';
                }else if(splitDate[0]<12 && splitDate[1]<12){
                      // this.dateformat=' ';
                }else if(splitDate[0]>12 && splitDate[1]<12){
                      this.dateformat='dd/MM'
                }else if(splitDate[0]<12 && splitDate[1]>12){
                      this.dateformat='MM/dd'
                }else if(splitDate[0]==12 && splitDate[1]>12){
                      this.dateformat='MM/dd'
                }else if(splitDate[0]>12 && splitDate[1]==12){
                      this.dateformat='dd/MM';
                }
                var splitYear=splitDate[2].split(' ',1)
                    if(splitYear[0].length==4){
                      yearformat='yyyy'
                    }else{
                      yearformat='yyyy'
                    }
                    if(this.dateformat == undefined){
                      this.dateformat = 'dd/MM'
                    }
                var fullDateFormat=this.dateformat+'/'+yearformat
                  }
    } 

    // for time format
    var timedivide=splitDate[2].split(' ')
    var timedivide1=timedivide[1].split(':')
    var time;
    if(timedivide.includes('AM')){
        
        if(timedivide1.length==2){
              time="hh:mm AM";
        }else if(timedivide1.length==3){
          if(timedivide1[2].includes('.')){
            time="hh:mm:ss.SSS AM";
          }else{
            time="hh:mm:ss AM";
          }
        }
    }else if(timedivide.includes('PM')){
      if(timedivide1.length==2){
            time="hh:mm PM";
      }else if(timedivide1.length==3){
        if(timedivide1[2].includes('.')){
          time="hh:mm:ss.SSS PM";
        }else{
          time="hh:mm:ss PM";
        }
      }
  }else{
    this.count++
      if(timedivide1.length==2){
          timeOne="HH:mm";
      }else if(timedivide1.length==3){
          if(timedivide1[2].includes('.')){
            timeOne="HH:mm:ss.SSS";
          }else{
            timeOne="HH:mm:ss";
          }
      }
    }
    if(this.count>=1){
      var timeFormat =timeOne;
    }else{
      timeFormat =time;
    }
    var inputDateformat=fullDateFormat+' '+timeFormat
       this.isDateformat=inputDateformat
  }
  assignPagenation(data){
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(paginateRows(pageEvents$));
  }

  closeOverlay(event){
    this.hiddenPopUp1 = event;
  }

}
