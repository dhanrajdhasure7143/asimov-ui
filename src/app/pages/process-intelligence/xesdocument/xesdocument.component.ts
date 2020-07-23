import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { PiHints } from '../model/process-intelligence-module-hints';
import { RestApiService } from '../../services/rest-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-xesdocument',
  templateUrl: './xesdocument.component.html',
  styleUrls: ['./xesdocument.component.css']
})
export class XesdocumentComponent implements OnInit {
  xesData: any = [];
  dataName: any;
  dataTime: any;
  p = 1;
  processId: any;
  isUploadFileName: any;
  searchTerm: any;


  constructor(private router: Router,
    private dt: DataTransferService,
    private hints: PiHints,
    private rest: RestApiService) { }

  ngOnInit() {
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule({ "route": "/pages/processIntelligence/xesdocument", "title": "XES Document" });
    this.dt.changeHints(this.hints.dataDocumentHints);
    this.dt.current_piData.subscribe(res => { this.xesData = res })
  }

  dataResource(dataArray) {
    if (dataArray.length == 4) {
      this.dataName = dataArray[2]
      this.dataTime = dataArray[3]
      return dataArray[1] = dataArray[1];
    } else {
      this.dataName = dataArray[1]
      this.dataTime = dataArray[2]
      return '-';
    }
  }

  loopTrackBy(index, term) {
    return index;
  }
  slideUp() { //Bottom Slide Up
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
  }
  generateGraph(e) {   //Process Graph Generate
    this.processId = Math.floor(100000 + Math.random() * 900000);
    this.rest.fileName.subscribe(res => {
      // console.log(res);
      this.isUploadFileName = res;
    });
    const connectorBody = {
      "name": "xes-" + this.processId,
      "config": {
        "connector.class": "com.epsoft.asimov.connector.xes.XesSourceConnector",
        "tasks.max": "1",
        // "file": "/var/kafka/HospitalBilling.xes",
        "file": "/var/kafka/" + this.isUploadFileName,
        // "topic": "topqconnector-xesTesting107",
        "topic": "topqconnector-xes-" + this.processId,
        "key.converter": "io.confluent.connect.avro.AvroConverter",
        "key.converter.schema.registry.url": "http://10.11.0.101:8081",
        "value.converter": "io.confluent.connect.avro.AvroConverter",
        "value.converter.schema.registry.url": "http://10.11.0.101:8081",
        "transforms": "TimestampConverter,ValueToKey,InsertField",
        "transforms.TimestampConverter.type": "org.apache.kafka.connect.transforms.TimestampConverter$Value",
        "transforms.TimestampConverter.format": "MM/dd/yyyy HH:mm:ss",
        "transforms.TimestampConverter.field": "startTime",
        "transforms.TimestampConverter.target.type": "string",
        "transforms.ValueToKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
        "transforms.ValueToKey.fields": "caseID",
        "transforms.InsertField.type": "org.apache.kafka.connect.transforms.InsertField$Value",
        "transforms.InsertField.static.field": "piIdName",
        // "transforms.InsertField.static.value": "1098-p1098"
        "transforms.InsertField.static.value": this.processId + "-p" + this.processId
      }
    }

    this.rest.saveConnectorConfig(connectorBody, e.categoryName, this.processId, e.processName).subscribe(res => {
      this.router.navigate(['/pages/processIntelligence/flowChart'], { queryParams: { piId: this.processId } });

    })

  }


  getDateFormat(d) {

    //     var formatFound = this.getFormat(d); //returns "YYYY-MM-DDTHH:MM:SS"
    //     console.log(formatFound);
    // if(formatFound !==null){
    //    //do stuff
    //    console.log(formatFound);
    // }
    return d;

  }

  getFormat(d) {
    var dateFormats = {
      "iso_int": "YYYY-MM-DD",
      "short_date": "DD/MM/YYYY",
      "iso_date_time": "YYYY-MM-DDTHH:MM:SS",
      "iso_date_time_utc": "YYYY-MM-DDTHH:MM:SSZ",
      "iso_date_time_utc1": "YYYY-MM-DDThh:mm:"
      //define other well known formats if you want
    }
    for (var prop in dateFormats) {
      if (moment(d, dateFormats[prop], true).isValid()) {
        return dateFormats[prop];
      }
    }
    return null;
  }
}