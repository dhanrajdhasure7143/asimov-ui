import { Component, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { DataTransferService } from "../../services/data-transfer.service";
import { PiHints } from '../model/process-intelligence-module-hints';
import { GlobalScript } from '../../../shared/global-script';

import { MatPaginator, PageEvent } from '@angular/material';
import { fromMatPaginator, paginateRows } from './../../business-process/model/datasource-utils';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

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
  cathead: any;
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
  dTypeArray = [];
  p=1;
  modalRef: BsModalRef;
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;

  constructor(private router:Router, private dt:DataTransferService, private hints:PiHints, private global:GlobalScript,private modalService: BsModalService)    { }

  ngOnInit() {
    this.resetColMap();
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule({ "route": "/pages/processIntelligence/datadocument", "title": "Data Document" });
    this.dt.changeHints(this.hints.dataDocumentHints);
        let restwo;
      this.dt.current_piData.subscribe(response => { restwo = response })
      let res=restwo;
        this.fileData = res;
        this.headerData = res[0];
        this.headerData = this.headerData;
        this.bkp_headerData = res[0];
        this.fileData = this.fileData.slice(1);
        this.fileData = this.fileData.slice(0, this.fileData.length-1);
        this.fileData = this.fileData;
        for (var f = 0; f < this.headerData.length; f++) {
          switch (f) {
            case 0:
              {
                this.getDataType(this.headerData[0], this.fileData[0][0], 0);
              }
            case 1:
              {
                this.getDataType(this.headerData[1], this.fileData[0][1], 1);
              }
              case 2:
                  {
                    this.getDataType(this.headerData[2], this.fileData[0][2], 2);
                  }
                case 3:
                  {
                    this.getDataType(this.headerData[3], this.fileData[0][3], 3);
                  }
                  case 4:
                      {
                        this.getDataType(this.headerData[4], this.fileData[0][4], 4);
                      }
                    case 5:
                      {
                        this.getDataType(this.headerData[5], this.fileData[0][5], 5);
                      }
                       case 6:
                        {
                          this.getDataType(this.headerData[6], this.fileData[0][6], 6);
                        }
                        case 7:
                          {
                            this.getDataType(this.headerData[7], this.fileData[0][7], 7);
                          }
                          case 8:
                            {
                              this.getDataType(this.headerData[8], this.fileData[0][8], 8);
                            }
                            case 9:
                              {
                                this.getDataType(this.headerData[9], this.fileData[0][9], 9);
                              }
                              case 10:
                                {
                                  this.getDataType(this.headerData[10], this.fileData[0][10], 10);
                                }
                                case 11:
                                  {
                                    this.getDataType(this.headerData[11], this.fileData[0][11], 11);
                                  }
                                  case 12:
                                    {
                                      this.getDataType(this.headerData[12], this.fileData[0][12], 12);
                                    }
          }
        }
        setTimeout(() => {
          this.assignPagenation(this.fileData)
        }, 500);
  }

  caseIdSelection() {
    var headerstype=[];
    var headerstypeArray=[]
    headerstype.push(this.cathead1,this.cathead2,this.cathead3,this.cathead4,this.cathead5, this.cathead6,this.cathead7,this.cathead8,this.cathead9,this.cathead10,this.cathead11,this.cathead12, this.cathead13)
    for(var i=0;i<this.headerData.length;i++){
      var obj={};
      obj[this.headerData[i]]=headerstype[i]
      headerstypeArray.push(obj)
    }
    localStorage.setItem('headertypeObj',JSON.stringify(headerstypeArray))
    this.router.navigate(['/pages/processIntelligence/selection']);
  }

  sort(property) {   //table sorting
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

  selectedCell(tr_index, index, e, v) {     //Validate each cell for valid data type
    this.headerName = v;
    if (!e.srcElement.classList.contains("valid") && this.headerName) {
      let reg_expression;
      let isDateCheck: boolean = false;
      if (this.headerName.indexOf('Timestamp') == -1 || this.headerName.indexOf('Time') == -1 || this.headerName.indexOf('Date') == -1) {
        reg_expression = new RegExp(/[-~]*$/); //    /^[-\w\s]+$/
      } //alphanum check else
      isDateCheck = this.headerName.indexOf('Timestamp') != -1 || this.headerName.indexOf('Time') != -1 || this.headerName.indexOf('Date') != -1
      let isInvalid: boolean = false;
      for (var x = 0; x < this.fileData.length; x++) {
        if (!this.validCells['row' + x])
          this.validCells['row' + x] = [];
        if (!this.invalidCells['row' + x])
          this.invalidCells['row' + x] = [];
        let each_cell = this.fileData[x][index];
        if(each_cell == ''||each_cell == undefined){
          isInvalid = true;
          if (this.invalidCells['row' + x].indexOf('cell' + index) == -1)
            this.invalidCells['row' + x].push('cell' + index);
          this.global.notify("Empty data at header " + this.headerName + " cell No- " + (x + 1), "error");
          break;
        }
        if ((reg_expression && reg_expression.test(each_cell)) || isDateCheck) {
          if (isDateCheck) {
            try {let mydate = ''
                if(each_cell){
                    var splitDate = each_cell.split(' ');
                  if(splitDate[0].indexOf('.') != -1 ){
                  var aa = splitDate[0].split('.');
                  mydate = aa[1]+'.'+aa[0]+'.'+aa[2]+" "+splitDate[1]
                  } else {
                  mydate = each_cell;
                  }
                }
                
              formatDate(mydate, 'dd/MM/yyyy HH:mm:ss', 'en-US');
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
        this.isValidPiData = true;
       if (this.step_id == this.headerData.length) {
         
        } else {
          if(v=='S.No' || index==0){
            this.step_id = this.step_id
          }else{
            this.step_id = this.step_id + 1;
          }
         
        }
        
        this.headerData[index] = this.headerName;
      }
    
    }
  }

  resetColMap() {
    this.step_id = 1;
    this.validCells = [];
    this.invalidCells = [];
    this.isValidPiData = false;
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  searchTable() {   // Search value on table
    let _self = this;
    this.fileData = this.fileData.filter(each_row => {
      each_row.forEach(each_cell => {
        return each_cell.indexOf(_self.searchTerm) > -1;
      })
    })
  }

  getDataType(index, fData, headValue) {
    if(index){
    if(index.indexOf('Timestamp') != -1 || index.indexOf('Time') != -1 || index.indexOf('Date') != -1){
      if (headValue == 0 ) {
        if (this.isDate(fData) == true) {
          this.cathead1 = "Date/Time"; 
        } else {
          this.cathead1 = "String";
        }
      } 
      if (headValue == 1) {
        if (this.isDate(fData) == true) {
          this.cathead2 = "Date/Time";
        } else {
          this.cathead2 = "String";
        }
      }
      if (headValue == 2) {
        if (this.isDate(fData) == true) {
          this.cathead3 = "Date/Time";
        } else {
          this.cathead3 = "String";
        }
      }
      if (headValue == 3) {
        if (this.isDate(fData) == true) {
          this.cathead4 = "Date/Time";
        } else {
          this.cathead4 = "String";
        }
      }
      if (headValue == 4) {
        if (this.isDate(fData) == true) {
          this.cathead5 = "Date/Time";
        } else {
          this.cathead5 = "String";
        }
      }
      if (headValue == 5) {
        if (this.isDate(fData) == true) {
          this.cathead6 = "Date/Time";
        } else {
          this.cathead6 = "String";
        }
      }
      if (headValue == 6) {
        if (this.isDate(fData) == true) {
          this.cathead7 = "Date/Time";
        } else {
          this.cathead7 = "String";
        }
      }
      if (headValue == 7) {
        if (this.isDate(fData) == true) {
          this.cathead8 = "Date/Time";
        } else {
          this.cathead8 = "String";
        }
      }
      if (headValue == 8) {
        if (this.isDate(fData) == true) {
          this.cathead9 = "Date/Time";
        } else {
          this.cathead9 = "String";
        }
      }
      if (headValue == 9) {
        if (this.isDate(fData) == true) {
          this.cathead10 = "Date/Time";
        } else {
          this.cathead10 = "String";
        }
      }
      if (headValue == 10) {
        if (this.isDate(fData) == true) {
          this.cathead11 = "Date/Time";
        } else {
          this.cathead11 = "String";
        }
      }
      if (headValue == 11) {
        if (this.isDate(fData) == true) {
          this.cathead12 = "Date/Time";
        } else {
          this.cathead12 = "String";
        }
      }
      if (headValue == 12) {
        if (this.isDate(fData) == true) {
          this.cathead13 = "Date/Time";
        } else {
          this.cathead13 = "String";
        }
      }
    } else {
      if (headValue == 0 ) {
        if (this.isNumeric(fData) == true) {
          this.cathead1 = "Integer";
        } else {
          this.cathead1 = "String";
        }
      } 
      if (headValue == 1) {
        if (this.isNumeric(fData) == true) {
          this.cathead2 = "Integer";
        } else {
          this.cathead2 = "String";
        }
      }
      if (headValue == 2) {
        if (this.isNumeric(fData) == true) {
          this.cathead3 = "Integer";
        } else {
          this.cathead3 = "String";
        }
      }
      if (headValue == 3) {
        if (this.isNumeric(fData) == true) {
          this.cathead4 = "Integer";
        } else {
          this.cathead4 = "String";
        }
      }
      if (headValue == 4) {
        if (this.isNumeric(fData) == true) {
          this.cathead5 = "Integer";
        } else {
          this.cathead5 = "String";
        }
      }
      if (headValue == 5) {
        if (this.isNumeric(fData) == true) {
          this.cathead6 = "Integer";
        } else {
          this.cathead6 = "String";
        }
      }
      if (headValue == 6) {
        if (this.isNumeric(fData) == true) {
          this.cathead7 = "Integer";
        } else {
          this.cathead7 = "String";
        }
      }
      if (headValue == 7) {
        if (this.isNumeric(fData) == true) {
          this.cathead8 = "Date/Time";
        } else {
          this.cathead8 = "String";
        }
      }
      if (headValue == 8) {
        if (this.isNumeric(fData) == true) {
          this.cathead9 = "Date/Time";
        } else {
          this.cathead9 = "String";
        }
      }
      if (headValue == 9) {
        if (this.isNumeric(fData) == true) {
          this.cathead10 = "Date/Time";
        } else {
          this.cathead10 = "String";
        }
      }
      if (headValue == 10) {
        if (this.isNumeric(fData) == true) {
          this.cathead11 = "Date/Time";
        } else {
          this.cathead11 = "String";
        }
      }
      if (headValue == 11) {
        if (this.isNumeric(fData) == true) {
          this.cathead12 = "Date/Time";
        } else {
          this.cathead12 = "String";
        }
      }
      if (headValue == 12) {
        if (this.isNumeric(fData) == true) {
          this.cathead13 = "Date/Time";
        } else {
          this.cathead13 = "String";
        }
      }
     }
    }
    
  }

  isNumeric(num) {    // validate number or not
    return !isNaN(num)
  }

  isDate(date){     // valodate date formate
      if(!isNaN(Date.parse(date))){
        return true;
      } else {
        return false;
      }
  }

  getDataTypeChange(hData, cData){
      this.dTypeArray.push({'colType': hData, 'type': cData});
      for(var i=0;i<this.dTypeArray.length;i++){
        if(this.dTypeArray[i].colType == hData){
          this.dTypeArray[i].type = cData;
      }
    }
    let diffArray = this.removeDuplicates(this.dTypeArray);
  }

  removeDuplicates(arr) {
    let newArray = []; 
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
  assignPagenation(data){
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(paginateRows(pageEvents$));
  }
}
