import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { PiHints } from '../model/process-intelligence-module-hints';
import { GlobalScript } from '../../../shared/global-script';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';

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
  // categoriesList:any=[];
  // public categoryName:any;
  // public othercategory:any;
  // isotherCategory:boolean=false;
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
  // processName:any;
  p=1;
  // processName:any;
  isDateformat:any;
  count=0;
  dateformat:any;

  constructor(private router:Router, 
                private dt:DataTransferService, 
                private hints:PiHints, 
                private global:GlobalScript,
                private rest:RestApiService) {
                
                 }

  ngOnInit() {
    this.resetColMap();
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule({"route":"/pages/processIntelligence/selection", "title":"Data Selection"});
    this.dt.changeHints(this.hints.dataDocumentHints);

    var headertype=JSON.parse(localStorage.getItem('headertypeObj'))
    // console.log('storage',headertype)
    for(var i=0;i<headertype.length;i++){
      for (let [key, value] of Object.entries(headertype[i])) {
        this.headertypeArray.push(value)
      } 
    }
    //  console.log(this.headertypeArray);
    this.cathead1=this.headertypeArray[0]
    this.cathead2=this.headertypeArray[1];
    this.cathead3=this.headertypeArray[2];
    this.cathead4=this.headertypeArray[3];
    this.cathead5=this.headertypeArray[4];
    this.cathead6=this.headertypeArray[5];
    // console.log(this.cathead6);
    this.cathead7=this.headertypeArray[6];
    this.cathead8=this.headertypeArray[7];
    this.cathead9=this.headertypeArray[8];
    this.cathead10=this.headertypeArray[9];
    this.cathead11=this.headertypeArray[10];
    this.cathead12=this.headertypeArray[11];
    // this.dt.current_piData.subscribe(res => {
    //   if(res){
      var restwo=localStorage.getItem('fileData')
      var res=JSON.parse(restwo)
        this.fileData = res;
        this.headerData = res[0];
        // console.log('fileData',this.fileData);
        this.bkp_headerData = res[0];
        this.fileData = this.fileData.slice(1);
    //   }
    // });

    

  }

  getDataTypeChange(a,b){

  }

  slideUp(){
    var modal = document.getElementById('myModal');
    modal.style.display="block";
    // this.router.navigate(['/pages/processIntelligence/flowChart']);
    }
    generateGraph(e){
//             const test=[{"Order ID": "caseId"},
//     {"Start Timestamp": "Start Timestamp"},
//   {"End Timestamp": "End Timestamp"},
// {activity:"activity"},
// {resource:"resource"},]
this.processId = Math.floor(100000 + Math.random() * 900000);
  var renamesObj=[];
    for(var i=0; i<this.headerArray.length; i++){
      for (let [key, value] of Object.entries(this.headerArray[i])) {
        var obj={}
        // var lowercase=value.toString().charAt(0).toLowerCase() + value.toString().slice(1)
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
        if(lowercase=='Agent' || lowercase=='Resource'){
          lowercase='resource'
        }
        obj[key]=lowercase.toString().split(' ').join('')
        
        renamesObj.push(obj) ;
    
        

      }
      // console.log("renamesObj",renamesObj);
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
      // console.log('keys',renamestring);

  var renamesObjOne=[]
  for(var j=0;j<renamesObj.length;j++){
    for (let [key, value] of Object.entries(renamesObj[j])) {
      if(key != 'S.No'){
      renamesObjOne.push(value)
      }
    }  
  }
  // console.log("renamesObjOne",renamesObjOne);
      var date=new Date()
      var tenantId="abc456789"
  this.rest.fileName.subscribe(res => {
    // console.log(res);
    this.isUploadFileName = res;
  });
  if(this.isUploadFileName.includes("csv")){
    const connectorBody={
      //"name": "CsvSchemaSpool-"+tenantId+date.toISOString().split(':').join(''),
       "name": "CsvSchemaSpool-"+this.processId,
      "config": {
        "connector.class": "com.github.jcustenborder.kafka.connect.spooldir.SpoolDirCsvSourceConnector",
        "input.path": "/var/kafka",
        "input.file.pattern": this.isUploadFileName,
        "error.path": "/var/kafka",
        //  "topic": "tytyconnector-spooldir-"+this.processId,
         "topic": "topqconnector-spooldir-"+this.processId,
        //"topic": "connector-spooldir-"+tenantId+date.toISOString().split(':').join(''),
        "finished.path": "/var/kafka/data",
        "halt.on.error": "false",
        "csv.first.row.as.header": "true",
        "cleanup.policy": "DELETE",
        "schema.generation.enabled": "true",
        "parser.timestamp.date.formats": "yyyy/MM/dd’ ‘HH:mm:ss.SSSZ",
        "csv.case.sensitive.field.names": "true",
        "parser.timestamp.timezone": "UTC",
        "key.converter":"io.confluent.connect.avro.AvroConverter",
        "key.converter.schema.registry.url":"http://10.11.0.101:8081",
        "value.converter":"io.confluent.connect.avro.AvroConverter",
        "value.converter.schema.registry.url":"http://10.11.0.101:8081",
        "transforms": "RenameField,ReplaceField,TimestampConverter,ValueToKey,InsertField",
        "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
        // "transforms.RenameField.renames": "Start Time:startTime,End Time:endTime,Operation:activity,Agent:resource,CaseID:caseID",
        "transforms.RenameField.renames": renamestring,
        "transforms.ReplaceField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
        "transforms.ReplaceField.whitelist": renamesObjOne.join(),
        "transforms.TimestampConverter.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
        "transforms.TimestampConverter.field": "startTime,endTime",
        "transforms.TimestampConverter.target.type": "Timestamp",
        "transforms.TimestampConverter.format": "yyyy/MM/dd HH:mm:ss",
        "transforms.ValueToKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
        "transforms.ValueToKey.fields": "caseID",
        "transforms.InsertField.type": "org.apache.kafka.connect.transforms.InsertField$Value",
        "transforms.InsertField.static.field": "piIdName",
        "transforms.InsertField.static.value": this.processId+"-p"+this.processId
      }   }
     
      this.rest.saveConnectorConfig(connectorBody,e.categoryName,this.processId,e.processName).subscribe(res=>{
        // var piId=connectorBody.config["transforms.InsertField.static.value"]
        // localStorage.setItem('piId',this.processId)
        // const piid={"piId":this.processId}
        //const piid={"piId":411}
            this.router.navigate(['/pages/processIntelligence/flowChart'],{queryParams:{piId:this.processId}});
      })
    }else{
      console.log("isDateformat",this.isDateformat);
      const xlsxConnectorBody={
      "name": "xls-"+this.processId,
      "config": {
        "connector.class": "com.epsoft.asimov.connector.xlsx.XlsxConnector",
        "tasks.max": "1",
        "file": "/var/kafka/"+this.isUploadFileName,
        "topic": "topqconnector-xls-"+this.processId,
        "key.converter": "io.confluent.connect.avro.AvroConverter",
        "key.converter.schema.registry.url": "http://10.11.0.101:8081",
        "value.converter": "io.confluent.connect.avro.AvroConverter",
        "value.converter.schema.registry.url": "http://10.11.0.101:8081",
        "transforms": "RenameField,ReplaceField,convert_startTime_unix,convert_startTime_string,convert_endTime_unix,convert_endTime_string,InsertField,ValueToKey",
        "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
        // "transforms.RenameField.renames": "Start Time:startTime,End Time:endTime,Operation:activity,Agent:resource,caseID:caseID",
        "transforms.RenameField.renames": renamestring,
        "transforms.convert_startTime_unix.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
        "transforms.convert_startTime_unix.field": "startTime",
        "transforms.convert_startTime_unix.target.type": "unix",
        "transforms.convert_startTime_unix.format": this.isDateformat,
        // "transforms.convert_startTime_unix.format": "dd.MM.yyyy HH:mm",
        "transforms.ReplaceField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
        // "transforms.ReplaceField.whitelist": "caseID,activity,startTime,endTime,resource",
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
        // "transforms.convert_endTime_unix.format":"dd.MM.yyyy HH:mm",
        "transforms.convert_endTime_unix.format":this.isDateformat,
        "transforms.convert_endTime_string.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
        "transforms.convert_endTime_string.field": "endTime",
        "transforms.convert_endTime_string.target.type": "string",
        "transforms.convert_endTime_string.format": "MM/dd/yyyy HH:mm:ss"
      }
    }
        this.rest.saveConnectorConfig(xlsxConnectorBody,e.categoryName,this.processId,e.processName).subscribe(res=>{
              this.router.navigate(['/pages/processIntelligence/flowChart'],{queryParams:{piId:this.processId}});
        })

    }

    }

  sort(ind,property) {
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
  selectedCell(tr_index, index,e, v,row){
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
    // console.log('log',tr_index, index,e, v);
    this.id.push(v.trim())
    // console.log('id',this.id);
    if(this.id.length == 0){
      this.headerName=''
    }
    else if(this.id.length == 1){
      Swal.fire({
        title: 'Confirmation?',
        text: "Are you sure want to use this as CASE ID!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        allowOutsideClick:false
      }).then((result) => {
        if (result.value) {
          this.name=v.trim();
        obj[this.name]='caseID';
        // console.log(obj);
        this.headerArray.push(obj)
        this.headerName = 'caseID';
        this.selected=v;
      // this.step_id = this.step_id + 1;
        // console.log(this.selected)
        // this.global.notify(this.headerName, "success");
        for(var x = 0;x < this.fileData.length;x++){
            if(!this.validCells['row'+x])
              this.validCells['row'+x]=[];
              this.validCells['row'+x].push('cell'+index);
            }
        }else if (result.dismiss === Swal.DismissReason.cancel){
          this.id=[];
        }
      })

    }else if(this.id.length == 2){
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
    }
    else{
      this.headerName = v.trim();
      this.selected=v;
      this.step_id = this.step_id + 1;
      // if(v=='Start Timestamp'){
      //   v='Start Time'
      // }
      // if(v=='End Timestamp'){
      //   v='End Time'
      // }
      
        this.name=v
        // console.log(v +":::::::::::"+this.name)
        obj[this.name]=v;
        // console.log(obj);
      this.headerArray.push(obj)
      for(var x = 0;x < this.fileData.length;x++){
        if(!this.validCells['row'+x])
          this.validCells['row'+x]=[];
          this.validCells['row'+x].push('cell'+index);
        }
    }

    if(this.step_id == this.headerData.length-1){
      this.isgenerate=true;
    }
    else{
      this.isgenerate=false;
    }
  }
  // console.log("id",this.id);
 
  
    }

  resetColMap(){
    // this.headerName = this.header_names_array[0];
    this.step_id = 1;
    this.validCells = [];
    this.invalidCells = [];
    this.isValidPiData = false;
  }

  searchTable(){
    let _self = this;
    this.fileData = this.fileData.filter(each_row => {
      each_row.forEach(each_cell => {
        return each_cell.indexOf(_self.searchTerm)>-1;
      })
    })
  }  
  resetcaseId(){
    // var tagDiv=document.getElementsByClassName[0]('select_tag');
    // tagDiv.style.display='none';
    this.step_id = 1;
    this.validCells = [];
    this.invalidCells = [];
    this.headerArray=[];
    this.id=[];
    this.headerName='caseID'
    this.selected=''
    this.isgenerate=false;
  }

  getCaseName(name, stp){
   
      if(name.indexOf('Timestamp') != -1 || name.indexOf('Time') != -1){
        return 'Timestamp';
    } else {
      return name;
    }
  }
  getDateFormat(value,headername){
    // console.log(value,headername);
    if(headername.indexOf('Time')!=-1 ||headername.indexOf('Timestamp')!=-1){
      this.findDatePattern(value);
      return value
    }else{
      
      // this.findDatePattern(value);
      return value;
    }
  }

  findDatePattern(dateInput){
    // console.log(dateInput);
    
    var splitDate;
    // var dateformat;
    var yearformat;
    var timeOne;
    var OnlyDate=dateInput.split(' ',1)
    
    // var dateInput = ["04-04-2020 04:31:10.000 PM","12-12-2222 04:31:10.000 PM","11-22-2222 04:31:10.000 PM"];
    // var dateInput = "12.02.2011 04:31:10 AM";
    // var dateInput = "02/02/20 04:31:10 PM";
    if(OnlyDate[0].includes('-')){
      splitDate=dateInput.split('-')
          if(splitDate[0].length==4){
            var splitDate1=splitDate[2].split(' ',1)
            // console.log("splitDate",splitDate);
            // console.log("splitDate1",splitDate1);
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
                var fullDateFormat=this.dateformat+'-'+yearformat
                }
    }else if(OnlyDate[0].includes('.')){
      // splitDate=dateInput.split('.')
      splitDate=dateInput.split('.')
      if(splitDate[0].length==4){
        var splitDate1=splitDate[2].split(' ',1)
        // console.log("splitDate",splitDate);
        // console.log("splitDate1",splitDate1);
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
            var fullDateFormat=this.dateformat+'.'+yearformat
            }
    }else if(OnlyDate[0].includes('/')){
      // splitDate=dateInput.split('/')
      splitDate=dateInput.split('/')
      if(splitDate[0].length==4){
      var splitDate1=splitDate[2].split(' ',1)
            // console.log("splitDate",splitDate);
            // console.log("splitDate1",splitDate1);
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

                // if(dateformat!=' '){
                //   var dateformat1=dateformat
                // }
                
                // console.log("dateformat",dateformat);
              // var fullDateFormat=yearformat+'/'+dateformat      
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
                var fullDateFormat=this.dateformat+'/'+yearformat
                  }
    } 

    // console.log("splitDate",splitDate);
    // for time format
    var timedivide=splitDate[2].split(' ')
    var timedivide1=timedivide[1].split(':')
    var time;
    // console.log("timedivide1",timedivide1);
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
    // console.log("this.count",this.count)
    if(this.count>=1){
      var timeFormat =timeOne;
    }else{
      timeFormat =time;
    }

    var inputDateformat=fullDateFormat+' '+timeFormat
    // console.log(OnlyDate[0]);
    
    // if(OnlyDate[0].includes('/')){
      // this.isDateformat="yyyy/dd/MM HH:mm:ss.SSS"
    // }else{
      // this.isDateformat="dd.MM.yy HH:mm"
    // }
    // this.isDateformat="dd.MM.yy HH:mm"
    this.isDateformat="yyyy/MM/dd HH:mm:ss"
      // this.isDateformat=inputDateformat
      
    
    // console.log("inputDateformat",inputDateformat);
  }

}
