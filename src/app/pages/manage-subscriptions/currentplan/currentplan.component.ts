import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-currentplan',
  templateUrl: './currentplan.component.html',
  styleUrls: ['./currentplan.component.css']
})
export class CurrentplanComponent implements OnInit {

  tab: string;
  selected_plans: any[];
  selected_plansOne: any[];
  plan: any;
  plantype: any;
  public plansList: any;
  public list: any[];
  public productId: any;
  public error = '';
  public test: any;
  tenantId: string;
  newAccessToken: any[];
  userRole: any;
  freetrailAvailed: any;
  remainingDays: any;
  isfreetrail: boolean;
  features: any
  currentplanname: string;
  constructor(
    private api: RestApiService, private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.currentplanname=localStorage.getItem('currentplan')
    this.getAllPlans();
  }


  getAllPlans() {
    this.spinner.show();
    this.tenantId = localStorage.getItem('tenantName');
    this.api.getProductPlans("EZFlow", this.tenantId).subscribe(data => {
      this.plansList = data
      // this.plansList=null;
      this.spinner.hide();
      if (this.plansList == undefined || this.plansList == null) {
        this.error = 'Sorry for inconvenience we will get back to you shortly'
      }
      if(this.plansList.length > 1){
        this.plansList=this.plansList.reverse();
      }
          for(var i=0; i<this.plansList.length; i++){
          var features=[];
          for (let [key, value] of Object.entries(this.plansList[i].features)) {
            var obj={'name':key,'active':value}
            features.push(obj)  
          }
          this.plansList[i].features=features;
        }
        for(var a=0; a<this.plansList[0].features.length-2; a++){
            this.plansList[0].features[a].limited=true
        }
        for(var a=0; a<this.plansList[1].features.length-2; a++){
          this.plansList[1].features[a].limited=true
        }
          this.plansList[2].features[2].limited=true;
          this.plansList[2].features[3].limited=true;
      this.plansList[0].amount = 0;
      this.plansList[0].term='month';
      this.plansList[1].term='month';
      this.plansList[2].term='year';
      // if(localStorage.getItem('userRole').includes('user') && !localStorage.getItem('selectedplan').includes('Professional') && !localStorage.getItem('selectedplan').includes('Standard')){
      //   this.plansList[0].subscribed=true;
      // } else if(localStorage.getItem('userRole').includes('Admin') && localStorage.getItem('selectedplan')!=null && localStorage.getItem('selectedplan').includes('Professional')){
      //   this.plansList[2].subscribed=true;
      // } else if(localStorage.getItem('userRole').includes('Admin') && localStorage.getItem('selectedplan').includes('Standard')){
      //   this.plansList[1].subscribed=true;
      // }
      
      },error=>{
        this.error='Sorry for inconvenience we will get back to you shortly'
      });

  }
}
