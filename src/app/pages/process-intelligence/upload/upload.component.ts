import { Component, OnInit, ViewChild } from '@angular/core';
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
  public isSave: boolean = true;
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
  constructor(private router: Router,
    private dt: DataTransferService,
    private rest: RestApiService,
    private global: GlobalScript,
    private hints: PiHints,
    private ngxXml2jsonService: NgxXml2jsonService) {
    //       window.location.hash="/pages/processIntelligence/upload";
    // window.location.hash="/pages/processIntelligence/upload";//again because google chrome don't insert first hash into history
    // window.onhashchange=function(){window.location.hash="/pages/processIntelligence/upload";}
  }

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
    this.selectedFile = <File>event.addedFiles[0];
    const fd = new FormData();
    fd.append('file', this.selectedFile),
      fd.append('permissionStatus', 'yes'),
      this.rest.fileupload(fd).subscribe(res => {
      this.filedetails = res
        // console.log('res',this.filedetails.data);
        let fileName = this.filedetails.data.split(':');
        // localStorage.setItem("fileName",fileName[1])
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
      // console.log('this.data',e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <any[][]>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, range: 0 }));
      // const ws2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]];

      this.dt.changePiData(this.data);
      let excelfile = [];
      excelfile = this.data;
      // console.log(excelfile);
      localStorage.removeItem("fileData")
      localStorage.setItem("fileData", JSON.stringify(excelfile))
      this.router.navigate(['/pages/processIntelligence/datadocument']);
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
      // console.log(excelfile);
      localStorage.removeItem("fileData")
      localStorage.setItem("fileData", JSON.stringify(excelfile))
      this.router.navigate(['/pages/processIntelligence/datadocument']);
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
            tmp_arr.push(e[i].string['@attributes']['value']);
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
          tmp_arr.push(e[i].string['@attributes']['value']);
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
      _self.router.navigateByUrl('/pages/processIntelligence/xesdocument');
    }
    fileReader.readAsText(file);
  }

  checkIsArray(v) {
    if (Array.isArray)
      return Array.isArray(v);
  }
  testConnection() {
    // console.log("userName",this.dbDetails);
    this.isSave = false;
  }

  onDbSelect() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
  }
  closePopup() {
    var modal = document.getElementById('myModal');
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


}



