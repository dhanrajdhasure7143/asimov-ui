import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { DataTransferService } from "../../services/data-transfer.service";
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
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
    private toastService: ToasterService,
    private toastMessages: toastMessages
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
    this.table_searchFields=["botId","runId","approverConvertedName","comments","status","createdAt","createdBy","approvalInfo","modifiedBy","modfiedAt"]
    let userId:String="";
    if(localStorage.getItem("userRole")=="System Admin")
      userId="SystemAdmin";
    else
      userId=localStorage.getItem("ProfileuserId");
    this.rest.getRPAApprovalsList(userId).subscribe((response:any)=>{ 
      this.spinner.hide();
      this.selectedRows=[];
      if(response.data.length!=0){
        this.approvalsList=response.data.map((item:any)=>{
          if(this.users_list.find((user:any)=>user.userId.userId==item.approverName))
            item["approverConvertedName"]=this.dt.get_username_by_email(this.users_list,item.approverName);
          else
            item["approverConvertedName"]=item.approverName.split("@")[0];
          item["createdBy"]=this.dt.get_username_by_email(this.users_list,item.createdBy);
          item["modifiedBy"]=this.dt.get_username_by_email(this.users_list,item.modifiedBy);
          item["createdAt"]=item.createdAt?new Date(item.createdAt):null;
          item["modfiedAt"]=item.modfiedAt?new Date(item.modfiedAt):null;
          return item;
        });
      }
    },err=>{
      this.spinner.hide();
      this.toastService.showError(this.toastMessages.apprvrListErr);
    })
  }


  onApproveItem(data:any, status:string){
    
    if(data.status==status)
    {
      this.toastService.showWarn('This is already'+status);
      return;
    }
    if(data.status=="Completed")
    {
      this.toastService.showWarn(this.toastMessages.cmpltedApprvrErr);
      return;
    }
    this.statusType=status;
    this.selectedRows=[data];
    this.comments="";
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
      this.toastService.showSuccess(response.status,'response'); 
      this.selectedRows=[];
      this.comments="";
      this.getApprovalList();
    }, err=>{
      this.toastService.showError(this.toastMessages.apprvlUpdateErr);
      this.spinner.hide();
    })
  }

  readSelectedData(selectedRows:any){
   this.selectedRows=selectedRows;
  }

  onApproveRejectItem(statusType){
    
    
    if(this.selectedRows.filter((item:any)=>item.status==statusType).length>0)
    {
      // this.messageService.add({severity:'warn',summary:'Warning',detail:'In selected approvals '+this.selectedRows.filter((item:any)=>item.status==statusType).length+' records are already '+statusType +'.'})
      this.toastService.showWarn('In selected approvals '+this.selectedRows.filter((item:any)=>item.status==statusType).length+' records are already '+statusType +'!');
      return;
    }
    if(this.selectedRows.filter((item:any)=>item.status=='Completed').length>0){
      // this.messageService.add({severity:'warn',summary:'Warning',detail:'Status will not update for completed approvals.'})
      this.toastService.showWarn(this.toastMessages.statusUpdateErr_apprvls);
    }
    else
    {
      this.statusType=statusType;
      this.isDialogShow=true
      this.comments="";
    }
  }

  showApprovalInfo(data:any)
  {
    this.approvalInfo=data.approvalInfo;
    this.isApprovalInfoShow=true;
  }


}
