import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoaderService } from 'src/app/services/loader/loader.service';
import { RestApiService } from "../../services/rest-api.service";

@Component({
  selector: "app-rpa-action-items",
  templateUrl: "./rpa-action-items.component.html",
  styleUrls: ["./rpa-action-items.component.css"],
})
export class RpaActionItemsComponent implements OnInit {
  actionTable: any = [];
  representatives: any = [];
  columns_list: any = [];
  addflag: boolean = true;
  delete_flag: boolean = false;
  checkBoxShow: boolean = true;
  updateflag:boolean = false;

  constructor(
    private router:Router,
    private loader:LoaderService,
    private rest_api:RestApiService
    ) {}

  ngOnInit(): void {
    this.loader.show();
    this.getAlltoolsets();
  }

  getAlltoolsets() {
    // this.rest_api.getConnectionslist().subscribe((data: any) => {
    // this.connectorTable = data;
    this.loader.hide();
    this.columns_list = [
      {
        ColumnName: "actionName",
        DisplayName: "Action Name",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "actionType",
        DisplayName: "Action Type",
        ShowFilter: true,
        ShowGrid: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "url",
        DisplayName: "URL/Root Domain",
        ShowFilter: true,
        ShowGrid: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "methodType",
        DisplayName: "Method Type",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "attribute",
        DisplayName: "Attributes",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "description",
        DisplayName: "Purpose",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "date",
        sort: true,
        multi: false,
      },
    ];

    this.actionTable =[
      {id:"1",actionName:"Login", url:"http://www.zohoapis.com/crm/v3/leads",methodType:"POST",actionType:"API Request",attribute:"Employee ID",description:"-"},
      {id:"2",actionName:"Create", url:"http://www.zohoapis.com/crm/v3/leads",methodType:"POST",actionType:"API Request",attribute:"Employee ID",description:"Creation of an Employee"},
      {id:"3",actionName:"Delete", url:"http://www.zohoapis.com/crm/v3/leads",methodType:"DELETE",actionType:"Authenticated",attribute:"Employee ID",description:"Deletion of an employee"},
    ]
  // })
  }

  viewDetails(event) {}
  deleteById(event) {}
  deleteConnection() {}
  readSelectedData(data) {
    data.length > 0 ? (this.addflag = false) : (this.addflag = true);
    data.length > 0 ? (this.delete_flag = true) : (this.delete_flag = false);
    data.length == 1 ? (this.updateflag =true) : (this.updateflag = false);
  }

  updateAction() {
    this.router.navigate(["/pages/rpautomation/connection"])
  }

  deleteAction() {}
  backToConnection(){
    this.router.navigate(['/pages/rpautomation/configurations'],{
      queryParams: {index:2}
    })
  }
}
