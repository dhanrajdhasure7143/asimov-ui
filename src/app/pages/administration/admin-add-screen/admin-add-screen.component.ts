import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RestApiService } from "../../services/rest-api.service";
import Swal from "sweetalert2";
import { LoaderService } from "src/app/services/loader/loader.service";

@Component({
  selector: "app-admin-add-screen",
  templateUrl: "./admin-add-screen.component.html",
  styleUrls: ["./admin-add-screen.component.css"],
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private rest: RestApiService,
    private route: ActivatedRoute,
    private spinner:LoaderService
  ) {
    this.route.queryParams.subscribe((res: any) => {
      this.screen_id = res.id;
    });
  }

  ngOnInit(): void {
    this.updateColumnForm = this.formBuilder.group({
      ColumnName: [
        { value: "", disabled: true },
        Validators.compose([Validators.required]),
      ],
      DisplayName: ["", Validators.compose([Validators.required])],
      widget_type: ["", Validators.compose([Validators.required])],
      ShowGrid: [false],
      ShowSearch: [false],
      ShowForm: [false],
      read_only: [false],
      mandatory: [false],
      length: ["", Validators.compose([Validators.required])],
      default_type: ["", Validators.compose([Validators.required])],
      data_type: [
        { value: "", disabled: true },
        Validators.compose([Validators.required]),
      ],
      DefaultValue: [""],
      ColumnOrder: ["", Validators.compose([Validators.required])],
      text_align: ["", Validators.compose([Validators.required])],
      width: ["", Validators.compose([Validators.required])],
      tooltip: ["", Validators.compose([Validators.required])],
      placeholder: ["", Validators.compose([Validators.required])],
    });

    this.insertForm = this.formBuilder.group({
      screen_Name: ["", Validators.compose([Validators.required])],
      table_Name: ["", Validators.compose([Validators.required])],
      allow_Insert: [false],
      allow_Edit: [false],
      allow_Delete: [false],
      show_As_Child: [false],
      default_Sort: [""],
      default_Filter_Clause: [""],
      preferences: [""],
      row_Count: [0],
      insights: [""],
      //  Role: ["", Validators.compose([Validators.required])],
      formType: [""],
      screenType: ["", Validators.compose([Validators.required])],
    });

    this.getListofTables();
    if (this.screen_id) this.getScreenDetail();
  }

  backToScreenList() {
    this.router.navigate(["./pages/admin/admin-screen-list"]);
  }

  editColumn(row: any) {
    this.display = true;
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

    this.rest
      .updateColumn(this.elementId, this.screenId, val)
      .subscribe((data) => {
        this.updateColumndata = data;
        this.display = false;
        Swal.fire("Success", "Screen Updated Successfully!", "success");
        this.spinner.hide();
       
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
      this.columns_list = [
        {
          ColumnName: "column_name",
          DisplayName: "Column Name",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "data_type",
          DisplayName: "Data Type",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
      ];
      this.spinner.hide();
    });
  }

  getScreenDetail() {
    this.labelupdate = true;
    let screenList: any;
    this.rest.getScreenList().subscribe((data) => {
      screenList = data;
      this.isDisabled = true;
      let filterData = screenList.find(
        (data: any) => data.Screen_ID == this.screen_id
      );
      this.insertForm = this.formBuilder.group({
        screen_Name: [
          filterData.Screen_Name,
          Validators.compose([Validators.required]),
        ],
        table_Name: [filterData.Table_Name],
        allow_Insert: [filterData.Allow_Insert],
        allow_Edit: [filterData.Allow_Edit],
        allow_Delete: [filterData.Allow_Delete],
        show_As_Child: [filterData.Show_As_Child],
        default_Sort: [""],
        default_Filter_Clause: [""],
        preferences: [""],
        row_Count: [filterData.Row_Count],
        insights: [""],
        //  Role: ["", Validators.compose([Validators.required])],
        formType: [""],
        screenType: [filterData.ScreenType],
      });
      this.tablehide = true;
      this.rest.getElementTable(this.screen_id).subscribe((data) => {
        this.elementData = data;
        this.tableData = this.elementData;
        console.log(this.elementData);
        this.columns_list = [
          {
            ColumnName: "ColumnName",
            DisplayName: "Column Name",
            ShowGrid: true,
            ShowFilter: true,
            filterWidget: "normal",
            filterType: "text",
            sort: true,
            multi: false,
          },
          {
            ColumnName: "DisplayName",
            DisplayName: "Display Name",
            ShowGrid: true,
            ShowFilter: true,
            filterWidget: "normal",
            filterType: "text",
            sort: true,
            multi: false,
          },
          {
            ColumnName: "data_type",
            DisplayName: "Data Type",
            ShowGrid: true,
            ShowFilter: true,
            filterWidget: "normal",
            filterType: "text",
            sort: true,
            multi: false,
          },
          {
            ColumnName: "action",
            DisplayName: "Actions",
            ShowGrid: true,
            ShowFilter: true,
            filterWidget: "normal",
            filterType: "text",
            sort: true,
            multi: false,
          },
        ];
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
      Swal.fire({
        title: "Success",
        text: "Screen Updated successfully !!",
        position: "center",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#d33",
        heightAuto: false,
        confirmButtonText: "Ok",
      }).then(()=>{
        this.backToScreenList();
        setTimeout(() => {
          window.location.reload();
        }, 600);
      })  
      this.spinner.hide();
    },(err: any) => {
      Swal.fire("Error", "Unable to Update Screen Details", "error");
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
      console.log(this.savedata);
      this.tableData = this.savedata;
      this.columns_list = [
        {
          ColumnName: "ColumnName",
          DisplayName: "Column Name",
          ShowGrid: true,
          sort: true
        },
        {
          ColumnName: "DisplayName",
          DisplayName: "Display Name",
          ShowGrid: true,
          sort: true,
        },
        {
          ColumnName: "action",
          DisplayName: "Actions",
          ShowGrid: true,
          sort: true
        },
      ];
      Swal.fire({
        title: "Success",
        text: "Screen Saved successfully !!",
        position: "center",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#d33",
        heightAuto: false,
        confirmButtonText: "Ok",
      }).then(()=>{
        this.backToScreenList();
        setTimeout(() => {
          window.location.reload();
        }, 600);
      })      
     
      // window.location.reload();
      // Swal.fire("Success", "Screen Saved successfully !", "success");
      this.spinner.hide();
      this.buttonDisable = true;
    }),
      (err: any) => {
        Swal.fire("Error", "Unable to Save!", "error");
      };
  }
}
