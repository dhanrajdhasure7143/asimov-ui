import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Table } from "primeng/table";

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
  @Output() viewDetails = new EventEmitter<any[]>();
  @Output() deleteItem = new EventEmitter<any[]>();
  _selectedColumns: any[];
  customers: any = [];
  userName: any;
  selectedItem: any = {};
  loading: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this._selectedColumns = this.columns_list;
    if (this.table_data.length > 0) this.loading = false;
    console.log(this.table_data);
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
    this.viewDetails.emit(row);
  }

  clear(table: Table) {
    console.log(this.selectedItem);
    // table.clear();
  }
}
