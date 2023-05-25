import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from "src/app/services/loader/loader.service";

import Swal from "sweetalert2";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";

@Component({
  selector: "app-user-screen",
  templateUrl: "./user-screen.component.html",
  styleUrls: ["./user-screen.component.css"],
})
export class UserScreenComponent implements OnInit {
  tableData: any = [];
  screensList: any;
  primaryKey: any;
  updateDetails: any;
  formDetails: any = [];
  columns_list: any = [];
  selectedScreen: any = {};
  displayFlag: string;
  dash_board_list: any[] = [];

  constructor(
    private rest: RestApiService,
    private datatransfer: DataTransferService,
    private route: ActivatedRoute,
    private spinner: LoaderService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((res: any) => {
      localStorage.setItem("screenId", res.Screen_ID);
      this.getUserScreen_List(res.Screen_ID);
    });
    //  this.getDashboardScreens();
  }

  getUserScreen_List(screen_id: any) {
    this.spinner.show();
    this.rest.getUserScreenList().subscribe((data: any) => {
      this.screensList = data;
      this.screensList.forEach((element: any) => {
        if (element.Screen_ID == screen_id) {
          this.selectedScreen = element;
          this.getUserScreenData();
        }
      });
      this.getFormFields(screen_id);
      this.displayTable();
    });
  }

  getFormFields(screenId: any) {
    let res_data;
    this.rest.getFormDetails(screenId).subscribe((response: any) => {
      res_data = response;
      this.formDetails = res_data.filter((data: any) => {
        return data.ShowForm == true;
      });
      this.columns_list = res_data;
      let obj = {
        ColumnName: "action",
        DisplayName: "Actions",
        ShowGrid: true,
        ShowFilter: false,
        sort: false,
        multi: false,
      };
      this.columns_list.push(obj);
    });
  }

  displayTable() {
    this.displayFlag = DisplayEnum.DISPLAYTABLE;
  }

  createForm() {
    this.updateDetails = undefined;
    this.displayFlag = DisplayEnum.CREATEFORM;
  }

  editForm(data: any) {
    this.updateDetails = data;
    this.displayFlag = DisplayEnum.EDITFORM;
  }

  deleteRecord(data: any) {
    this.spinner.show();
    Swal.fire({
      title: "Are you Sure?",
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
        this.rest
          .deleteRecord(
            this.selectedScreen.Table_Name,
            this.primaryKey,
            data[this.primaryKey]
          )
          .subscribe(
            (resp: any) => {
              if (resp.Code == 8011) {
                Swal.fire({
                  title: "Error",
                  text: resp.message,
                  position: "center",
                  icon: "error",
                  heightAuto: false,
                  confirmButtonText: "Ok",
                });
                this.spinner.hide();
              } else {
                Swal.fire({
                  title: "Success",
                  text: resp.message,
                  position: "center",
                  icon: "success",
                  heightAuto: false,
                }).then(()=>{
                  this.getUserScreenData(); 
                  window.location.reload();
                })
              }
            },
            (err: any) => {
              Swal.fire("Error", "Unable to delete record", "error");
              this.spinner.hide();
            }
          );
          }
    });
  }

  caputreFormValues(values: any) {
    let val: any;
    if (this.updateDetails == undefined) {
      this.spinner.show();
      this.rest
        .postUserscreenData(
          this.selectedScreen.Table_Name,
          (val = { objects: [values] })
        )
        .subscribe((data) => {
          Swal.fire({
            title: "Success",
            text: "Record Saved successfully !!",
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
            this.getUserScreenData(); 
            window.location.reload();
          })
          this.displayFlag = DisplayEnum.DISPLAYTABLE;
        });
    } else {
      let payload = {
        objects: [values],
      };
      this.spinner.show();
      this.rest
        .updateFormDetails(
          this.selectedScreen.Table_Name,
          this.primaryKey,
          this.updateDetails[this.primaryKey],
          payload
        )
        .subscribe((response: any) => {
          if (response.Code == 8012) {
            Swal.fire({
              title: "Error",
              text: response.message,
              position: "center",
              icon: "error",
              showCancelButton: false,
              confirmButtonColor: "#007bff",
              cancelButtonColor: "#d33",
              heightAuto: false,
              confirmButtonText: "Ok",
            })
            this.getUserScreenData();
          } else {
            Swal.fire({
              title: "Success",
              text: response.message,
              position: "center",
              icon: "success",
              showCancelButton: false,
              customClass: {
                confirmButton: 'btn bluebg-button',
                cancelButton:  'btn new-cancelbtn',
              },
              heightAuto: false,
              confirmButtonText: "Ok",
            }).then(() => {
              this.getUserScreenData();
            });
          }
          this.displayFlag = DisplayEnum.DISPLAYTABLE;
        });
    }
  }

  getUserScreenData() {
    this.spinner.show();
    this.rest
      .getUserScreenData(
        this.selectedScreen.Table_Name,
        this.selectedScreen.Screen_ID
      )
      .subscribe((data: any) => {
        if (data.length != 0) {
          let keys = Object.keys(data[0]);
          this.primaryKey = keys[0];
        } else {
          this.primaryKey = "";
        }
        this.tableData = [];
        let res_data = data;
        this.tableData = res_data;
        this.spinner.hide();
        this.displayTable();
      });
  }

  getUserScreenList() {
    this.spinner.show();
    this.datatransfer.screelistObservable.subscribe((data: any) => {
      this.selectedScreen = data;
      localStorage.setItem("screenId", data.Screen_ID);
      this.getFormFields(data.Screen_ID);
      this.getUserScreenData();
      this.displayTable();
    });
  }

  // getDashboardScreens() {
  //   this.rest.getDashBoardScreens().subscribe((data: any) => {
  //     this.dash_board_list = data;
  //   });
  // }
}
enum DisplayEnum {
  DISPLAYTABLE = "DisplayTable",
  EDITFORM = "EditForm",
  CREATEFORM = "CreateForm",
}
