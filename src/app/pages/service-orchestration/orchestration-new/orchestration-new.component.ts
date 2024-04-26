import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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


  public log: any = [];
  public tabledata: boolean = true;
  search: any;
  @Input("categoriesList") public categoriesList: any[] = [];
  columns_list: any[] = [
    { ColumnName: "AutomationName", DisplayName: "Automation Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "Schedule", DisplayName: "Schedule", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "action", DisplayName: "Action", ShowGrid: true, ShowFilter: false, filterWidget: "normal", filterType: "text", sort: false, multi: false, }
  ];
  scheduledbots = [
    {
      AutomationName: "Recruitment Bot",
      Schedule: "2024-05-01",
      id:'recruitment'
    },
    {
      AutomationName: "Marketing Bot",
      Schedule: "2024-05-01",
      id:'marketing'
    }
  ]
  table_searchFields: any = [];
  showOverlay: boolean = false;
  showBotForm: boolean = false;
  form: FormGroup;

  constructor(
    private rest: RestApiService,
    private spinner: LoaderService,
    private columns: columnList,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.spinner.show();
    // this.columns_list = this.columns.schedulerBots_column
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      environment: new FormControl([], Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  ngOnChanges() {
    let categories_list = [];
    this.categoriesList.forEach(element => {
      categories_list.push(element.categoryName)
    });
    this.columns_list.map(item => {
      if (item.ColumnName === "category") {
        item["dropdownList"] = categories_list
      }
    })
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
