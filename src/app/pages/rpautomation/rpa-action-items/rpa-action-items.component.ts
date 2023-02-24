import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-rpa-action-items",
  templateUrl: "./rpa-action-items.component.html",
  styleUrls: ["./rpa-action-items.component.css"],
})
export class RpaActionItemsComponent implements OnInit {
  connectorTable: any = [];
  representatives: any = [];
  columns_list: any = [];
  addflag: boolean = true;
  delete_flag: boolean = false;
  checkBoxShow: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.getAlltoolsets();
  }

  getAlltoolsets() {
    // this.rest_api.getConnectionslist().subscribe((data: any) => {
    // this.connectorTable = data;
    this.columns_list = [
      {
        ColumnName: "actionType",
        DisplayName: "Action Name",
        ShowGrid: true,
        ShowFilter: true,
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
        ColumnName: "httpMethodType",
        DisplayName: "Method Type",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "authorization_Type",
        DisplayName: "Attributes",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "createdDate",
        DisplayName: "Purpose",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "date",
        sort: true,
        multi: false,
      },
    ];
  }

  viewDetails(event) {}
  deleteById(event) {}
  deleteConnection() {}
  readSelectedData(data) {
    data.length > 0 ? (this.addflag = false) : (this.addflag = true);
    data.length > 0 ? (this.delete_flag = true) : (this.delete_flag = false);
  }
}
