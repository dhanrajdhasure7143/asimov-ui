import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from "src/app/services/loader/loader.service";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import { ConfirmationService } from "primeng/api";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";

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
    private spinner: LoaderService,
    private confirmationService: ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages
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
    this.confirmationService.confirm({
      message: "Do you want to delete this record? This can't be undo.",
      header: "Are you sure?",
      key: "positionDialog",
      accept: () => {
        this.spinner.show();
        this.rest
          .deleteRecord(
            this.selectedScreen.Table_Name,
            this.primaryKey,
            data[this.primaryKey]
          )
          .subscribe(
            (resp: any) => {
              if (resp.Code == 8011) {
                this.toastService.showError(resp.message + "!");
                this.spinner.hide();
              } else {
                this.toastService.showSuccess(resp.message + "!",'response');
                this.getUserScreenData();
                this.spinner.hide();
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            },
            (err: any) => {
              this.toastService.showError(this.toastMessages.deleteError);
            }
          );
      },
      reject: (type) => {
        this.spinner.hide();
      }
    });
  }

  caputreFormValues(values: any) {
    let val: any;
    let tenantName = values.tenant_name
    if (this.updateDetails == undefined) {
      this.spinner.show();
      this.rest.postUserscreenData(this.selectedScreen.Table_Name, (val = { objects: [values] })).subscribe((data) => {      
          this.toastService.showSuccess(tenantName,'save');
            this.getUserScreenData();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
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
            this.toastService.showError(response.message+"!");
  
            this.getUserScreenData();
          } else {
            this.toastService.showSuccess(response.message+"!",'response');
              this.getUserScreenData();
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
