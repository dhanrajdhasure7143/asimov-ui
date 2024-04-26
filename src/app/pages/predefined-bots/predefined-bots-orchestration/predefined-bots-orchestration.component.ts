import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-predefined-bots-orchestration',
  templateUrl: './predefined-bots-orchestration.component.html',
  styleUrls: ['./predefined-bots-orchestration.component.css']
})
export class PredefinedBotsOrchestrationComponent implements OnInit {

  columns_list: any[] = [
    { ColumnName: "AutomationName", DisplayName: "Automation Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "type", DisplayName: "Type", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "Schedule", DisplayName: "Schedule", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "action", DisplayName: "Action", ShowGrid: true, ShowFilter: false, filterWidget: "normal", filterType: "text", sort: false, multi: false, }
  ];
  scheduledbots = [
    {
      AutomationName: "Cipal Recruitment",
      Schedule: "2024-05-01",
      id:'pre-6473824',
      type:"Recruitment bot"
    },
    {
      AutomationName: "Epsot",
      Schedule: "2024-05-01",
      id:'rec-6473824',
      type:"Recuritment Bot"
    },
    {
      AutomationName: "ABC",
      Schedule: "2024-05-01",
      id:'mar_74797584',
      type:"Marketing Bot"
    },
    {
      AutomationName: "XYZ MA",
      Schedule: "2024-05-01",
      id:'mar_74797584',
      type:"Marketing Bot"
    }
  ]
  table_searchFields: any = [];
  showOverlay: boolean = false;
  showBotForm: boolean = false;

  constructor(
    private rest: RestApiService,
    private spinner: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
  }

  ngAfterViewInit() {

  }

  deleteById($event: any) {
  }

  viewDetails($event: any) {

  }

  editById(item: any) {
    console.log("testing",item)
    this.router.navigate(["/pages/predefinedbot/predefinedforms"],{queryParams:{type:"edit",id:item.productId}});
  }

  runById($event: any) {

  }

  stopById($event: any) {

  }


}
