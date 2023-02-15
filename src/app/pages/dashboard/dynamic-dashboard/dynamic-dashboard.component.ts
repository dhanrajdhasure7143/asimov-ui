import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';



@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.css']
})
export class DynamicDashboardComponent implements OnInit {
  display: boolean = false;
  text: String='';
 


  constructor(private primengConfig: PrimeNGConfig,private router: Router) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  BasicShow: boolean = false;
  
  showDialog() {
      this.BasicShow = true;
      
  }
  navigateconfigure(){
    this.router.navigate(["pages/dashboard/configure-dashboard"],{queryParams:{dashboardName:this.text}});
  }

  }


