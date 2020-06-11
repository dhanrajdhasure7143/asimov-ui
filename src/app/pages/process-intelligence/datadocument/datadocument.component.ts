import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { DataTransferService } from "../../services/data-transfer.service";
import { PiHints } from '../model/process-intelligence-module-hints';
import { GlobalScript } from '../../../shared/global-script';

@Component({
  selector: 'app-datadocument',
  templateUrl: './datadocument.component.html',
  styleUrls: ['./datadocument.component.css']
})
export class DatadocumentComponent implements OnInit {
  fileData: any = [];
  validCells: any = [];
  invalidCells: any = [];
  headValues: any = [];
  isValidPiData: boolean = false;
  headerData: any = [];
  header_names_array: string[] = ['Case_Id', 'Start_Timestamp', 'End_Timestamp', 'Activity', 'Resource', 'Role'];
  isDesc: boolean = false;
  selectedRow: any;
  case_id: any;
  step_id: number;
  headerName: any;
  bkp_headerData;
  searchTerm: string;
  cathead1: any;
  cathead2: any;
  cathead3: any;
  cathead4: any;
  cathead5: any;
  cathead6: any;
  dTypeArray = [];

  // constructor(private router: Router, private dt: DataTransferService, private hints: PiHints, private global: GlobalScript) { }
  // searchTerm:string;
  modalRef: BsModalRef;

  constructor(private router:Router, private dt:DataTransferService, private hints:PiHints, private global:GlobalScript,private modalService: BsModalService)    { }

