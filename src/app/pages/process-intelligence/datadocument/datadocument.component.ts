import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";

@Component({
  selector: 'app-datadocument',
  templateUrl: './datadocument.component.html',
  styleUrls: ['./datadocument.component.css']
})
export class DatadocumentComponent implements OnInit {
  fileData:any=[];
  isValidPiData:boolean = false;
  hints:any[];
  headerData: any = [];
  isDesc: boolean = false;

  constructor(private router:Router, private dt:DataTransferService) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule({"route":"/pages/processIntelligence/datadocument", "title":"Data Document"});
    this.hints = [
      { selector:'#process_data', description:'Uploaded file process data', showNext:true },
      { selector:'#search_process_data', description:'Search Process Data', showNext:true },
      { selector:'#generateGraph', description:'Click to generate process graph' }
    ];
    this.dt.changeHints(this.hints);
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
}
