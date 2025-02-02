import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RestApiService } from "../../services/rest-api.service";
import Swal from "sweetalert2";
import { LoaderService } from "src/app/services/loader/loader.service";
import { columnList } from "src/app/shared/model/table_columns";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";


@Component({
  selector: "app-admin-add-screen",
  templateUrl: "./admin-add-screen.component.html",
  styleUrls: ["./admin-add-screen.component.css"],
  providers:[columnList]
})
export class AdminAddScreenComponent implements OnInit {
  public insertForm: FormGroup;
  public updateColumnForm: FormGroup;
  tableData: any = [];
  columns_list: any = [];
  tableListData: any = [];
  textAlign: any = ["Right", "Left", "Center"];
  loading: boolean = false;
  tablehide: boolean = false;
  screen_id: any;
  isDisabled: boolean = false;
  screenId: any;
  savedata: any = [];
  elementId: any;
  updateColumndata: any = [];
  buttonDisable: boolean = false;
  displayData: any;
  elementData: any = [];
  showCheckbox: boolean = false;
  labelupdate: boolean = false;
  display: boolean = false;
  table_searchFields: any = [];
  hiddenPopUp: boolean = false;
  myValue: number = 0;
  screenNameCheck: boolean;
  filterData: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private rest: RestApiService,
    private route: ActivatedRoute,
    private spinner:LoaderService,
    private columns:columnList,
    private toastService: ToasterService,
    private toastMessages: toastMessages

  ) {
    this.route.queryParams.subscribe((res: any) => {
      this.screen_id = res.id;
    });
  }
  

  ngOnInit(): void {
    this.updateColumnForm = this.formBuilder.group({
      ColumnName: [
        { value: "", disabled: true },
      ],
      DisplayName: ["", Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9_-]*$'),Validators.maxLength(255)])],
      widget_type: [""],
      ShowGrid: [false],
      ShowSearch: [false],
      ShowForm: [false],
      read_only: [false],
      mandatory: [false],
      length: [""],
      default_type: [""],
      data_type: [
        { value: "", disabled: true }],
      DefaultValue: [""],
      ColumnOrder: [""],
      text_align: [""],
      width: [""],
      tooltip: [""],
      placeholder: [""],
    });

    this.insertForm = this.formBuilder.group({
      screen_Name: ["", Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z]+(\\s[a-zA-Z]+)*$'),Validators.maxLength(50)])],
      table_Name: ["", Validators.compose([Validators.required])],
      allow_Insert: [false],
      allow_Edit: [false],
      allow_Delete: [false],
      // show_As_Child: [false],
      // default_Sort: [""],
      // default_Filter_Clause: [""],
      // preferences: [""],
      // row_Count: [0],
      // insights: [""],
      // //  Role: ["", Validators.compose([Validators.required])],
      // formType: [""],
      // // screenType: ["", Validators.compose([Validators.required])],
    });

    this.getListofTables();
    if (this.screen_id) {
      this.getScreenDetail();
    }
  }

  backToScreenList() {
    this.router.navigate(["./pages/admin/admin-screen-list"]);
  }

  editColumn(row: any) {
    this.display = true;
    this.hiddenPopUp = true;
    this.elementId = row.ElementId;
    this.screenId = row.ScreenId;
    // this.modalref = this.modalservice.show(content);
    this.updateColumnForm.controls["ColumnName"].setValue(row["ColumnName"]);
    this.updateColumnForm.controls["DisplayName"].setValue(row["DisplayName"]);
    this.updateColumnForm.controls["widget_type"].setValue(row["widget_type"]);
    this.updateColumnForm.controls["ShowGrid"].setValue(
      row["ShowGrid"] == "t" ? true : false
    );
    this.updateColumnForm.controls["ShowSearch"].setValue(
      row["ShowSearch"] == "t" ? true : false
    );
    this.updateColumnForm.controls["ShowForm"].setValue(
      row["ShowForm"] == "t" ? true : false
    );
    this.updateColumnForm.controls["read_only"].setValue(
      row["read_only"] == "t" ? true : false
    );
    this.updateColumnForm.controls["mandatory"].setValue(
      row["mandatory"] == "t" ? true : false
    );
    this.updateColumnForm.controls["length"].setValue(row["length"]);
    this.updateColumnForm.controls["default_type"].setValue(
      row["default_type"]
    );
    this.updateColumnForm.controls["DefaultValue"].setValue(
      row["DefaultValue"]
    );
    this.updateColumnForm.controls["ColumnOrder"].setValue(row["ColumnOrder"]);
    this.updateColumnForm.controls["text_align"].setValue(row["text_align"]);
    this.updateColumnForm.controls["width"].setValue(row["width"]);
    this.updateColumnForm.controls["tooltip"].setValue(row["width"]);
    this.updateColumnForm.controls["placeholder"].setValue(row["placeholder"]);
    this.updateColumnForm.controls["data_type"].setValue(row["data_type"]);
  }

  updateColumn() {
    let payload = this.updateColumnForm.value;
    let val = {
      objects: [payload],
    };
    this.spinner.show();

    this.rest.updateColumn(this.elementId, this.screenId, val).subscribe((data) => {
        this.updateColumndata = data;
        this.display = false;
        this.toastService.showSuccess('Column','update');
        this.getScreenDetail();
        this.spinner.hide();
        this.hiddenPopUp = false;
      });
  }

  getListofTables() {
    this.spinner.show();
    this.rest.getListOfTables().subscribe((data) => {
      this.tableListData = data;
      this.spinner.hide();
    });
  }

  onChangeTableName(tablename: any) {
    this.spinner.show();
    this.tablehide = true;
    this.rest.getTabledataAdmin(tablename.value).subscribe((data) => {
      this.tableData = data;
      this.columns_list = this.tableData;
     this.columns_list = this.columns.adminChangeTable_column;
      this.spinner.hide();
    });
  }

  getScreenDetail() {
    this.labelupdate = true;
    let screenList: any;
    this.rest.getScreenList().subscribe((data) => {
      screenList = data;
      this.isDisabled = true;
      this.filterData = screenList.find(
        (data: any) => data.Screen_ID == this.screen_id
      );
      setTimeout(() => {
       this.spinner.show()
        this.insertForm = this.formBuilder.group({
          screen_Name: [
            this.filterData.Screen_Name,
            Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z]+(\\s[a-zA-Z]+)*$'),Validators.maxLength(50)]),
          ],
          table_Name: [this.filterData.Table_Name],
          allow_Insert: [this.filterData.Allow_Insert],
          allow_Edit: [this.filterData.Allow_Edit],
          allow_Delete: [this.filterData.Allow_Delete],
          // show_As_Child: [this.filterData.Show_As_Child],
          // default_Sort: [""],
          // default_Filter_Clause: [""],
          // preferences: [""],
          // row_Count: [this.filterData.Row_Count],
          // insights: [""],
          // //  Role: ["", Validators.compose([Validators.required])],
          // formType: [""],
          // screenType: [this.filterData.ScreenType],
        });
      }, 150);
      this.spinner.hide();
      this.tablehide = true;
      this.rest.getElementTable(this.screen_id).subscribe((data) => {
        this.elementData = data;
        this.tableData = this.elementData;
        this.columns_list = this.columns.adminAddScreen_column;
        this.spinner.hide();
      });
    });
  }

  updateData() {
    let payload = this.insertForm.value;
    payload["status"] = false;
    payload["fields"] = "";
    this.spinner.show();
    this.rest.updateScreenData(payload, this.screen_id).subscribe((data) => {
    this.toastService.showSuccess(payload.screen_Name,'update');
    setTimeout(() => {
      this.backToScreenList();
    }, 1000);
    this.spinner.hide();
    },(err: any) => {
      this.toastService.showError(this.toastMessages.updateError)
    })  
  }

  saveScreen() {
    this.spinner.show();
    let payload = this.insertForm.value;
    payload["status"] = false;
    payload["fields"] = "";
    this.rest.saveScreenData(payload).subscribe((data) => {
      this.savedata = data;
      this.columns_list = this.savedata;
      this.tableData = this.savedata;
      this.columns_list = this.columns.saveTable_column;
      this.toastService.showSuccess(payload.screen_Name,'save');
      setTimeout(() => {
        this.backToScreenList();
      }, 1000);
      this.spinner.hide();
      this.buttonDisable = true;
    }),
      (err: any) => {
        this.toastService.showError(this.toastMessages.saveError)
      };
  }

  closeOverlay(event) {
    this.hiddenPopUp = event;

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
    }
    return true;
  }

  validateInput(event: Event) {
    const inputValue = Number((<HTMLInputElement>event.target).value);
    if (isNaN(inputValue) || inputValue < 0 || inputValue > 255 || (inputValue.toString().length > 3)) {
    this.myValue = null;
    }
    const validators = [
      (value: number) => !isNaN(value), // Check if value is a number
      (value: number) => value >= 0 && value <= 255, // Check if value is in range [0, 255]
      (value: number) => value.toString().length <= 3, // Check if value has at most 3 digits
    ];
    const isValid = validators.every((validator) => validator(inputValue));
    if (isValid) {
      this.myValue = inputValue;
    } else {
      this.myValue = null;
  }
}
checkScreenName() {
  let screenName = this.insertForm.get("screen_Name").value;
  this.rest.checkScreenName(screenName).subscribe((data) => {
    if(data == false){
      this.screenNameCheck = true;
    }else{
      this.screenNameCheck = false;
    }
  });
}
}
