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
  headerName: any='';
  bkp_headerData;
  searchTerm:string;
  id:any=[];
  public selected:any;
  headerId:any;
  headerArray:any[]=[];
  name:any;
  categoriesList:any=[];
  public categoryName:any;
  public othercategory:any;
  isotherCategory:boolean=false;
  isgenerate:boolean=false;
  cathead1: any;
  cathead2: any;
  cathead3: any;
  cathead4: any;
  cathead5: any;
  cathead6: any;
  headertypeArray:any=[];
  processId:any;
  processName:any;

  constructor(private router:Router, 
                private dt:DataTransferService, 
                private hints:PiHints, 
                private global:GlobalScript,
                private rest:RestApiService) { }

  ngOnInit() {
    this.resetColMap();
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule({"route":"/pages/processIntelligence/selection", "title":"Data Selection"});
    this.dt.changeHints(this.hints.dataDocumentHints);

    var headertype=JSON.parse(localStorage.getItem('headertypeObj'))
    console.log('storage',headertype)
    for(var i=0;i<headertype.length;i++){
      for (let [key, value] of Object.entries(headertype[i])) {
        this.headertypeArray.push(value)
      } 
    }
    console.log(this.headertypeArray);
    this.cathead1=this.headertypeArray[0]
    this.cathead2=this.headertypeArray[1];
    this.cathead3=this.headertypeArray[2];
    this.cathead4=this.headertypeArray[3]
    this.cathead5=this.headertypeArray[4]
    // this.dt.current_piData.subscribe(res => {
    //   if(res){
      var restwo=localStorage.getItem('fileData')
      var res=JSON.parse(restwo)
        this.fileData = res;
        this.headerData = res[0];
        console.log('fileData',this.headerData);
        this.bkp_headerData = res[0];
        this.fileData = this.fileData.slice(1);
    //   }
    // });

    

  }
  generatepg(){
    this.getCategoriesList();
    var modal = document.getElementById('myModal');
    modal.style.display="block";
    // this.router.navigate(['/pages/processIntelligence/flowChart']);
    }
    generateGraph(){
      if(this.categoryName =='other'){
        let otherCategory={
        "categoryId": 0,
        "categoryName": this.othercategory
        }
      this.rest.addCategory(otherCategory).subscribe(res=>{
        console.log('addCategoryResponse',res)   })
    }
    

//             const test=[{"Order ID": "caseId"},
//     {"Start Timestamp": "Start Timestamp"},
//   {"End Timestamp": "End Timestamp"},
// {activity:"activity"},
// {resource:"resource"},]

  var renamesObj=[];
    for(var i=0; i<this.headerArray.length; i++){
      for (let [key, value] of Object.entries(this.headerArray[i])) {
        var obj={}
        // var lowercase=value.toString().charAt(0).toLowerCase() + value.toString().slice(1)
        var lowercase=value
        if(lowercase=='Start Timestamp'){
          lowercase='Start Time'
        }
        if(lowercase=='End Timestamp'){
          lowercase='End Time'
        }
        obj[key]=lowercase.toString().split(' ').join('')
        
        renamesObj.push(obj) 
      }
  }
  let renamestring='';
  console.log("renamesObj",renamesObj);
  for(var k=0;k<renamesObj.length;k++){
    for (let [key, value] of Object.entries(renamesObj[k])) {
      renamestring+=key.trim()+':'+value+',';
      
    }
  }
  renamestring=renamestring.slice(0,-1)
      console.log('keys',renamestring);

  var renamesObjOne=[]
  for(var j=0;j<renamesObj.length;j++){
    for (let [key, value] of Object.entries(renamesObj[j])) {
      renamesObjOne.push(value)
    }  
  }
  // console.log("renamesObjOne",renamesObjOne);
  if(this.categoryName =='other'){
    this.categoryName=this.othercategory
  }
      var date=new Date()
      var tenantId="abc456789"
    const connectorBody={
      //"name": "CsvSchemaSpool-"+tenantId+date.toISOString().split(':').join(''),
       "name": "CsvSchemaSpool-abcdef"+this.processId,
      "config": {
        "connector.class": "com.github.jcustenborder.kafka.connect.spooldir.SpoolDirCsvSourceConnector",
        "input.path": "/var/kafka",
        "input.file.pattern": localStorage.getItem("fileName"),
        "error.path": "/var/kafka",
         "topic": "qpconnector-spooldir-abcdef"+this.processId,
        //"topic": "connector-spooldir-"+tenantId+date.toISOString().split(':').join(''),
        "finished.path": "/var/kafka/data",
        "halt.on.error": "false",
        "csv.first.row.as.header": "true",
        "cleanup.policy": "DELETE",
        "schema.generation.enabled": "true",
        "parser.timestamp.date.formats": "yyyy/MM/dd’ ‘HH:mm:ss.SSSZ",
        "csv.case.sensitive.field.names": "TRUE",
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
        "transforms.TimestampConverter.field": "StartTime,EndTime",
        "transforms.TimestampConverter.target.type": "Timestamp",
        "transforms.TimestampConverter.format": "yyyy/MM/dd HH:mm:ss",
        "transforms.ValueToKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
        "transforms.ValueToKey.fields": "caseID",
        "transforms.InsertField.type": "org.apache.kafka.connect.transforms.InsertField$Value",
        "transforms.InsertField.static.field": "piId",
        "transforms.InsertField.static.value": this.processId,
      }   }
      this.rest.saveConnectorConfig(connectorBody,this.categoryName,this.processId,this.processName).subscribe(res=>{
        // var piId=connectorBody.config["transforms.InsertField.static.value"]
        // localStorage.setItem('piId',this.processId)
        console.log('resp',res);
        //const piid={"piId":this.processId}
        const piid={"piId":411}
            this.router.navigate(['/pages/processIntelligence/flowChart',piid]);
        
      })

    }
  sort(ind,property) {
      console.log('property',ind,property);
      
    this.isDesc = !this.isDesc; //change the direction    
    let direction = this.isDesc ? 1 : -1;
    let index = this.headerData.indexOf(property);
    console.log(index);
    
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
    console.log('log',tr_index, index,e, v);
    this.id.push(v.trim())
    console.log('id',this.id);
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
        console.log(obj);
        this.headerArray.push(obj)
        this.headerName = 'caseID';
        this.selected=v;
        console.log(this.selected)
        // this.global.notify(this.headerName, "success");
        for(var x = 0;x < this.fileData.length;x++){
            if(!this.validCells['row'+x])
              this.validCells['row'+x]=[];
              this.validCells['row'+x].push('cell'+index);
            }
        }else if (result.dismiss === Swal.DismissReason.cancel) {
          this.id=[];
        }
      })

    }else{
      this.headerName = v.trim();
      this.selected=v;
      // if(v=='Start Timestamp'){
      //   v='Start Time'
      // }
      // if(v=='End Timestamp'){
      //   v='End Time'
      // }
      
        this.name=v
        console.log(v +":::::::::::"+this.name)
        obj[this.name]=v;
        console.log(obj);
        this.headerArray.push(obj)
      for(var x = 0;x < this.fileData.length;x++){
        if(!this.validCells['row'+x])
          this.validCells['row'+x]=[];
          this.validCells['row'+x].push('cell'+index);
        }
    }
    console.log('headerArray',this.headerArray);
    if(this.headerArray.length == this.headerData.length){
      this.isgenerate=true;
    }
    else{
      this.isgenerate=false;
    }
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
  closePopup(){
    var modal = document.getElementById('myModal');
    modal.style.display="none";
    }
  
  getCategoriesList(){
    this.rest.getCategoriesList().subscribe(res=>{this.categoriesList=res
    console.log('list',this.categoriesList.data)})
  }

  onchangeCategories(categoryName){
    if(categoryName =='other'){
      this.isotherCategory=true;
    }
  }
  resetcaseId(){
    // var tagDiv=document.getElementsByClassName[0]('select_tag');
    // tagDiv.style.display='none';
    this.validCells = [];
    this.invalidCells = [];
    this.headerArray=[];
    this.id=[];
    this.headerName=''
    this.selected=''
    this.isgenerate=false;
  }

}
