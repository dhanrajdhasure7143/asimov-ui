import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoaderService } from "src/app/services/loader/loader.service";
import Swal from "sweetalert2";
import { RestApiService } from "../../services/rest-api.service";
import { columnList } from "src/app/shared/model/table_columns";
import { DataTransferService } from "../../services/data-transfer.service";
import { ConfirmationService } from "primeng/api";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";

@Component({
  selector: "app-admin-screen-list",
  templateUrl: "./admin-screen-list.component.html",
  styleUrls: ["./admin-screen-list.component.css"],
  providers: [columnList],
})
export class AdminScreenListComponent implements OnInit {
  screenlist: any = [];
  loading: boolean = false;
  columns_list: any = [];
  table_searchFields: any = [];
  constructor(
    private router: Router,
    private rest: RestApiService,
    private columns: columnList,
    private spinner: LoaderService,
    private dt: DataTransferService,
    private confirmationService: ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages

  ) {}

  ngOnInit(): void {
    this.getScreenList();
    this.columns_list = this.columns.adminScreenlist_column;
  }

  addNew() {
    this.router.navigate(["./pages/admin/admin-screen-create"]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  getScreenList() {
    this.spinner.show();
    this.rest.getScreenList().subscribe((data) => {
      this.screenlist = data;
      this.table_searchFields = ["Screen_Name", "Table_Name"];
      this.spinner.hide();
    });
  }

  editScreen(event: any) {
    this.router.navigate(["./pages/admin/admin-screen-create"], {
      queryParams: { id: event.Screen_ID },
    });
  }

  deleteScreen(data: any) {
    this.confirmationService.confirm({
      message: "Do you want to delete this record? This can't be undo.",
      header: "Are you sure?",
      key: "positionDialog",
      accept: () => {
        this.spinner.show();
        this.rest.deleteScreen(data.Screen_ID).subscribe(
          (resp) => {
            this.toastService.showSuccess(data.Screen_Name,'delete');
            this.spinner.hide();
            this.getScreenList();
          },
          (err: any) => {
            this.toastService.showError(this.toastMessages.deleteError);
          }
        );
      },
      reject: (type) => {},
    });
  }

  viewDetails(screen) {
    this.dt.setScreenList(screen);
    this.router.navigate(["/pages/admin/user"], {
      queryParams: {
        Screen_ID: screen.Screen_ID,
        Table_Name: screen.Table_Name,
      },
    });
  }
}
