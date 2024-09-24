import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { RestApiService } from '../services/rest-api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { PredefinedBotsService } from '../services/predefined-bots.service';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.css']
})
export class SuccessPaymentComponent implements OnInit {
  public countdown: number = 5;
  public session_id: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rest_api: RestApiService,
    private toaster: ToasterService,
    private rest_api_pred: PredefinedBotsService
  ) { 
    this.route.queryParams.subscribe(params => {
      if(params && params.session_id){
        this.session_id = params.session_id;
      }
      console.log(params.session_id)
    });
  }

  ngOnInit(): void {
    this.startCountdown();
    if (environment.isWebhookEnabled) {
      this.updateSubscriptionDetailsWebhook();
    } else {
      this.updateSubscriptiondetails();
    }
  }

  updateSubscriptiondetails(){
    let req_body={}
    this.rest_api.updateSubscriptionDetails(req_body,this.session_id).subscribe((res) => {
      console.log(res)
    })
  }

  updateSubscriptionDetailsWebhook() {
    const userid = localStorage.getItem('ProfileuserId');
    if (userid) {
      this.rest_api_pred.updateSubscriptionDetailsWebhook(userid).subscribe((res: any) => {
          console.log('updateSubscriptionDetailsNew-response', res);
          if (res.code === 4400) {
            console.log('Subscription updated successfully.');
          } else {
            let errorMessage = '';
            const supportMail = 'support@epsoftinc.com';
            switch (res.code) {
              case 4001:
                errorMessage = 'We’re experiencing an issue with your subscription, which may be due to a network error or payment processing issue. Please contact customer support at ';
                break;
              case 4002:
                errorMessage = 'We’re experiencing an issue with your subscription, which may be due to a network error or payment processing issue. Please contact customer support at ';
                break;
              case 4003:
                errorMessage = 'We’re experiencing an issue with your subscription, which may be due to a network error or payment processing issue. Please contact customer support at ';
                break;
              case 4004:
                errorMessage = 'We’re experiencing an issue with your subscription, which may be due to a network error or payment processing issue. Please contact customer support at ';
                break;
              default:
                errorMessage = 'We’re experiencing an issue with your subscription, which may be due to a network error or payment processing issue. Please contact customer support at ';
                break;
            }
            Swal.fire({
              title: 'Oops!',
              html: `<div>
                       <strong>Error Code:</strong> ${res.code} <br>
                       ${errorMessage}<strong>${supportMail}</strong> for assistance.
                     </div>`,
              icon: 'info',
              showCancelButton: false,
              allowOutsideClick: false,
            });
          }
        },
        (error) => {
          this.toaster.showError("Something went wrong, Please contact support.");
        }
      );
    } else {
      this.toaster.showError("User ID not Found");
    }
  }
  

  startCountdown(){
    interval(1000).pipe(
      take(this.countdown)
    ).subscribe(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.router.navigate(['/pages/aiagent/home']);
      }
    });
  }

}
