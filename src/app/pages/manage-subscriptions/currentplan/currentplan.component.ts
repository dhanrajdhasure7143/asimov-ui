import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { CryptoService } from "src/app/services/crypto.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import Swal from "sweetalert2";
import { RestApiService } from "../../services/rest-api.service";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";

@Component({
  selector: "app-currentplan",
  templateUrl: "./currentplan.component.html",
  styleUrls: ["./currentplan.component.css"],
})
export class CurrentplanComponent implements OnInit {
  tab: string;
  selected_plans: any = {};
  selected_plansOne: any[];
  plan: any;
  plantype: any;
  public plansList: any;
  public list: any[];
  public productId: any;
  public error = "";
  public test: any;
  tenantId: string;
  newAccessToken: any[];
  userRole: any;
  freetrailAvailed: any;
  remainingDays: any;
  isfreetrail: boolean;
  features: any;
  currentplanname: string;
  getallplans: boolean = false;
  public isdiable: boolean = false;
  public allplans: any = [];
  paymentMode: any;
  paymentToken: any;
  subscriptionDetails: any;
  finalAmount: any;
  validateCoupondata: any;
  totalPay: any;
  taxPercentage: any;
  promo: any;
  revieworder: boolean = false;
  modalRef: BsModalRef;
  private spacialSymbolEncryption: string = "->^<-";
  cardDetails: any;
  name: any;
  freetrail: any;
  listofplans: any[];
  tableData: any;
  expiry: any;

  constructor(
    private api: RestApiService,
    private spinner: LoaderService,
    private modalService: BsModalService,
    private cryptoService: CryptoService,
    private router: Router,
    private toastService: ToasterService,
    private toastMessages: toastMessages
  ) {}

  ngOnInit(): void {
    this.currentplanname = localStorage.getItem("currentplan");
    this.getCurrentPlan();
    //this.getAllPlans();
    this.expiryInfo();
  }

  getCurrentPlan() {
    this.spinner.show();
    this.getallplans = true;
    this.tenantId = localStorage.getItem("tenantName");
    this.api.getProductPlans("EZFlow", this.tenantId).subscribe(
      (data) => {
        this.plansList = data;
        // this.plansList=null;
        this.spinner.hide();
        var plans: any = [];
        var allplans: any;
        allplans = this.plansList;
        allplans.forEach((element) => {
          if (element.subscribed == true) {
            plans = element;
          }
        });

        if (this.plansList == undefined || this.plansList == null) {
          this.error =
            "Sorry for the inconvenience. We will get back to you shortly.";
        }
        if (plans.subscribed == undefined) {
          this.error =
            "Sorry for the inconvenience. You don't have any active plans.";
        }
        if (this.plansList.length > 1) {
          this.plansList = this.plansList.reverse();
        }
        for (var i = 0; i < this.plansList.length; i++) {
          var features = [];
          for (let [key, value] of Object.entries(this.plansList[i].features)) {
            var obj = { name: key, active: value };
            features.push(obj);
          }
          this.plansList[i].features = features;
        }
        for (var a = 0; a < this.plansList[0].features.length - 2; a++) {
          this.plansList[0].features[a].limited = true;
        }
        for (var a = 0; a < this.plansList[1].features.length - 2; a++) {
          this.plansList[1].features[a].limited = true;
        }
        this.plansList[2].features[2].limited = true;
        this.plansList[2].features[3].limited = true;
       // this.plansList[0].amount = 0;
        this.plansList[0].term = "month";
        this.plansList[1].term = "month";
        this.plansList[2].term = "year";
      },
      (error) => {
        this.error = "Sorry for the inconvenience. We will get back to you shortly.";
      }
    );
  }

  getAllPlans() {
    this.plansList.forEach((element) => {
      if (element.nickName !== "Free Tier") {
        this.allplans.push(element);
      }
      this.plansList = this.allplans;
    });
    this.getallplans = true;
  }

  selectedPlan(plans) {
    this.plantype = plans.nickName;
    this.spinner.show();
    this.freetrail = localStorage.getItem("freetrail");
    this.api.listofPaymentModes().subscribe((response) => {
      this.paymentMode = response;
      let result = this.paymentMode.filter((obj) => {
        return obj.defaultSource === true;
      });
      this.cardDetails = result;

      this.tenantId = localStorage.getItem("tenantName");
      this.api.getProductPlans("EZFlow", this.tenantId).subscribe((data) => {
        this.listofplans = data;
        this.listofplans.forEach((obj) => {
          if (obj.active == true || obj.active == "true") {
            if (obj.nickName == this.plantype) {
              this.selected_plans = obj;
              if (this.selected_plans.term == "1year") {
                this.selected_plans.term = "Annual";
              } else {
                this.selected_plans.term = "One Month";
              }
              this.name = this.selected_plans.nickName;
            }
          }
        });
      });

      this.revieworder = true;
      this.spinner.hide();
    });
  }

  buyProductPlan(template) {
    this.isdiable = true;
    var quantity: any;
    const cardValue = {
      name: this.cardDetails[0].name,
      number: "3782 8224 6310 005",
      exp_month: this.cardDetails[0].cardExpMonth,
      exp_year: this.cardDetails[0].cardExpYear,
      cvc: "123",
    };
    if (
      this.selected_plans.nickName == "Standard" ||
      this.selected_plans.nickName == "Professional"
    ) {
      quantity = "0";
    }
    const plandetails = {
      ip: "1.2.3.4",
      promo: this.promo,
      items: [
        {
          meta: {
            orderable: true,
            visible: true,
            plan_id: this.selected_plans.id,
          },
          planId: this.selected_plans.id,
          quantity: quantity,
        },
      ],
      meta: {
        orderable: true,
        visible: true,
        product_id: "EZFlow",
      },
    };

    let encrypt =
      this.spacialSymbolEncryption +
      this.cryptoService.encrypt(JSON.stringify(cardValue));
    let reqObj = { enc: encrypt };
    this.api.getSubscriptionPaymentToken(reqObj).subscribe((res) => {
      this.spinner.show();
      this.paymentToken = res;
      if (this.paymentToken.message == "Failed To Generate Payment Token") {
        this.toastService.showError(this.toastMessages.validCardErr);
        // Swal.fire({
        //   title: "Error",
        //   text: `Invalid card details!`,
        //   position: "center",
        //   icon: "error",
        //   showCancelButton: false,
        //   confirmButtonColor: "#007bff",
        //   cancelButtonColor: "#d33",
        //   heightAuto: false,
        //   confirmButtonText: "Ok",
        // });
        this.spinner.hide();
        this.isdiable = false;
      } else {
        this.api.subscribePlan(this.paymentToken.message, plandetails).subscribe((data) => {
            this.subscriptionDetails = data;
            this.spinner.hide();
            this.finalAmount = this.subscriptionDetails.amountPaid;
            this.productId = "EZFlow";
            this.isdiable = false;
            this.modalRef = this.modalService.show(template);
          });
      }
    });
  }

  close_modal() {
    this.modalRef.hide();
    this.router.navigate(["/pages/home"]).then(() => {
      window.location.reload();
    });
  }
  currentplan() {
    this.allplans = [];
    this.getallplans = false;
  }
  chooseplan() {
    this.getallplans = true;
    this.revieworder = false;
  }
  expiryInfo() {
    this.api.expiryInfo().subscribe((data) => {
      this.expiry = data.Expiresin;
    });
  }

  contactUs() {
      window.open("https://www.epsoftinc.com/");
  }

  loopTrackBy(index, term) {
    return index;
  }
}
