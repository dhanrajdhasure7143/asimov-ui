import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { Table } from 'primeng/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';

@Component({
  selector: 'app-orchestration-new',
  templateUrl: './orchestration-new.component.html',
  styleUrls: ['./orchestration-new.component.css'],
  providers: [columnList]
})
export class OrchestrationNewComponent implements OnInit {


  public log:any=[];
  public tabledata: boolean = true;
  public scheduledbots: any = [];
  search:any;
  @Input("categoriesList") public categoriesList: any[] = [];
  columns_list:any[]=[
    {ColumnName: "botName",DisplayName: "Bot Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
    {ColumnName: "botSource",DisplayName: "Bot Source",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
    {ColumnName: "category",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,},
    {ColumnName: "lastRunTS",DisplayName: "Previous Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
    {ColumnName: "nextRunTS",DisplayName: "Next Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
    {ColumnName: "scheduleInterval",DisplayName: "Schedule Interval",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 12rem"},
    {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:['Running','Failure','Success','Paused','New','Pending','Stop'],status_icon:true},
    {ColumnName: "timezone",DisplayName: "Time Zone",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
    {ColumnName: "",DisplayName: "Action",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: false,multi: false,}
  ];
  table_searchFields: any=[];
  showOverlay:boolean=false;
  showBotForm:boolean=false;
  form: FormGroup;

  constructor(
    private rest:RestApiService,
      private spinner:LoaderService,
      private columns:columnList
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getSchedulebots();
    // this.columns_list = this.columns.schedulerBots_column
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      environment: new FormControl([], Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  ngOnChanges(){
    let categories_list=[];
    this.categoriesList.forEach(element => {
      categories_list.push(element.categoryName)
    });
    this.columns_list.map(item=>{
      if(item.ColumnName === "category"){
        item["dropdownList"]=categories_list
      }
    })
  }

  ngAfterViewInit() {
    
  }

  applyFilter2(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.scheduledbots.filter = filterValue;
    this.tabledata = this.scheduledbots.filteredData.length <= '0'  ? false: true;
  }

  getSchedulebots(){
    this.spinner.show();
    this.rest.get_scheduled_bots().subscribe(data1=>{
    this.log  = data1;
    this.tabledata = this.log.length <= '0'  ? false: true;
    this.scheduledbots = this.log
    this.scheduledbots.map(item=>{
      item.lastRunTS=item.lastRunTS?(item.lastRunTS!= "00:00"?new Date(item.lastRunTS):null):null;
      item.nextRunTS=item.nextRunTS?(item.nextRunTS!="00:00"?new Date(item.nextRunTS):null):null;
      return item
    });
    this.table_searchFields = ["botName","botSource","category","lastRunTS","nextRunTS","scheduleInterval","status","timezone"];
     this.spinner.hide(); 
   },err=>{
    this.spinner.hide();
   });
  }
  
  clear(table: Table) {
    table.clear();
  }

  showForm(){
    this.showOverlay=true;
    // this.showBotForm=true;
    console.log("Button is clicked")
  }

  closeOverlay(event) {
    console.log(event)
    // this.processInfo = event;
    this.showOverlay = false;
  }

  navigateForm(){
    this.showBotForm=true;
  }
  deleteById($event: any) {
    throw new Error('Method not implemented.');
    }
    viewDetails($event: any) {
    throw new Error('Method not implemented.');
    }

}
