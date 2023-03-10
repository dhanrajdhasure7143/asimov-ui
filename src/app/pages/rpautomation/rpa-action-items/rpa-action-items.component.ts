import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from "sweetalert2";
import { RestApiService } from "../../services/rest-api.service";

@Component({
  selector: "app-rpa-action-items",
  templateUrl: "./rpa-action-items.component.html",
  styleUrls: ["./rpa-action-items.component.css"],
})
export class RpaActionItemsComponent implements OnInit {
  actionTable: any = [];
  representatives: any = [];
  columns_list: any = [];
  addflag: boolean = true;
  delete_flag: boolean = false;
  checkBoxShow: boolean = true;
  selectedId:any;
  updateflag: boolean = false;
  selectedData:any;
  constructor(
    private router:Router,
    private loader:LoaderService,
    private rest_api:RestApiService,
    private route:ActivatedRoute,
    ) 
    {
      this.route.queryParams.subscribe((data)=>{
        this.selectedId = data.id;
        console.log(data.id)
      })
    }


  ngOnInit(): void {
    this.loader.show();
    this.getAllActionItems();
  }

  getAllActionItems() {
    this.rest_api.getActionsByConnectionId(this.selectedId).subscribe((res: any) => {
    this.actionTable = res.data;    
    this.loader.hide();
    this.columns_list = [
      {
        ColumnName: "name",
        DisplayName: "Action Name",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "actionType",
        DisplayName: "Action Type",
        ShowFilter: true,
        ShowGrid: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "url",
        DisplayName: "URL/Root Domain",
        ShowFilter: true,
        ShowGrid: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "type",
        DisplayName: "Method Type",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "attribute",
        DisplayName: "Attributes",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      }
      // {
      //   ColumnName: "attribute",
      //   DisplayName: "Attributes",
      //   ShowGrid: true,
      //   ShowFilter: true,
      //   filterWidget: "normal",
      //   filterType: "text",
      //   sort: true,
      //   multi: false,
      // },
    ];
  })

  }

  viewDetails(event) {}

  deleteById(event) {}

  deleteConnection() {}

  readSelectedData(data) {
    this.selectedData =data;
    this.selectedData.length > 0 ? (this.addflag = false) : (this.addflag = true);
    this.selectedData.length > 0 ? (this.delete_flag = true) : (this.delete_flag = false);
    this.selectedData.length == 1 ? (this.updateflag = true) : (this.updateflag = false);
  }

  updateAction() {
      this.router.navigate(["/pages/rpautomation/connection"],{queryParams:{id:this.selectedData[0].id, name:this.selectedData[0].name, create:false}});
  }

  deleteAction() {
    this.loader.show();
    let selectedId = this.selectedData[0].id;
    this.rest_api.deleteActionById(selectedId).subscribe((res:any)=>{
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Action Deleted Successfully !!",
        heightAuto: false,
      });
      this.getAllActionItems();
      this.loader.hide();
    },(err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        heightAuto: false,
      });
      this.getAllActionItems();
      this.loader.hide();
    })
  }
  
  backToConnection() {
    this.router.navigate(["/pages/rpautomation/configurations"], {
      queryParams: { index: 2 },
    });
  }
  addNewAction(){
    this.router.navigate(['/pages/rpautomation/connection'],{queryParams:{id:this.selectedId, create:true}})
  }
}
