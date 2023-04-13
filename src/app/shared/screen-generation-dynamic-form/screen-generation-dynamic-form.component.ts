import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DataTransferService } from "src/app/pages/services/data-transfer.service";
import { RestApiService } from "src/app/pages/services/rest-api.service";

@Component({
  selector: "app-screen-generation-dynamic-form",
  templateUrl: "./screen-generation-dynamic-form.component.html",
  styleUrls: ["./screen-generation-dynamic-form.component.css"],
})
export class ScreenGenerationDynamicFormComponent implements OnInit {
  @Input("details") public details: any;
  @Input("dash_board_list") public dash_board_list: any;
  @Input("inputFieldData") public inputFieldData: any;
  @Output("emitFormValue") outputEmitter: any = new EventEmitter<any>();
  isEditForm: boolean = false;
  chartType: any = [];

  public generatedForm: any = new FormGroup({});
  tableData: any;
  portalnames: any;
  formvalue: any;
  tenantNameCheck: boolean;
  placeholder ="Enter"

  constructor(
    private rest: RestApiService,
    private datatransfer: DataTransferService,
    private messageService:MessageService
  ) {}

  ngOnInit(): void {
    if (this.details == undefined) {
      this.isEditForm = false;
      this.inputFieldData.forEach((item: any) => {
        this.generatedForm.addControl(
          item.ColumnName,
          new FormControl(item.DefaultValue)
        );
      });
    } else {
      this.isEditForm = true;
      this.inputFieldData.forEach((item: any) => {
        if (
          this.details[item.ColumnName] != undefined ||
          this.details[item.ColumnName] != ""
        )
          this.generatedForm.addControl(
            item.ColumnName,
            new FormControl(this.details[item.ColumnName])
          );
        else
          this.generatedForm.addControl(
            item.ColumnName,
            new FormControl(item.DefaultValue)
          );
      });
    }
   // this.getChartType();
    this.getPortalNames();
  }

  // getChartType() {
  //   this.rest.getChartType().subscribe((data) => {
  //     this.chartType = data;
  //   });
  // }

  emitFormValue() {
    this.outputEmitter.emit(this.generatedForm.value);
  }

  resetForm() {
    this.generatedForm.reset();
  }

  getPortalNames() {
    this.datatransfer.screelistObservable.subscribe((data: any) => {
      this.tableData = data;
      this.rest.getPortalName(this.tableData.ScreenType).subscribe((data) => {
        this.portalnames = data;
      });
    });
  }

  onChangetype() {}
  checkTenantName() {
    let tenantId=localStorage.getItem("masterTenant")
    let tenantName = this.generatedForm.get("tenant_name").value;
    this.rest.checkTenantName(tenantName,tenantId).subscribe((data) => {
      if(data == false){
        this.tenantNameCheck = true;
      }else{
        this.tenantNameCheck = false;
      }
    });
  }
}
