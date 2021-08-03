import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTransferService } from '../services/data-transfer.service';
@Component({
  selector: 'app-bussiness-process',
  templateUrl: './business-process.component.html' ,
  styleUrls: ['./business-process.component.css']
})
export class BusinessProcessComponent implements AfterViewChecked {

  isHeaderShow: any;
  isShowConformance: boolean = false;
  selectedNotationType:any;
  rejectedOrApproved:any;
  isfromApprover:any;
  isEditbutton: boolean = true;
  isEditMode:boolean=false;
  updated_date_time:any;
  isSave_disabled:boolean=true;
  iscreate_notation:boolean;
  isStartProcessBtn:boolean=false;
  currentNotation_name:any;
  userRole;
  isApproverUser:boolean = false;
  logged_User:any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef, private dt: DataTransferService ) { }

  ngOnInit(){
    localStorage.setItem("isheader","false");
    this.logged_User=localStorage.getItem("firstName")+' '+localStorage.getItem("lastName")
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isApproverUser = this.userRole.includes('Process Architect')
  }
  ngAfterViewChecked() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.isShowConformance = params['isShowConformance'] == 'true';
      this.selectedNotationType = params['ntype'];


    });
    this.isHeaderShow = localStorage.getItem("isheader");
    this.cdRef.detectChanges();
  }
  ngAfterViewInit(){
    this.dt.notation_ScreenValues.subscribe(res=>{
      console.log(res);
      let notationValues_obj={}
      notationValues_obj=res;
      if(notationValues_obj){
        this.rejectedOrApproved=notationValues_obj['rejectedOrApproved'];
        this.isfromApprover=notationValues_obj['isfromApprover'];
        this.updated_date_time=notationValues_obj['autosaveTime'];
        this.iscreate_notation=notationValues_obj['isFromcreateScreen'];
        this.isStartProcessBtn=notationValues_obj['isStartProcessBtn'];
        this.currentNotation_name=notationValues_obj['process_name'];
      }
    });
  }

  route() {
    this.router.navigate(['/pages/home']);
  }
  downloadNotaton(e){​​​​​​​​
  this.dt.downloadNotationValue(e)
  }​​​​​​​​
 
  zoomIn(){​​​​​​​​
  this.dt.bpsHeaderValues("zoom_in");
  }​​​​​​​​
 
  zoomOut(){​​​​​​​​
  this.dt.bpsHeaderValues("zoom_out");
  }​​​​​​​​
 
  saveProcess(){​​​​​​​​
  this.dt.bpsHeaderValues("save_process");
  this.isEditbutton=true;
  this.isEditMode=false;
  this.isSave_disabled=true;
  }​​​​​​​​
  saveProcessCreate(){​​​​​​​​
    this.dt.bpsHeaderValues("save_process");
    }
 
  UploadFile(e){​​​​​​​​
  this.dt.bpsHeaderValues(e);
  }​​​​​​​​

  editNotation(){
    this.dt.bpsHeaderValues("edit");
    this.isEditbutton=false;
    this.isEditMode=true;
    this.isSave_disabled=false;
  }
  saveandSubmitApproval(){
    this.dt.bpsHeaderValues("save&approval");
    this.isEditMode=false;
    this.isSave_disabled=true;
  }
  saveandSubmitApprovalCreat(){
    this.dt.bpsHeaderValues("save&approval");
  }
  orchestartion(){
    this.dt.bpsHeaderValues("orchestartion");
  }
 deployNotation(){
    this.dt.bpsHeaderValues("deploy");
  }
  startProcess(){
    this.dt.bpsHeaderValues("startProcess");
  }
  fitNotation(){
    this.dt.bpsHeaderValues("fitNotation");
  }
  backtoNavigate(){
    this.router.navigate(['/pages/businessProcess/home'])
  }

  gotoBPMNPlatform() {
    var token = localStorage.getItem('accessToken');
    let selecetedTenant =  localStorage.getItem("tenantName");
    let userId = localStorage.getItem("ProfileuserId");
    let splitTenant:any;
    if(selecetedTenant){
       splitTenant = selecetedTenant.split('-')[0];
    }
    window.location.href = "http://10.11.0.127:8080/camunda/app/welcome/"+splitTenant+"/#!/login?accessToken=" + token + "&userID="+userId+"&tenentID="+selecetedTenant;
  }

}
