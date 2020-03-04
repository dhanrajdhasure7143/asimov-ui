import { Component,ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  xlsx_csv_mime:string;
  xes_mime:string;
  db_mime:string;

  constructor(private router: Router, private dt:DataTransferService, private rest:RestApiService) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule("");
    this.xlsx_csv_mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv';
    this.xes_mime = '.xes';
    this.db_mime = '.sql';
  }

  onSelect(event) {
    this.rest.sendUploadedFile(event.addedFiles[0]).subscribe(
      res => {
    // this.dt.getFileContents(event.addedFiles[0]);
        // this.router.navigate(['/pages/processIntelligence/datadocument'],data:{'valid':res["valid"]});
      },
      err => {
        console.error("File Upload failed");
      });
  }

}
