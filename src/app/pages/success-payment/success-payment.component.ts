import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { RestApiService } from '../services/rest-api.service';

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
    this.updateSubscriptiondetails();
  }

  updateSubscriptiondetails(){
    let req_body={}
    this.rest_api.updateSubscriptionDetails(req_body,this.session_id).subscribe((res) => {
      console.log(res)
    })
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
