import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { PiHints } from '../model/process-intelligence-module-hints';
import { send } from 'q';

@Component({
  selector: 'app-datadocument',
  templateUrl: './datadocument.component.html',
  styleUrls: ['./datadocument.component.css']
})
export class DatadocumentComponent implements OnInit {
  fileData:any=[];
  isValidPiData:boolean = false;
  headerData: any = [];
  header_array:any=['Case_Id','Start_Timestamp','End_Timestamp','Activity','Resource','Role'];
  isDesc: boolean = false;
  selectedRow: any;
  case_id:any;
  step_id:any=1;
  selectedcell: any;
  headerName: any;
  fd:any=[];
  v:any=[];
  vlist:any=[];
  constructor(private router:Router, private dt:DataTransferService, private hints:PiHints) { }

  ngOnInit() {
    this.headerName =this.header_array[0];
    this.step_id = 1;
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule({"route":"/pages/processIntelligence/datadocument", "title":"Data Document"});
    this.dt.changeHints(this.hints.dataDocumentHints);
    this.dt.current_piData.subscribe(res => {
      if(res){
        this.fileData = res;
        this.headerData = res[0];
        this.fileData = this.fileData.slice(1);
      }
    });
  }
  generatepg(){
    this.router.navigate(['/pages/processIntelligence/flowChart']);
  }
  sort(property) {
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
  selectedCell(index,e){
   // console.log(e);
   //let rs = /^[a-zA-Z0-9_ ]*$/;
   var reg_String = new RegExp(/^[a-zA-Z ]*$/);

   var  reg_num_Alphanum = new RegExp("/^(?=.*/d)[a-zA-Z0-9]$/");
   var date = new Date();
    if(e.srcElement.classList.contains("valid")){
      console.log("active class is applied");
     
    }
    else{
      let  header_array_index= this.header_array.indexOf(this.headerName)+1;
      //this.selectedcell = index;
      for(var x = 0;x < this.fileData.length;x++){
        this.fd=this.fileData[x];
        this.v.push(this.fd[index]);
      }
      for(var y = 0;y<this.v.length;y++)
      {
        if(reg_String.test(this.v[y])){
          this.selectedcell = index;
          console.log("blue");
        }
        else{
          e.srcElement.classList.add("invalid");
          console.log("red");
          break;
        }
      }
     
      this.headerData[index]=this.headerName;
      this.headerName=this.header_array[header_array_index];
      this.step_id = this.step_id+1;
      //e.srcElement.classList.add("active");
    }
   
  }
}
