import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { columnList } from 'src/app/shared/model/table_columns';
import Swal from 'sweetalert2';

import { DataTransferService } from "../../services/data-transfer.service";
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-rpa-approvals',
  templateUrl: './rpa-approvals.component.html',
  styleUrls: ['./rpa-approvals.component.css'],
  providers:[columnList]
})
export class RpaApprovalsComponent implements OnInit {
  approvalsList:any=[];
  columns_list:any=[];
  table_searchFields:any[]=[];
  users_list:any=[];
  isDialogShow:boolean=false
  comments:String="";
  updateData:any={};
  selectedRows:any=[];
  statusType:String="";
  isApprovalInfoShow:boolean=false;
  approvalInfo:String="";
  constructor(
    private rest:RestApiService,
    private columnList: columnList,
    private dt:DataTransferService,
    private spinner: LoaderService,
    ) { }




  ngOnInit(): void {
    this.spinner.show();
    this.columns_list= this.columnList.approval_column;
    this.getUsersList();
  }


  getUsersList() {
    this.dt.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        this.getApprovalList();
      }
    });
  }
  getApprovalList(){
    this.table_searchFields=["botId","runId","approverConvertedName","comments","status","createdAt","createdBy","approvalInfo"]
    let userId:String="";
    if(localStorage.getItem("userRole")=="System Admin")
      userId="SystemAdmin";
    else
      userId=localStorage.getItem("ProfileuserId");
    this.rest.getRPAApprovalsList(userId).subscribe((response:any)=>{ 
      this.spinner.hide();
      this.selectedRows=[]
      if(response.data.length!=0)
      {
        this.approvalsList=response.data.map((item:any)=>{
          if(this.users_list.find((user:any)=>user.userId.userId==item.approverName))
            item["approverConvertedName"]=this.dt.get_username_by_email(this.users_list,item.approverName);
          else
            item["approverConvertedName"]=item.approverName.split("@")[0];
          item["createdBy"]=this.dt.get_username_by_email(this.users_list,item.createdBy);
          return item;
        });
      }
    },err=>{
      console.log(err);
      this.spinner.hide();
      Swal.fire("Error", "Unable to get approvals list", "error");
    })
  }


  onApproveItem(data:any, status:string){
    
    if(data.status==status)
    {
      Swal.fire("Warning","This is already "+status, "warning")
      return;
    }
    if(data.status=="Completed")
    {
      Swal.fire("Warning","Status updating not allowed for completed approvals", "warning")
      return;
    }
    this.statusType=status;
    this.selectedRows=[data];
    this.isDialogShow=true;
  }




  getUserName(emailId){
    this.dt.get_username_by_email(this.users_list,emailId);
  }

  updateApprovalStatus(){
    this.spinner.show();
    let data:any[]=[];
    this.selectedRows.forEach((item:any)=>{
      let obj:any={};
      obj["id"]=item.id;
      obj["approverName"]=item.approverName;
      obj["comments"]=this.comments;
      obj["modifiedBy"]=localStorage.getItem("ProfileuserId");
      obj["status"]=this.statusType;
      data.push(obj);
    });
    this.rest.updateApprovalList(data).subscribe((response:any)=>{
      this.isDialogShow=false;
      Swal.fire("Success", response.status, "success");
      this.selectedRows=[];
      this.comments="";
      this.getApprovalList();
    }, err=>{
      console.log(err);
      Swal.fire("Error", "Unable to update approval", "error");
      this.spinner.hide();
    })
  }

  readSelectedData(selectedRows:any){
   this.selectedRows=selectedRows;
  }

  onApproveRejectItem(statusType){
    
    
    if(this.selectedRows.filter((item:any)=>item.status==statusType).length>0)
    {
      Swal.fire("Warning","In Selected approvals "+this.selectedRows.filter((item:any)=>item.status==statusType).length+" records are already "+statusType, "warning")
    }
    (this.selectedRows.filter((item:any)=>item.status=='Completed').length>0)?Swal.fire("Warning", "Status will not update for completed approvals","warning"):this.isDialogShow=true;
  
    this.statusType=statusType;

  }

  showApprovalInfo(data:any)
  {
    this.approvalInfo=data.approvalInfo;
    this.isApprovalInfoShow=true;
  }


}
