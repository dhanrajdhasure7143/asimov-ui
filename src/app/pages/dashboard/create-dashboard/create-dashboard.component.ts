import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { RestApiService } from '../../services/rest-api.service';
@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {
  display: boolean = false;
  entered_name: String='';
  isDialogShow: boolean = false;
  dashbordlist:any[]=[];

  constructor(private primengConfig: PrimeNGConfig,
    private router: Router,
    private rest:RestApiService,
    private messageService : MessageService) 
    {
      // this.rest.getDashBoardsList().subscribe((data:any)=>{
      //   this.dashbordlist=data.dataList;
      //   let defaultDashBoard = this.dashbordlist.find(item=>item.defaultDashboard == true);
      //   console.log( "this.dashbordlist",this.dashbordlist)
      //   console.log( "defaultDashBoard",defaultDashBoard)
      //   this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: {dashboardId:defaultDashBoard.id,dashboardName:defaultDashBoard.dashboardName}})
      // })
     }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  
  showDialog() {
      this.isDialogShow = true;
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
      if(response.errorCode == 8010){
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: response.errorMessage+' !',
        });
      }
    })
  }
}
