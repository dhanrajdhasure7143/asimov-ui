import {
  Component,
  OnInit,
  ViewChild,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import * as BpmnJS from "./../../../bpmn-modeler.development.js";
import * as CmmnJS from "cmmn-js/dist/cmmn-modeler.production.min.js";
import * as DmnJS from "dmn-js/dist/dmn-modeler.development.js";
import { SharebpmndiagramService } from "../../services/sharebpmndiagram.service";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import Swal from "sweetalert2";
import { ConfirmationService } from 'primeng/api';
import { GlobalScript } from "src/app/shared/global-script";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { LoaderService } from "src/app/services/loader/loader.service";
import { Table } from "primeng/table";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";


@Component({
  selector: "app-bpshome",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class BpsHomeComponent implements OnInit {
  bpmnModeler: any;
  saved_diagrams: any[] = [];
  bkp_saved_diagrams: any[] = [];
  p: number = 1;
  term = "";
  isApproverUser: boolean = false;
  isAdminUser: boolean = false;
  sortedData: any;
  data;
  categoryName: any;
  categoryList: any = [];
  orderAsc: boolean = true;
  sortIndex: number = 2;
  index: number;
  xpandStatus = false;
  autosavedDiagramList = [];
  autosavedDiagramVersion = [];
  pendingStatus = "PENDING APPROVAL";
  userRole;
  systemAdmin: Boolean = false;
  userEmail: any = "";
  savedDiagrams_list: any[] = [];
  isButtonVisible: boolean = false;
  bpmnVisible: Boolean = false;
  categories_list: any[] = [];
  saved_diagramsList: any = [];
  isEdit: boolean = false;
  selectedObj: any = {};
  refreshSubscription: Subscription;
  selected_notation: any = {};
  isLoaderShow: boolean = true;
  noDataMessage: boolean;
  _selectedColumns: any[];
  search_fields: any[] = [];
  categories_list_new: any[] = [];
  users_list:any[]=[];
  columns_list = [
    {
      ColumnName: "bpmnProcessName",
      DisplayName: "Process Name",
      filterType: "text",
      filterWidget: "normal",
      ShowFilter: true,showTooltip:true,width:"flex: 0 0 11rem"
    },
    {
      ColumnName: "ntype",
      DisplayName: "Type",
      filterType: "text",
      filterWidget: "dropdown",
      ShowFilter: true,
      dropdownList: ["BPMN", "CMMN","DMN"],width:"flex: 0 0 7rem"
    },
    {
      ColumnName: "category",
      DisplayName: "Category",
      filterType: "text",
      filterWidget: "dropdown",
      ShowFilter: true,
      dropdownList:this.categories_list_new,width:"flex: 0 0 9rem"
    },
    {
      ColumnName: "processOwnerName",
      DisplayName: "Process Owner",
      filterType: "text",
      filterWidget: "normal",
      ShowFilter: true,showTooltip:true,width:"flex: 0 0 11rem"
    },
    {
      ColumnName: "version_new",
      DisplayName: "Version",
      filterType: "text",
      filterWidget: "normal",
      ShowFilter: true,width:"flex: 0 0 8rem"
    },
    {
      ColumnName: "convertedModifiedTime_new",
      DisplayName: "Last Modified",
      filterType: "date",
      filterWidget: "normal",
      ShowFilter: true,width:"flex: 0 0 11rem"
    },
    {
      ColumnName: "approverName",
      DisplayName: "Approver",
      filterType: "text",
      filterWidget: "normal",
      ShowFilter: true,showTooltip:true,width:"flex: 0 0 9rem"
    },
    {
      ColumnName: "status",
      DisplayName: "Status",
      filterType: "text",
      filterWidget: "dropdown",
      ShowFilter: true,
      dropdownList: ["Approved","In Progress", "Pending Approval"],
    },
    { ColumnName: "reviewComments", DisplayName: "Message",showTooltip:true,width:"flex: 0 0 5rem"},
    { ColumnName: "", DisplayName: "Actions" },
  ];
  public expandedRows = {};
  public searchValue:string;
  @ViewChild("dt1",{static:true}) table:Table

  constructor(
    private router: Router,
    private bpmnservice: SharebpmndiagramService,
    private dt: DataTransferService,
    private rest: RestApiService,
    private global: GlobalScript,
    private loader: LoaderService,
    private toastService: ToasterService,
    private confirmationService: ConfirmationService,
    private toastMessages: toastMessages

  ) {}

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns_list.filter((col) =>
      val.includes(col)
    );
  }

  ngOnInit() {
    this.loader.show();
    localStorage.setItem("isheader", "false");
    this.userRole = localStorage.getItem("userRole");
    this.userRole = this.userRole.split(",");
    this.bpmnVisible =
      this.userRole.includes("SuperAdmin") ||
      this.userRole.includes("Admin") ||
      this.userRole.includes("Process Owner") ||
      this.userRole.includes("Process Architect") ||
      this.userRole.includes("Process Analyst") ||
      this.userRole.includes("RPA Developer") ||
      this.userRole.includes("Process Architect") ||
      this.userRole.includes("System Admin");
    if (this.userRole.includes("SuperAdmin")) {
      this.isButtonVisible = true;
    } else if (this.userRole.includes("System Admin")) {
      this.isButtonVisible = true;
      this.isAdminUser = true;
    }
    this.systemAdmin = this.userRole.includes("System Admin");
    this.userEmail = localStorage.getItem("ProfileuserId");
    this.isApproverUser = this.userRole.includes("Process Architect");
    this.getUsersList();
    this.getAutoSavedDiagrams();
    this.getAllCategories();
    // document.getElementById("filters").style.display = "block";
    let obj = {};
    this.dt.bpsNotationaScreenValues(obj);
    this.dt.bpsHeaderValues("");
    this.refreshSubscription = this.dt.isTableRefresh.subscribe((res) => {
      if (res) {
        if (res.isRfresh) {
          this.loader.show();
          this.getBPMNList();
        }
      }
    });
    this._selectedColumns = this.columns_list;
    this.search_fields = [
      "bpmnProcessName",
      "ntype",
      "category",
      "processOwnerName",
      "version_new",
      "convertedModifiedTime_new",
      "approverName",
      "status",
    ];
    this.dt.resetTableSearch$.subscribe((res)=>{
      if(res == true){
        this.clearTableFilters(this.table);
        }
    })
  }

  async getBPMNList() {
    this.dt.processDetailsUpdateSuccess({ isRfresh: false });
    await this.rest.getUserBpmnsListWithoutNotation().subscribe(
      (res: any[]) => {
        this.saved_diagrams = res;
        this.saved_diagramsList = res;
        this.saved_diagrams.map((item) => {
          item.xpandStatus = false;
          item.convertedModifiedTime_new = new Date(item.convertedModifiedTime * 1000);
          item.version_new = "V1." + String(item.version);
          item["status"] = this.getNotationStatus(item.bpmnProcessStatus)
          item["processOwnerName"] =  this.getUserName(item.processOwner)
          return item;
        });
        // this.saved_diagrams.forEach(ele => {
        //   ele['eachObj']={
        //     // "bpmnXmlNotation":ele.bpmnXmlNotation,
        //     "bpmnConfProcessMeta":ele.bpmnConfProcessMeta,
        //     "bpmnProcessApproved":ele.bpmnProcessApproved,
        //     "convertedCreatedTime":ele.convertedCreatedTime,
        //     "createdTimestamp":ele.createdTimestamp,
        //     "hasConformance":ele.hasConformance,
        //     "id":ele.id,
        //     "notationFromPI":ele.notationFromPI,
        //     "tenantId":ele.tenantId,
        //     "userName":ele.userName,
        //     "modifiedTimestamp":ele.modifiedTimestamp
        //   }
        //   // ele["bpmnXmlNotation"]=''
        //   ele["bpmnConfProcessMeta"]=''
        //   ele["bpmnProcessApproved"]=''
        //   ele["convertedCreatedTime"]=''
        //   ele["createdTimestamp"]=''
        //   ele["hasConformance"]=''
        //   ele["id"]=''
        //   ele["notationFromPI"]=''
        //   ele["tenantId"]=''
        //   ele["userName"]=''
        //   ele['modifiedTimestamp']=''
        // });

        this.bkp_saved_diagrams = res;
        this.loader.hide();
        this.savedDiagrams_list = this.saved_diagrams;
        // this.assignPagenation(this.saved_diagrams);

        let selected_category = localStorage.getItem("bps_search_category");
        if (this.categories_list.length == 1) {
          this.categoryName = this.categories_list[0].categoryName;
        } else {
          this.categoryName = selected_category
            ? selected_category
            : "allcategories";
        }
        // this.searchByCategory(this.categoryName);
      },
      (err) => {
        this.loader.hide();
      }
    );
  }

  // @HostListener('document:click',['$event'])
  // clickout(event) {
  //   if(!document.getElementById("bpmn_list").contains(event.target) && this.index>=0)
  //     this.saved_diagrams[this.index].xpandStatus=false;
  // }

  openDiagram() {
    // if(bpmnDiagram.bpmnProcessStatus && bpmnDiagram.bpmnProcessStatus =="PENDING" ) return;
    // let binaryXMLContent = bpmnDiagram.eachObj.bpmnXmlNotation;
    let binaryXMLContent = "";
    binaryXMLContent = this.selected_notation.bpmnXmlNotation;
    // return;
    let bpmnModelId = this.selected_notation.bpmnModelId;
    let bpmnVersion = this.selected_notation.version;
    let bpmnType = this.selected_notation.ntype;
    this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
    let push_Obj = {
      rejectedOrApproved: this.selected_notation.bpmnProcessStatus,
      isfromApprover: false,
      isShowConformance: false,
      isStartProcessBtn: false,
      autosaveTime: this.selected_notation.modifiedTimestamp,
      isFromcreateScreen: false,
      process_name: this.selected_notation.bpmnProcessName,
      isEditbtn: false,
      isSavebtn: true,
      selectedNotation: this.selected_notation,
    };
    this.dt.bpsNotationaScreenValues(push_Obj);
    this.dt.bpsHeaderValues("");
    this.router.navigate(["/pages/businessProcess/uploadProcessModel"], {
      queryParams: { bpsId: bpmnModelId, ver: bpmnVersion, ntype: bpmnType },
    });
  }

  getAutoSavedDiagrams() {
    this.rest.getBPMNTempNotations().subscribe((res: any) => {
      if (Array.isArray(res)) this.autosavedDiagramList = res;
    });
  }

  getColor(status) {
    switch (status) {
      case "PENDING APPROVAL":
        return "#FED653";
      case "REJECTED":
        return "#B91C1C";
      case "APPROVED":
        return "#4BD963";
      case "In Progress":
        return "#FFA033";
    }
  }

  fitTableView(processName) {
    if (processName && processName.length > 11)
      return processName.substr(0, 11) + "...";
    return processName;
  }
  fitTableViewCategory(processName) {
    if (processName && processName.length > 7)
      return processName.substr(0, 7) + "..";
    return processName;
  }

  fitTableViewTime(processName) {
    if (processName && processName.length > 12)
      return processName.substr(0, 12) + "...";
    return processName;
  }

  filterAutoSavedDiagrams(modelId) {
    this.autosavedDiagramVersion = [];
    this.autosavedDiagramVersion = this.autosavedDiagramList.filter(
      (each_asDiag) => {
        return each_asDiag.bpmnModelId == modelId;
      }
    );
  }

  formatApproverName(apprName) {
    if (apprName && apprName.length > 15) return apprName.substr(0, 15) + "..";
    return apprName;
  }

  getSelectedNotation(eachBPMN, id, isExpanded) {
    if (!isExpanded) {
      this.isLoaderShow = true;
      this.selected_notation = {};
      let req_body = {
        bpmnModelId: eachBPMN.bpmnModelId,
        version: eachBPMN.version,
      };
      this.rest.getBpmnNotationByIdandVersion(req_body).subscribe((res) => {
        this.selected_notation = res;
        this.isLoaderShow = false;
        setTimeout(() => {
          this.getDiagram(eachBPMN, id, this.selected_notation.bpmnXmlNotation);
        }, 300);
      });
    }
  }

  getDiagram(eachBPMN, i, xml_data) {
    //   var element = document.getElementById('_diagram'+i);
    // element.scrollIntoView({behavior: "auto",block: "center", inline: "nearest"});
    // let byteBpmn = atob(eachBPMN.eachObj.bpmnXmlNotation);
    let byteBpmn = atob(xml_data);
    this.index = i;
    if (
      document
        .getElementsByClassName("diagram_container" + i)[0]
        .innerHTML.trim() != ""
    )
      return;
    let notationJson = {
      container: ".diagram_container" + i,
      keyboard: {
        bindTo: window,
      },
    };
    if (eachBPMN.ntype == "bpmn") this.bpmnModeler = new BpmnJS(notationJson);
    else if (eachBPMN.ntype == "cmmn")
      this.bpmnModeler = new CmmnJS(notationJson);
    else if (eachBPMN.ntype == "dmn")
      this.bpmnModeler = new DmnJS(notationJson);
    this.autosavedDiagramVersion = [];
    if (
      eachBPMN.bpmnProcessStatus != "APPROVED" &&
      eachBPMN.bpmnProcessStatus != "REJECTED" &&
      eachBPMN.bpmnProcessStatus != "PENDING"
    )
      this.filterAutoSavedDiagrams(eachBPMN.bpmnModelId);
    if (
      this.autosavedDiagramVersion[0] &&
      this.autosavedDiagramVersion[0]["bpmnProcessMeta"]
    )
      byteBpmn = atob(this.autosavedDiagramVersion[0]["bpmnProcessMeta"]);
    else byteBpmn = atob(xml_data);
    if (byteBpmn == "undefined") {
      this.rest
        .getBPMNFileContent("assets/resources/newDiagram.bpmn")
        .subscribe((res) => {
          this.bpmnModeler.importXML(res, function (err) {
            if (err) {
              console.error("could not import BPMN EZFlow notation", err);
            }
          });
        });
    } else {
      this.bpmnModeler.importXML(byteBpmn, function (err) {
        if (err) {
          console.error("could not import BPMN EZFlow diagram", err);
        }
      });
    }
    // let canvas = this.bpmnModeler.get('canvas');
    // canvas.zoom('fit-viewport');
  }

  loopTrackBy(index, term) {
    return index;
  }
  getAllCategories() {
    // get all categories list for dropdown
    this.rest.getCategoriesList().subscribe((res) => {
      this.categoryList = res;
      this.categories_list = this.categoryList.data.sort((a, b) =>
        a.categoryName.toLowerCase() > b.categoryName.toLowerCase()
          ? 1
          : b.categoryName.toLowerCase() > a.categoryName.toLowerCase()
          ? -1
          : 0
      );
      this.categories_list.forEach((element) => {
        this.categories_list_new.push(element.categoryName);
      });

      if (this.categoryList.data.length === 0) {
        this.confirmationService.confirm({
          message: "No categories available. Please contact the system admin to get access.",
          header: "Info",
          acceptLabel: "Ok",
          rejectVisible: false,
          acceptButtonStyleClass: "btn bluebg-button",
          defaultFocus: "none",
          acceptIcon: "null",
          key:'confirm2',
          accept: () => {
            // Add your logic here for contacting the system administrator
          },
        });
      }
    });
  }

  sendReminderMail(bpmNotation) {
    // e.stopPropagation();
    this.confirmationService.confirm({
      message: "You want to send a reminder mail to " + bpmNotation.approverName + " for the " + bpmNotation.bpmnProcessName + " V1." + bpmNotation.version + ".",
      header: "Are you sure?",
      rejectLabel: "No",
      acceptLabel: "Yes",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      key:'confirm2',
      accept: () => {
        let data = {
          bpmnModelId: bpmNotation.bpmnModelId,
          version: bpmNotation.version,
        };
        this.rest.sendReminderMailToApprover(data).subscribe(
          (res) => {
            // this.messageService.add({severity: "success", summary: "Success", detail: "Reminder sent successfully!",key:'toast2'})
            this.toastService.showSuccess(this.toastMessages.reminderSuccess,'response');
          },
          (err) => {
            // this.messageService.add({severity: "success", summary: "Success", detail: "Oops! Something went wrong.",key:'toast2'})
            this.toastService.showError(this.toastMessages.reminderError);

          }
        );
      }
    });
    // Swal.fire({
    //   title: "Reminder mail",
    //   text:
    //     bpmNotation.bpmnProcessName +
    //     " V1." +
    //     bpmNotation.version +
    //     " reminder mail to " +
    //     bpmNotation.approverName,
    //   icon: "info",
    //   showCancelButton: true,
    //   heightAuto: false,
    //   confirmButtonText: "Send",
    //   cancelButtonText: "Cancel",
    // }).then((res) => {
    //   if (res.isConfirmed) {
    //     let data = {
    //       bpmnModelId: bpmNotation.bpmnModelId,
    //       version: bpmNotation.version,
    //     };
    //     this.rest.sendReminderMailToApprover(data).subscribe(
    //       (res) => {
    //         this.global.notify("Sent reminder successfully", "success");
    //       },
    //       (err) => {
    //         this.global.notify("Oops! Something went wrong", "error");
    //       }
    //     );
    //   }
    // });
  }

  fitNotationView(e) {
    //Fit notation to canvas
    if (e == "dmn") {
      this.bpmnModeler.getActiveViewer().get("canvas").zoom("fit-viewport");
      this.global.notify("Notation is fit to view port", "success");
      return;
    }
    let canvas = this.bpmnModeler.get("canvas");
    canvas.zoom("fit-viewport");
    let msg = "Notation";
    this.global.notify(msg + " is fit to view port", "success");
  }

  deleteProcess(bpmNotation) {
    // e.stopPropagation();
    let status =
      bpmNotation.bpmnProcessStatus == "PENDING"
        ? "PENDING APPROVAL"
        : bpmNotation.bpmnProcessStatus;
      this.confirmationService.confirm({
          message: bpmNotation.bpmnProcessName + " V1." + bpmNotation.version + " in " + status + " status will be deleted",
          header: "Are you sure?",
          rejectLabel: "No",
          acceptLabel: "Yes",
          rejectButtonStyleClass: 'btn reset-btn',
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          rejectIcon: 'null',
          acceptIcon: 'null',
          key:'confirm2',
          accept: () => {
            this.loader.show();
            let data = {
              bpmnModelId: bpmNotation.bpmnModelId,
              version: bpmNotation.version,
            };
            this.rest.deleteBPMNProcess(data).subscribe(
              (res) => {
                this.loader.hide();
                if (
                  res == "It is an ongoing project.Please contact Project Owner(s)"
                ) {
                    // this.messageService.add({severity: "info", summary: "Info", detail: res,key:'toast2'});
                    this.toastService.showInfo(res);
                } else {
                      // this.messageService.add({severity: "success", summary: "Success", 
                      //   detail: bpmNotation.bpmnProcessName + " V1." + bpmNotation.version + " deleted successfully!",key:'toast2'});
                        this.toastService.showSuccess(bpmNotation.bpmnProcessName + " V1." + bpmNotation.version,'delete');   
                      this.loader.show();
                      this.getBPMNList();
                }
              },
              (err) => {
                  this.loader.hide();
                  // this.messageService.add({severity: "error", summary: "Error", detail: "Oops! Something went wrong!",key:'toast2'})
                  this.toastService.showError(this.toastMessages.deleteError);

              }
            );
          }
      });

    // Swal.fire({
    //   title: "Are you sure?",
    //   text:
    //     bpmNotation.bpmnProcessName +
    //     " V1." +
    //     bpmNotation.version +
    //     " in " +
    //     status +
    //     " status will be deleted",
    //   icon: "warning",
    //   showCancelButton: true,
    //   customClass: {
    //     confirmButton: 'btn bluebg-button',
    //     cancelButton:  'btn new-cancelbtn',
    //   },
    //   heightAuto: false,
    //   confirmButtonText: "Delete",
    //   cancelButtonText: "Cancel",
    // }).then((res) => {
    //   if (res.isConfirmed) {
    //     this.loader.show()
    //     let data = {
    //       bpmnModelId: bpmNotation.bpmnModelId,
    //       version: bpmNotation.version,
    //     };
    //     this.rest.deleteBPMNProcess(data).subscribe(
    //       (res) => {
    //         this.loader.hide();
    //         if (
    //           res == "It is an ongoing project.Please contact Project Owner(s)"
    //         ) {
    //           Swal.fire({
    //             icon: "info",
    //             title: "Info",
    //             text: res,
    //             heightAuto: false,
    //           });
    //         } else {
    //           Swal.fire({
    //             icon: "success",
    //             title: "Success",
    //             customClass: {
    //               confirmButton: 'btn bluebg-button',
    //               cancelButton:  'btn new-cancelbtn',
    //             },
    //             text:
    //               bpmNotation.bpmnProcessName +
    //               " V1." +
    //               bpmNotation.version +
    //               " deleted",
    //             heightAuto: false,
    //           });
    //           this.loader.show();
    //           this.getBPMNList();
    //         }
    //       },
    //       (err) => {
    //         this.loader.hide();
    //         Swal.fire({
    //           icon: "error",
    //           title: "Oops...",
    //           customClass: {
    //             confirmButton: 'btn bluebg-button',
    //             cancelButton:  'btn new-cancelbtn',
    //           },
    //           text: "Something went wrong!",
    //           heightAuto: false,
    //         });
    //         this.global.notify('Oops! Something went wrong','error')
    //       }
    //     );
    //   }
    // });
  }

  gotoBPMNPlatform() {
    var token = localStorage.getItem("accessToken");
    let selecetedTenant = localStorage.getItem("tenantName");
    let userId = localStorage.getItem("ProfileuserId");
    let splitTenant: any;
    if (selecetedTenant) {
      splitTenant = selecetedTenant.split("-")[0];
    }
    window.location.href =
      "http://10.11.0.127:8080/camunda/app/welcome/" +
      splitTenant +
      "/#!/login?accessToken=" +
      token +
      "&userID=" +
      userId +
      "&tenentID=" +
      selecetedTenant;
  }

  getNotationStatus(value) {
    if (value == "PENDING") {
      return "PENDING APPROVAL";
    } else if (value == "INPROGRESS") {
      return "In Progress";
    } else {
      return value;
    }
  }

  onEdit(obj) {
    // e.stopPropagation();
    this.isEdit = true;
    this.selectedObj = {
      categoryId:obj.categoryId,
      // category: obj.category,
      bpmnProcessName: obj.bpmnProcessName,
      ntype: obj.ntype,
      id: obj.id,
      bpmnModelId: obj.bpmnModelId,
      processOwner: obj.processOwner,
      version:obj.version
    };
    setTimeout(() => {
      this.isEdit = false;
    }, 500);
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }

  clearTableFilters(table: Table) {
    table.clear();
    this.searchValue ="";
    table.filterGlobal("","")
  }

  onRowExpand() {
    // if(Object.keys(this.expandedRows).length > 1){
    //   // this.isExpanded = true;
    // }
  }

  onRowCollapse() {
    // console.log("row collapsed", Object.keys(this.expandedRows).length);
    if (Object.keys(this.expandedRows).length === 0) {
      // this.isExpanded = false;
    }
  }

  getUsersList() {
    this.dt.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
      this.getBPMNList();
      }
    });
  }

  openDiagramOndoubleClick(rowData) {
    let binaryXMLContent = "";
    // binaryXMLContent = rowData.bpmnXmlNotation;
    let bpmnModelId = rowData.bpmnModelId;
    let bpmnVersion = rowData.version;
    let bpmnType = rowData.ntype;
    // this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
    let push_Obj = {
      rejectedOrApproved: rowData.bpmnProcessStatus,
      isfromApprover: false,
      isShowConformance: false,
      isStartProcessBtn: false,
      autosaveTime: rowData.modifiedTimestamp,
      isFromcreateScreen: false,
      process_name: rowData.bpmnProcessName,
      isEditbtn: false,
      isSavebtn: true,
      selectedNotation: rowData,
    };
    this.dt.bpsNotationaScreenValues(push_Obj);
    this.dt.bpsHeaderValues("");
    this.router.navigate(["/pages/businessProcess/uploadProcessModel"], {
      queryParams: { bpsId: bpmnModelId, ver: bpmnVersion, ntype: bpmnType },
    });
  }

  getUserName(email){
  let user = this.users_list.find(item => item.user_email == email);
  if(user)
    return user["fullName"]
    else
    return '-';
  }
}
