import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoaderService } from "src/app/services/loader/loader.service";
import Swal from "sweetalert2";
import { RestApiService } from "../../services/rest-api.service";
import { columnList } from "src/app/shared/model/table_columns";

@Component({
  selector: "app-admin-screen-list",
  templateUrl: "./admin-screen-list.component.html",
  styleUrls: ["./admin-screen-list.component.css"],
  providers:[columnList]
})
export class AdminScreenListComponent implements OnInit {
  screenlist: any = [];
  loading: boolean = false;
  columns_list: any = [];
  table_searchFields: any=[];
  constructor(private router: Router, private rest: RestApiService, private columns:columnList,
    private spinner:LoaderService) {}

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
      this.table_searchFields = [
        "Screen_Name",
        "Table_Name"
      ];
      this.spinner.hide();
    });
  }

  editScreen(event: any) {
    this.router.navigate(["./pages/admin/admin-screen-create"], {
      queryParams: { id: event.Screen_ID },
    });
  }

  deleteScreen(id: any) {
    this.spinner.show();

    Swal.fire({
      title: "Are you sure?",
      text: "You Delete the Record!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn bluebg-button',
        cancelButton:  'btn new-cancelbtn',
      },
      heightAuto: false,
      
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.rest.deleteScreen(id.Screen_ID).subscribe((resp) => {
          Swal.fire({
            title: "Success",
            text: "Record Deleted Successfully!!",
            position: "center",
            icon: "success",
            showCancelButton: false,
            customClass: {
              confirmButton: 'btn bluebg-button',
              cancelButton:  'btn new-cancelbtn',
            },
            heightAuto: false,
            confirmButtonText: "Ok",
          }).then(()=>{
            window.location.reload();
          })      
        },(err: any) => {
            Swal.fire("Error", "Unable to delete record", "error")
          });
      }
      this.getScreenList();
      this.spinner.hide();

      // }),
    });
  }
}
