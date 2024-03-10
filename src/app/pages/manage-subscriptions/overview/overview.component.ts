import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { ConfirmationService, MessageService } from "primeng/api";
import { LoaderService } from "src/app/services/loader/loader.service";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";
import { columnList } from "src/app/shared/model/table_columns";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
  providers:[columnList]
})
export class OverviewComponent implements OnInit {
  plansList: any =[];
  tenantId: string;
  paymentMode: any = [];
  error: string;
  tableData: any = [];
  result: any;
  error1: string;
  email: any;
  due_timestamp: string;
  due_timestamp1: string;
  table_columns:any[]=[];
  table_searchFields:any=[];
  subscrptionsList:any[]=[]
  
  constructor(
    private api: RestApiService,
    private spinner: LoaderService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToasterService,
    private dt:DataTransferService,
    private toastMessages: toastMessages,
    private columns:columnList,
  ) {}

  ngOnInit(): void {
    // this.getCurrentPlan();
    // this.getAllPaymentmodes();
    this.getAllSubscrptions();
    // this.getBillingInfo();
  }

  getCurrentPlan() {
    this.spinner.show();
    this.tenantId = localStorage.getItem("tenantName");
    this.api.getProductPlans("EZFlow", this.tenantId).subscribe((data) => {
      this.plansList = data;
      var plans: any = [];
      var allplans: any;
      allplans = this.plansList;
      allplans.forEach((element) => {
        if (element.subscribed == true) {
          plans = element;
        }
      });
      if (this.plansList == undefined || this.plansList == null) {
        this.error = "Sorry for the inconvenience. We will get back to you shortly.";
      }
      if (plans.subscribed == undefined) {
        this.error = "Sorry for the inconvenience. You don't have any active plans. ";
      }
      this.spinner.hide();
    }),
      (error) => {
        this.error = "Sorry for the inconvenience. We will get back to you shortly.";
      };
  }

  onResubscribe(rowData) {
    this.router.navigate(["/pages/subscriptions/plan"], {
      queryParams: { index: 4 },
    });
  }

  onChangePaymentMethod() {
    this.router.navigate(["/pages/subscriptions/paymentmethod"], {
      queryParams: { index: 3 },
    });
  }
  
  onChangeEmail() {
    this.router.navigate(["/pages/subscriptions/billinginfo"], {
      queryParams: { index: 2 },
    });
  }

  getAllPaymentmodes() {
    this.spinner.show();
    this.api.listofPaymentModes().subscribe((response) => {
      this.paymentMode = response;
      if(this.paymentMode.message=='Billing account not found'){
        this.error1="Billing account not found."
     }
      this.spinner.hide();
    });
  }

  getAllSubscrptions() {
    this.spinner.show();
    this.table_columns= this.columns.subscrption_overview
    this.api.listofsubscriptions().subscribe((response) => {
      console.log(response)
      this.table_searchFields=["planname","plan","amount","term","nextBillingDate","userId","status"]
      this.tableData = response;
      this.tableData.forEach(element => {
        if (element.planEntity) {
          element['planname'] = element.planEntity.nickName;
          element['plan'] = 'Predefined Bots';
          element['amount'] = element.planEntity.amount;
          element['term'] = element.planEntity.term;
        } else {
          element['planname'] = '-';
          element['plan'] = '-';
          element['amount'] = "-";
          element['term'] = "-";
        }

      });
      this.result = this.tableData.filter((obj) => {
        return obj.status == "Active";
      });
      this.due_timestamp = moment(this.result.createdAt).add(1, "years").format("MMMM DD [,] yy")
      this.due_timestamp1 = moment(this.result.createdAt).add(1, "months").format("MMMM DD [,] yy")
      this.spinner.hide();
    });
  }

  subscriptionCancel(item) {
    this.confirmationService.confirm({
      message: "Do you really want to cancel your subscription?",
      header: "Are you sure?",
      key: "positionDialog",
      accept: (result) => {
        this.spinner.show();
        this.api.cancelSubscription(item).subscribe((res) => {
          this.spinner.hide();
          if (res == null) {
            this.toastService.showSuccess(this.toastMessages.cancelSubscription,'response');
            this.getAllSubscrptions()
          }
        },err=>{
          this.toastService.showError(this.toastMessages.cancelErr);
          this.spinner.hide();
        });
      },
    });
  }

  getBillingInfo(){
  this.api.getBillingInfo().subscribe(data=>{
    this.email = data['email']
  })
  }
}