  ngOnInit() {
    this.resetColMap();
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule({ "route": "/pages/processIntelligence/datadocument", "title": "Data Document" });
    this.dt.changeHints(this.hints.dataDocumentHints);
    this.dt.current_piData.subscribe(res => {
      if (res) {
        this.fileData = res;
        this.headerData = res[0];
        this.bkp_headerData = res[0];
        this.fileData = this.fileData.slice(1);
        console.log(this.headerData);
        for (var f = 0; f < this.headerData.length; f++) {
          switch (f) {
            case 0:
              {
                this.getDataType(0, this.fileData[0][0], this.headerData[0]);
              }
            case 1:
              {
                this.getDataType(1, this.fileData[0][1], this.headerData[1]);
              }
              case 2:
                  {
                    this.getDataType(2, this.fileData[0][2], this.headerData[2]);
                  }
                case 3:
                  {
                    this.getDataType(3, this.fileData[0][3], this.headerData[3]);
                  }
                  case 4:
                      {
                        this.getDataType(4, this.fileData[0][4], this.headerData[4]);
                      }
                    // case 5:
                    //   {
                    //     this.getDataType(5, this.fileData[0][5]);
                    //   }
                     
          }
        }
      }
    });

  }
  generatepg() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    // this.router.navigate(['/pages/processIntelligence/flowChart']);
  }
  caseIdSelection() {
    this.router.navigate(['/pages/processIntelligence/selection']);

  // generatepg(){
  //   // this.router.navigate(['/pages/processIntelligence/flowChart']);
  //   document.getElementById("foot").classList.remove("slide-down");
  // document.getElementById("foot").classList.add("slide-up");
  }
  sort(property) {
    this.isDesc = !this.isDesc; //change the direction    
    let direction = this.isDesc ? 1 : -1;
    let index = this.headerData.indexOf(property);
    return this.checkNsort(direction, index);
  }
  checkNsort(direction, index) {
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

  loopTrackBy(index, term) {
    return index;
  }
  selectedCell(tr_index, index, e, v) {
    this.headerName = v;
    if (!e.srcElement.classList.contains("valid") && this.headerName) {
      let hdr_ar_index = this.headerData.indexOf(this.headerName);
      let reg_expression;
      let isDateCheck: boolean = false;
      if (hdr_ar_index == 0) {
        reg_expression = new RegExp(/^\d+$/);
      } //alphanum check
      isDateCheck = hdr_ar_index == 2 || hdr_ar_index == 3;
      if (hdr_ar_index == 1 || hdr_ar_index == 4 || hdr_ar_index == 5) {
        reg_expression = new RegExp(/^[a-z\s ,]{0,255}$/i); //string check
      }
      let isInvalid: boolean = false;
      for (var x = 0; x < this.fileData.length; x++) {
        if (!this.validCells['row' + x])
          this.validCells['row' + x] = [];
        if (!this.invalidCells['row' + x])
          this.invalidCells['row' + x] = [];
        let each_cell = this.fileData[x][index];
        if ((reg_expression && reg_expression.test(each_cell)) || isDateCheck) {
          if (isDateCheck) {
            try {
              formatDate(each_cell, 'dd/MM/yyyy HH:mm:ss', 'en-US');
              this.invalidCells['row' + x].splice(this.invalidCells['row' + x].indexOf('cell' + index), 1);
              if (this.validCells['row' + x].indexOf('cell' + index) == -1)
                this.validCells['row' + x].push('cell' + index);
            } catch (e) {
              isInvalid = true;
              if (this.invalidCells['row' + x].indexOf('cell' + index) == -1)
                this.invalidCells['row' + x].push('cell' + index);
              this.global.notify("Incorrect value for header " + this.headerName + " at cell - " + (x + 1), "error");
              break;
            }
          } else {
            this.invalidCells['row' + x].splice(this.invalidCells['row' + x].indexOf('cell' + index), 1);
            if (this.validCells['row' + x].indexOf('cell' + index) == -1)
              this.validCells['row' + x].push('cell' + index);
          }
        } else {
          isInvalid = true;
          if (this.invalidCells['row' + x].indexOf('cell' + index) == -1)
            this.invalidCells['row' + x].push('cell' + index);
          this.global.notify("Incorrect value for header " + this.headerName + " at cell - " + (x + 1), "error");
          break;
        }
      }
      if (!isInvalid) {
        if (this.step_id == this.headerData.length) {
          this.isValidPiData = true;
        } else {
          this.step_id = this.step_id + 1;
        }
        this.headerData[index] = this.headerName;
        this.headerName = this.headerData[hdr_ar_index + 1];
      }
    }
  }

  resetColMap() {
    // this.headerName = this.header_names_array[0];
    this.step_id = 1;
    this.validCells = [];
    this.invalidCells = [];
    this.isValidPiData = false;
  }
  openModal(template) {
    this.modalRef = this.modalService.show(template);

  }

  searchTable() {
    let _self = this;
    this.fileData = this.fileData.filter(each_row => {
      each_row.forEach(each_cell => {
        return each_cell.indexOf(_self.searchTerm) > -1;
      })
    })
  }
  closePopup() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }

  getDataType(index, fData, dType) {
    console.log(index);
    console.log(fData);

    if(dType.indexOf('Timestamp') != -1){
      if (index == 0 ) {
        if (this.isDate(fData) == true) {
          this.cathead1 = "Date/Time";
        } else {
          this.cathead1 = "String";
        }
      } 
      if (index == 1) {
        if (this.isDate(fData) == true) {
          this.cathead2 = "Date/Time";
        } else {
          this.cathead2 = "String";
        }
      }
      if (index == 2) {
        if (this.isDate(fData) == true) {
          this.cathead3 = "Date/Time";
        } else {
          this.cathead3 = "String";
        }
      }
      if (index == 3) {
        if (this.isDate(fData) == true) {
          this.cathead4 = "Date/Time";
        } else {
          this.cathead4 = "String";
        }
      }
      if (index == 4) {
        if (this.isDate(fData) == true) {
          this.cathead5 = "Integer";
        } else {
          this.cathead5 = "String";
        }
      }
      if (index == 5) {
        if (this.isDate(fData) == true) {
          this.cathead6 = "Date/Time";
        } else {
          this.cathead6 = "String";
        }
      }
    } else {
      if (index == 0 ) {
        if (this.isNumeric(fData) == true) {
          this.cathead1 = "Integer";
        } else {
          this.cathead1 = "String";
        }
      } 
      if (index == 1) {
        if (this.isNumeric(fData) == true) {
          this.cathead2 = "Integer";
        } else {
          this.cathead2 = "String";
        }
      }
      if (index == 2) {
        if (this.isNumeric(fData) == true) {
          this.cathead3 = "Integer";
        } else {
          this.cathead3 = "String";
        }
      }
      if (index == 3) {
        if (this.isNumeric(fData) == true) {
          this.cathead4 = "Integer";
        } else {
          this.cathead4 = "String";
        }
      }
      if (index == 4) {
        if (this.isNumeric(fData) == true) {
          this.cathead5 = "Integer";
        } else {
          this.cathead5 = "String";
        }
      }
      if (index == 5) {
        if (this.isNumeric(fData) == true) {
          this.cathead6 = "Integer";
        } else {
          this.cathead6 = "String";
        }
      }
    }
    
  }

  isNumeric(num) {
    return !isNaN(num)
  }

  isDate(date){
    if(!isNaN(Date.parse(date)))
	{
    console.log("Valid Date \n");
    return true;
	} else {
    return false;
  }
  }

  getDataTypeChange(hData, cData){
    console.log(hData);
    console.log(cData);
   //if(this.dTypeArray.length == 0){
      this.dTypeArray.push({'colType': hData, 'type': cData});
    //} else {
      for(var i=0;i<this.dTypeArray.length;i++){
        if(this.dTypeArray[i].colType == hData){
          this.dTypeArray[i].type = cData;
        // } else {
        //   console.log("in else")
        //   this.dTypeArray.push({colType: hData, type: cData});
        // }
      }
    }
    console.log(this.dTypeArray)
    let diffArray = this.removeDuplicates(this.dTypeArray);
    console.log(diffArray)
    localStorage.setItem("DDType",JSON.stringify(diffArray));
    
  }
  removeDuplicates(arr) {
    let newArray = []; 
              
            // Declare an empty object 
            let uniqueObject = {}; 
              
            // Loop for the array elements 
            for (let i in arr) { 
      
                // Extract the title 
              let   objTitle = arr[i]['colType']; 
      
                // Use the title as the index 
                uniqueObject[objTitle] = arr[i]; 
            } 
              
            // Loop to push unique object into array 
            for (let j in uniqueObject) { 
                newArray.push(uniqueObject[j]); 
            } 
              
            // Display the unique objects 
            
            return newArray;

  }
}
