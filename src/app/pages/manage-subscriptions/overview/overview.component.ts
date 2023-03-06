import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { ConfirmationService, MessageService } from "primeng/api";
import { LoaderService } from "src/app/services/loader/loader.service";
import { RestApiService } from "../../services/rest-api.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {
  plansList: any;
  tenantId: string;
  paymentMode: any = [];
  error: string;
  tableData: any = [];
  result: any;

  constructor(
    private api: RestApiService,
    private spinner: LoaderService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCurrentPlan();
    this.getAllPaymentmodes();
    this.getAllSubscrptions();
  }

  getCurrentPlan() {
    this.spinner.show();
    this.tenantId = localStorage.getItem("tenantName");
    this.api.getProductPlans("EZFlow", this.tenantId).subscribe((data) => {
      this.plansList = data;
      this.plansList.map((data) => {
        data["due_timestamp"] = moment(data.createdAt * 1000)
          .add(1, "years")
          .format("MMMM DD [,] yy");
        data["due_timestamp1"] = moment(data.createdAt * 1000)
          .add(1, "months")
          .format("MMMM DD [,] yy");
        return data;
      });
      var plans: any = [];
      var allplans: any;
      allplans = this.plansList;
      allplans.forEach((element) => {
        if (element.subscribed == true) {
          plans = element;
        }
      });
      if (this.plansList == undefined || this.plansList == null) {
        this.error = "Sorry for inconvenience we will get back to you shortly";
      }
      if (plans.subscribed == undefined) {
        this.error = "Sorry for inconvenience you don't have any active plans";
      }
      this.spinner.hide();
    }),
      (error) => {
        this.error = "Sorry for inconvenience we will get back to you shortly";
      };
  }

  onChangePlan() {
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
      this.spinner.hide();
    });
  }

  getAllSubscrptions() {
    this.spinner.show();
    this.api.listofsubscriptions().subscribe((response) => {
      this.tableData = response;
      this.result = this.tableData.filter((obj) => {
        return obj.status == "Active";
      });
      this.spinner.hide();
    });
  }

  subscriptionCancel() {
    this.confirmationService.confirm({
      message: "Are you sure that you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      key: "positionDialog",
      accept: (result) => {
        this.spinner.show();
        this.api.cancelSubscription(this.result[0]).subscribe((res) => {
          this.spinner.hide();
          if (res == null) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Subscription Cancelled Successfully !!",
            });
          }
        });
      },
    });
  }
}
