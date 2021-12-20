import { Component, AfterViewChecked, ChangeDetectorRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTransferService } from '../services/data-transfer.service';
import { RestApiService } from '../services/rest-api.service';
import { APP_CONFIG } from 'src/app/app.config';
import Swal from 'sweetalert2';
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
  iscreate_notation:boolean=false;
  isStartProcessBtn:boolean=false;
  currentNotation_name:any;
  userRole;
  isApproverUser:boolean = false;
  logged_User:any;
  approver_list:any[] = [];
  selected_approver:any;
  hasConformance:boolean = false;
  reSize:boolean=false;
  process_id:any;
  systemAdmin:Boolean=false;
  isUploaded:boolean=false;
  freetrail: string;
  processowner_list:any[]=[];
  process_owner:any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef, private dt: DataTransferService,private rest:RestApiService,
              @Inject(APP_CONFIG) private config, ) { }

  ngOnInit(){
    $('.link').removeClass('active');
    $('#bps').addClass("active"); 
    $('#expand_menu').addClass("active");   
    localStorage.setItem("isheader","false");
    this.logged_User=localStorage.getItem("firstName")+' '+localStorage.getItem("lastName")
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isApproverUser = this.userRole.includes('Process Architect')||this.userRole.includes('Process Owner');
    this.systemAdmin=this.userRole.includes("System Admin")
    this.getApproverList();
    this.freetrail=localStorage.getItem("freetrail")
  }

  ngAfterViewChecked() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.isShowConformance = params['isShowConformance'] == 'true';
      this.selectedNotationType = params['ntype'];
      this.process_id=params['pid'];


    });
    if(this.isUploaded){
      this.selectedNotationType='bpmn'
    }
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
        // if(notationValues_obj['isEditbtn'])
        this.isEditMode=notationValues_obj['isEditbtn'];
        this.isSave_disabled=notationValues_obj['isSavebtn'];
        this.hasConformance=notationValues_obj['hasConformance'];
        this.reSize=notationValues_obj['resize'];
        this.isUploaded=notationValues_obj['isUploaded'];
        if(this.isUploaded){
          this.selectedNotationType='bpmn'
        }
        console.log(this.iscreate_notation)
      }
    });
  }
  //  async getApproverList(){
  //   await this.rest.getApproverforuser('Process Architect').subscribe( res =>  {
  //    if(Array.isArray(res))
  //      this.approver_list = res;
  //  });
  // }

  async getApproverList(){
    let roles={
      "roleNames": ["Process Owner","Process Architect"]
    
    }
    await this.rest.getmultipleApproverforusers(roles).subscribe( res =>  {//Process Architect
      if(Array.isArray(res))
       this.approver_list = res;
   });

   let roles1={
    "roleNames": ["Process Owner"]
  }
  await this.rest.getmultipleApproverforusers(roles1).subscribe( res =>  {//Process Architect
    if(Array.isArray(res))
     this.processowner_list = res;
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
    if(localStorage.getItem('project_id')!="null"){
      this.router.navigate(["/pages/projects/projectdetails"], 
      {queryParams:{"id":localStorage.getItem('project_id')}})
    } else{
      this.router.navigate(['/pages/businessProcess/home'])
    }
  }

  backtoApprovalWorkflow(){
    this.router.navigate(['/pages/approvalWorkflow/home'])
  }

  backtoPI(){
    this.router.navigate(["/pages/processIntelligence/flowChart"],{queryParams:{wpiId:this.process_id}})
  }

  gotoBPMNPlatform() {
    var token = localStorage.getItem('accessToken');
    let selecetedTenant =  localStorage.getItem("tenantName");
    let userId = localStorage.getItem("ProfileuserId");
    let splitTenant:any;
    if(selecetedTenant){
       splitTenant = selecetedTenant.split('-')[0];
    }
    let navigateBackTo=this.router.url;
    //   window.location.href = this.config.camundaUrl+"/camunda/app/welcome/"+splitTenant+"/#!/login?accessToken=" + token + "&userID="+userId+"&tenentID="+selecetedTenant;
    //   // window.location.href = "http://10.11.0.127:8080/camunda/app/welcome/"+splitTenant+"/#!/login?accessToken=" + token + "&userID="+userId+"&tenentID="+selecetedTenant;
    // }
    window.location.href = this.config.camundaUrl+"/camunda/app/welcome/"+splitTenant+"/#!/login?accessToken=" + token + "&userID="+userId+"&tenentID="+selecetedTenant+"&navigate_back="+navigateBackTo;
  }

  saveandSubmit(){
    let obj
    if(this.isShowConformance){
      if(!this.process_owner){
        Swal.fire({
          icon: 'error',
          text: 'Please select process owner !',
          heightAuto: false,
        });
        return;
      }
      obj={id:"submit",selectedApprovar:this.selected_approver,processOwner:this.process_owner}
    }else{
      obj={id:"submit",selectedApprovar:this.selected_approver}
    }
    this.dt.submitForApproval(obj)
  }

  showConformance(){
    this.dt.bpsHeaderValues("show_conformance");
  }

  getBpmnDifferences(){
    this.dt.bpsHeaderValues("getBpmn_differences");

  }
  onsaveOverlayOpen(){
    if(this.selected_approver){
      this.selected_approver=null;
    }

  }

}
