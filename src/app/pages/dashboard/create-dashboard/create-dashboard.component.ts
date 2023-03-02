import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { RestApiService } from '../../services/rest-api.service';
@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {
  display: boolean = false;
  text: String='';
  BasicShow: boolean = false;

  constructor(private primengConfig: PrimeNGConfig,private router: Router,private rest:RestApiService) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  
  showDialog() {
      this.BasicShow = true;
  }

  navigateconfigure() {
    // this.rest.getDashBoardsList().subscribe((data:any)=>{
    //   console.log('DashBoard Details particular detail ',data)
    //       })
    let req_data = {
      "dashboardName": this.text,
      "defaultDashboard": false,
      "firstName": localStorage.getItem("firstName"),
      "lastName": localStorage.getItem("lastName"),
    }
    this.rest.createDashBoard(req_data).subscribe((data: any) => {
      console.log('create data', data);
      this.router.navigate(["pages/dashboard/configure-dashboard"], { queryParams: { dashboardName: this.text } });
    })
  }
}
