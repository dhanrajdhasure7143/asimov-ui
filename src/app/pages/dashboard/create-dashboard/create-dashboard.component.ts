import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { RestApiService } from '../../services/rest-api.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {
  display: boolean = false;
  entered_name: String='';
  displayModal: boolean = false;
  dashbordlist:any[]=[];

  constructor(private primengConfig: PrimeNGConfig,
    private router: Router,
    private rest:RestApiService,
    private toastService: ToasterService
    ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  
  showModalDialog() {
      this.displayModal = true;
  }

  navigateconfigure() {
    let req_data = {
      "dashboardName": this.entered_name,
      "defaultDashboard": false,
      "firstName": localStorage.getItem("firstName"),
      "lastName": localStorage.getItem("lastName"),
    }
    this.rest.createDashBoard(req_data).subscribe((response: any) => {
      if(response.code == 4200){
        let res_data = response.data
        this.router.navigate(["pages/dashboard/configure-dashboard"], { queryParams: {dashboardId:res_data.id,dashboardName:res_data.dashboardName,isCreate:1}});
      }
      if(response.code == 8010){
        this.toastService.showError(response.message+'!');
      }
    })
  }
}
