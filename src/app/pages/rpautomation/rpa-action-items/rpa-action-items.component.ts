import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { LoaderService } from 'src/app/services/loader/loader.service';
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
  selectedName: any;
  table_searchFields:any[]=[];
  selectedIcon: any;
  action_Id:any;
  userRole:any=[]
  // actionVisible:boolean=true;

  constructor(
    private router:Router,
    private loader:LoaderService,
    private rest_api:RestApiService,
    private route:ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) 
    {
      this.route.queryParams.subscribe((data)=>{
        this.selectedId = data.id;
        this.selectedName = data.name
        this.selectedIcon = data.icon
      })
    }


  ngOnInit(): void {
    this.loader.show();
    this.getAllActionItems();
     this.userRole = localStorage.getItem("userRole");
    // this.userRole = this.userRole.split(','); this.actionVisible = this.userRole.includes('Process Owner') || this.userRole.includes('RPA Developer') ;
  }

  getAllActionItems() {
    this.rest_api.getActionsByConnectionId(this.selectedId).subscribe((res: any) => {
    this.actionTable = res.data; 
    this.readSelectedData([]); 
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
        ColumnName: "endPoint",
        DisplayName: "URL/Root Domain",
        ShowFilter: true,
        ShowGrid: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "methodType",
        DisplayName: "Method Type",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "actionLogo",
        DisplayName: "Action Logo",
        ShowGrid: true,
        ShowFilter: false,
        filterWidget: "normal",
        filterType: "text",
        sort: false,
        multi: false,
      },
      {
        ColumnName: "action",
        DisplayName: "",
        ShowGrid: true,
        ShowFilter: false,
        sort: false,
        multi: false,
      },
    ];
    this.table_searchFields=["name","actionType","endPoint","methodType"];
  })

  }

  viewDetails(event) {
    let actionID = event.id
    this.router.navigate(["/pages/rpautomation/connection"],{queryParams:{action_Id:actionID, id:this.selectedId, name:event.name, connector_name : this.selectedName, logo : this.selectedIcon, create:false, formDisabled : true}});
  }

    deleteById(event) {
      this.loader.show();
      let selectedId = event.id;
      this.confirmationService.confirm({
        message: "Are you sure? You won't be able to revert this!",
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.loader.show();
          this.rest_api.deleteActionById(selectedId).subscribe((res:any)=>{
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Action Deleted Successfully !!",
            })
            this.loader.hide();
            this.getAllActionItems();
          },(err) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something Went Wrong !!",
            })
            this.loader.hide();
            this.getAllActionItems();
          })
        },
        reject: (type) => {
          this.loader.hide();
        },
        key: "positionDialog"
      });
    }

  deleteConnection() {}

  readSelectedData(data) {
    this.selectedData =data;
    this.selectedData.length > 0 ? (this.addflag = false) : (this.addflag = true);
    this.selectedData.length == 1 ? (this.delete_flag = true) : (this.delete_flag = false);
    this.selectedData.length == 1 ? (this.updateflag = true) : (this.updateflag = false);
  }

  // updateAction() {
  //     this.router.navigate(["/pages/rpautomation/connection"],{queryParams:{action_Id:this.selectedData[0].id,id:this.selectedId, name:this.selectedData[0].name, connector_name : this.selectedName, create:false, formDisabled : true}});
  // }

  deleteAction() {
    this.loader.show();
    const selectedId = this.selectedData[0].id;
    this.confirmationService.confirm({
      message: "Are you sure? Do you want to delete this Action-Item !",
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.rest_api.deleteActionById(selectedId).subscribe(
          () => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Action Deleted Successfully !!",
            });
            this.loader.hide();
            this.getAllActionItems();
          },
          () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something Went Wrong !!",
            });
            this.loader.hide();
            this.getAllActionItems();
          }
        );
      },
      reject: () => {
        this.loader.hide();
      },
      key: "positionDialog"
    });
  }
  
  backToConnection() {
    this.router.navigate(["/pages/rpautomation/configurations"], {
      queryParams: { index: 2 },
    });
  }

  addNewAction(){
    this.router.navigate(['/pages/rpautomation/connection'],{queryParams:{id:this.selectedId, connector_name : this.selectedName, logo : this.selectedIcon ,create:true}})
  }
}
