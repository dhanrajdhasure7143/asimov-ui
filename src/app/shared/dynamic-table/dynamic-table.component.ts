import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Table } from "primeng/table";
import { DataTransferService } from "src/app/pages/services/data-transfer.service";

@Component({
  selector: "app-dynamic-table",
  templateUrl: "./dynamic-table.component.html",
  styleUrls: ["./dynamic-table.component.css"],
})
export class DynamicTableComponent implements OnInit {
  @Input("columns_list") public columns_list: any[] = [];
  @Input("table_data") public table_data: any[] = [];
  @Input("representatives") public representatives: any[] = [];
  @Input("screenTable") public screenTable: any;
  @Input("userRoles") public userRoles: any[] = [];
  @Input("checkBoxShow") public checkBoxShow:boolean;
  @Output() viewItem = new EventEmitter<any[]>();
  @Output() deleteItem = new EventEmitter<any[]>();
  @Output() openTaskWorkSpace = new EventEmitter<any[]>();
  @Output("updateItem") updateItem:any= new EventEmitter<any>();
  @Output() selectedData = new EventEmitter<any[]>();
  @Input("show_delete_btn") public show_delete_btn:boolean;
  @Input("dataKeyId") public dataKeyId:any
  @Input("search_fields") public search_fields:any;
  @Input("selectionMode") public selectionMode:any;
  @Input("show_edit_btn") public show_edit_btn:boolean;
  @Input("show_view_btn") public show_view_btn:boolean;
  @Input("show_retry_btn") public show_retry_btn:boolean;
  @Output("retryById") retryById:any= new EventEmitter<any>();
  @Input("categories_list") public categories_list: any[] = [];
  @Input("isdisabled_edit") public isdisabled_edit:boolean;
  @Input("isdisabled_delete") public isdisabled_delete:boolean;
  @Input("show_search_field") public show_search_field:boolean;
  @Input("show_column_filter") public show_column_filter:boolean;
  @Input("show_clear_filter") public show_clear_filter:boolean;
  @Input("show_download_btn") public show_download_btn:boolean;
  @Output() downloadItem = new EventEmitter<any[]>();
  @Output("onRowDoubleClick") onRowDoubleClick:any= new EventEmitter<any>();
  @Input("show_approve_btn") public show_approve_btn:boolean;
  @Input("show_reject_btn") public show_reject_btn:boolean;
  @Output() approvedItem = new EventEmitter<any[]>();
  @Output() rejectItem = new EventEmitter<any[]>();
  public loggedUserRole: any[]=[];
  _selectedColumns: any[];
  customers: any = [];
  userName: any;
  selectedItem: any;
  loading: boolean = true;
  loggedInUser:String;
  users_list:any=[];
  statusColors = {
    Medium: 'orange',
    High: 'red',
    Low: 'green',
    Yes:"green",
    No: 'red',
    Active :'green',
    Inactive:'red',
    ACTIVE:'green',
    INACTIVE:'red',
    Rejected:"red",
    Approved:"green",
    Pending:"orange",
    Running:'#007bff',
    Completed:"green",
    Inprogress:"orange",
    Failed:"red",
    New:'green',
    Started:'green',
    Stopped:"red"
  };

  constructor(private route:ActivatedRoute,private dt: DataTransferService) {}

  ngOnInit(): void {
   this.loggedInUser= localStorage.getItem("ProfileuserId");
   this.dt.tenantBased_UsersList.subscribe(response => {
    let usersDatausers_list:any[] = [];
    if(response)
      usersDatausers_list = response;
    if(usersDatausers_list.length>0){
    // this.users_list = usersDatausers_list.filter(x => x.user_role_status == 'ACTIVE')
    this.users_list = usersDatausers_list;
    this.loggedUserRole = [localStorage.getItem("userRole")];
    }
  })
  }

  ngOnChanges() {
    if(this.selectionMode == 'single') this.selectedItem={}
    else this.selectedItem = []

    this._selectedColumns = this.columns_list;
    
    if (this.table_data.length > 0) this.loading = false;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns_list.filter((col) =>
      val.includes(col)
    );
  }

  deleteRow(row) {
    this.deleteItem.emit(row);
  }

  viewDetailsbyId(row) {
    this.viewItem.emit(row);
  }

  clear(table: Table) {
    table.clear();
  }

  getColor(status) {
    return this.statusColors[status]?this.statusColors[status]:'';
  }

  editRowBy_Id(rowData:any){
    this.updateItem.emit(rowData);
  }

  selectRow(){
    this.selectedData.emit(this.selectedItem)
  }

  openWorkSpace(row){
    this.openTaskWorkSpace.emit(row)
  }

  onRetryGraphGenerate(row){
    this.retryById.emit(row)
  }

  filter1(e){
  }

  downloadRow(row) {
    this.downloadItem.emit(row);
  }

  onRow_DoubleClick(event: any,rowData){
      this.onRowDoubleClick.emit(rowData);
  }

  getapproved(rowData){
    this.approvedItem.emit(rowData)
  }

  getRejected(rowData){
    this.rejectItem.emit(rowData)
  }
}
