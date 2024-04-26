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

  public log: any = [];
  public tabledata: boolean = true;
  search: any;
  columns_list: any[] = [
    { ColumnName: "AutomationName", DisplayName: "Automation Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "type", DisplayName: "Type", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "Schedule", DisplayName: "Schedule", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "action", DisplayName: "Action", ShowGrid: true, ShowFilter: false, filterWidget: "normal", filterType: "text", sort: false, multi: false, }
  ];
  scheduledbots = [
    {
      AutomationName: "Microsoft",
      Schedule: "2024-05-01",
      id:'pre-6473824',
      type:"Recuritment bot"
    },
    {
      AutomationName: "Epsot",
      Schedule: "2024-05-01",
      id:'rec-6473824',
      type:"Recuritment bot"
    },
    {
      AutomationName: "ABC",
      Schedule: "2024-05-01",
      id:'mar_74797584',
      type:"marketing Bot"
    },
    {
      AutomationName: "XYZ MA",
      Schedule: "2024-05-01",
      id:'mar_74797584',
      type:"marketing Bot"
    }
  ]
  table_searchFields: any = [];
  showOverlay: boolean = false;
  showBotForm: boolean = false;
  form: FormGroup;

  constructor(
    private rest: RestApiService,
    private spinner: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.spinner.show();
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      environment: new FormControl([], Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  ngOnChanges() {
  }

  ngAfterViewInit() {

  }


  clear(table: Table) {
    table.clear();
  }

  showForm() {
    this.showOverlay = true;
    // this.showBotForm=true;
    console.log("Button is clicked")
  }

  closeOverlay(event) {
    console.log(event)
    // this.processInfo = event;
    this.showOverlay = false;
  }

  navigateForm() {
    this.showBotForm = true;
  }
  deleteById($event: any) {
  }
  viewDetails($event: any) {

  }

  editById(item: any) {
    console.log("testing",item)
    if(item.id =='marketing'){
      this.router.navigate(["/pages/serviceOrchestration/dynamicForm"],{queryParams:{type:"edit",id:item.id}});
    }
    if(item.id =='recruitment'){
      this.router.navigate(["/pages/serviceOrchestration/prdefinedForm"],{queryParams:{type:"edit",id:item.id}});
    }
  }
  runById($event: any) {

  }

  stopById($event: any) {

  }


}
