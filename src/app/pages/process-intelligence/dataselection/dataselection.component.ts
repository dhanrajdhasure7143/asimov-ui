import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { PiHints } from '../model/process-intelligence-module-hints';
import { GlobalScript } from '../../../shared/global-script';

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
  headerArray:any=[];
  name:any;

  constructor(private router:Router, 
                private dt:DataTransferService, 
                private hints:PiHints, 
                private global:GlobalScript) { }

  ngOnInit() {
    this.resetColMap();
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule({"route":"/pages/processIntelligence/selection", "title":"Data Selection"});
    this.dt.changeHints(this.hints.dataDocumentHints);
    this.dt.current_piData.subscribe(res => {
      if(res){
        this.fileData = res;
        this.headerData = res[0];
        this.bkp_headerData = res[0];
        this.fileData = this.fileData.slice(1);
      }
    });
  }
  generatepg(){
    var modal = document.getElementById('myModal');
    modal.style.display="block";
    // this.router.navigate(['/pages/processIntelligence/flowChart']);
    }
    generateGraph(){
    this.router.navigate(['/pages/processIntelligence/flowChart']);
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
    this.id.push(v)
    this.selected=v;
    console.log('id',this.id);
    if(this.id.length == 1){
        this.name=v
        obj[this.name]='caseId';
        this.headerArray.push(obj)
        this.headerName = 'caseId';
        // this.global.notify(this.headerName, "success");
        for(var x = 0;x < this.fileData.length;x++){
            if(!this.validCells['row'+x])
              this.validCells['row'+x]=[];
              this.validCells['row'+x].push('cell'+index);
            }
    }else{
        this.name=v
        obj[this.name]=v;
        this.headerArray.push(obj)
      this.headerName = v;
      for(var x = 0;x < this.fileData.length;x++){
        if(!this.validCells['row'+x])
          this.validCells['row'+x]=[];
          this.validCells['row'+x].push('cell'+index);
        }
    }
    console.log('headerArray',this.headerArray);
    
    //   if(!e.srcElement.classList.contains("valid") ){
        // let hdr_ar_index = this.headerData.indexOf(this.headerName);
        // let reg_expression;
        // let isDateCheck:boolean = false;
    //   if(hdr_ar_index == 0){
        // reg_expression = new RegExp(/^\d+$/);
    //   } //alphanum check
        // isDateCheck = hdr_ar_index == 2 || hdr_ar_index == 3;
    //   if(hdr_ar_index == 1 || hdr_ar_index == 4 || hdr_ar_index == 5 ){
    //     reg_expression = new RegExp(/^[a-z\s ,]{0,255}$/i); //string check
    //   }
    //   for(var x = 0;x < this.fileData.length;x++){
    //   if(!this.validCells['row'+x])
    //     this.validCells['row'+x]=[];
       
        // let each_cell = this.fileData[x][index];
    //   if( ( reg_expression && reg_expression.test(each_cell) ) || isDateCheck ){
    //   if(isDateCheck){
    //   try{
    //   formatDate(each_cell, 'dd/MM/yyyy HH:mm:ss', 'en-US');
    //   if(this.validCells['row'+x].indexOf('cell'+index) == -1)
        // this.validCells['row'+x].push('cell'+index);
    //   }catch(e){
    //   }
    //   }else{
    //   if(this.validCells['row'+x].indexOf('cell'+index) == -1)
    //   this.validCells['row'+x].push('cell'+index);
    //   }
    //   }
    //   }
    //   }
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
}
