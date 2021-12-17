import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, DoCheck, OnChanges, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../services/data-transfer.service';

@Component({
  selector: 'app-process-intelligence',
  templateUrl: './process-intelligence.component.html',
  styleUrls: ['./process-intelligence.component.css']

})
export class ProcessIntelligenceComponent implements OnInit {
 isShow:boolean  = false;
 isProjDetails = false;
 wpiIdNumber:any;
 isPIHeaderShow:any="true";
 isplay:boolean=false;
 isAddHrs:boolean=false;
 isAddHrs1:boolean=false;
 workingHours:any = {
  formDay:'Mon',
  toDay: 'Sun',
  shiftStartTime:"00:00",
  shiftEndTime:"23:59"
};
workingHours1:any = {
  formDay:'Mon',
  toDay: 'Sun',
  shiftStartTime:"00:00",
  shiftEndTime:"23:59"
};
isBackbutton:boolean=false;
insights_header:boolean=false;
isTimefeed:boolean=true;
btn_obj:any;
userRole: any;
freetrail: string;
  constructor(private changeDetectorRef:ChangeDetectorRef,
    private router:Router,
    private route: ActivatedRoute,
    private dt:DataTransferService) { 
   
  
  }

  ngOnInit() {
    $('.link').removeClass('active');
    $('#pi').addClass("active"); 
    $('#expand_menu').addClass("active");  
    this.userRole = localStorage.getItem("userRole")
    this.freetrail=localStorage.getItem("freetrail")
  }

 ngAfterViewChecked(){

    let windowUrl = window.location.href;
    if(windowUrl.indexOf('insights') == -1){
      this.isShow=false;
    this.dt.pi_buttonValues(null);

    } else{
      this.isShow=true;
  }



  if(windowUrl.indexOf('flowChart') == -1){
    this.isPIHeaderShow=false;
    this.isplay=false;
    this.isAddHrs=false;
      let element=document.getElementById("tipsy_div");
      if(element){
        element.style.display = "none";
        element.style.visibility = "hidden";
      }
    this.workingHours = {formDay:'Mon',toDay: 'Sun',shiftStartTime:"00:00",shiftEndTime:"23:59"};
  } else{
    this.isPIHeaderShow = true;
    if(localStorage.getItem('project_id')!="null"){
      this.isProjDetails = true;
      this.isPIHeaderShow = false;
    }
  }
if(windowUrl.indexOf('processIntelligence/insights') != -1||windowUrl.indexOf('business-insights') !=-1){
  this.isBackbutton=true;
  this.isProjDetails=false;
} else{
  this.isBackbutton=false;
}
if(windowUrl.indexOf('processIntelligence/insights') != -1){
  this.insights_header=true;
  this.isProjDetails=false;
} else{
  this.insights_header=false;
}
  this.route.queryParams.subscribe(params => {
    if(params['wpid']!=undefined){
        this.wpiIdNumber = parseInt(params['wpid']);
      }
      if(params['wpiId']!=undefined){
        this.wpiIdNumber = parseInt(params['wpiId']);
      }
      if(params['piId']!=undefined){
        this.wpiIdNumber = parseInt(params['piId']);
      }
    });
    
  this.changeDetectorRef.detectChanges();

 }

 ngAfterViewInit(){
   this.dt.pi_btnChanges.subscribe(res=>{this.btn_obj=res
     if(res){
     this.isplay=this.btn_obj.isPlaybtn;
    //  this.isTimefeed=this.btn_obj.isTimefeed_btn
     }
  });
 }

 gotoProcessgraph(){
  this.router.navigate(["/pages/processIntelligence/flowChart"],{queryParams:{wpiId:this.wpiIdNumber}})
}

gotoProjectDetails(){
  this.router.navigate(["/pages/projects/projectdetails"], 
   {queryParams:{"id":localStorage.getItem('project_id')}})
}

downloadNotaton(e){
  this.dt.piHeaderValues(e);
}

playAnimation(){
  this.dt.piHeaderValues('play_graph');
  this.isplay=!this.isplay;
}

viewInsights(){
  this.router.navigate(["/pages/processIntelligence/insights"],{queryParams:{wpid:this.wpiIdNumber}});
}

viewbusinessinsights(){
  this.router.navigate(["/pages/processIntelligence/business-insights"],{queryParams:{wpid:this.wpiIdNumber}})
}

generateBpmn(){
  this.dt.piHeaderValues('bpmn');
}

openVariantListNav(){
    let element=document.getElementById("tipsy_div");
    if(element){
      element.style.display = "none";
      element.style.visibility = "hidden";
    }
  this.dt.piHeaderValues('variant_list');
}

openHersOverLay(){
  this.isAddHrs=!this.isAddHrs;
  let element=document.getElementById("tipsy_div");
  if(element){
    element.style.display = "none";
    element.style.visibility = "hidden";
  }
}

canceladdHrs(){ //close timefeed popup 
  this.isAddHrs=!this.isAddHrs;
}

addWorkingHours(){
  this.dt.piHeaderValues(this.workingHours);
  this.isAddHrs=!this.isAddHrs;
}

 resetWorkingHours(){ //working hours reset in timffed   
  this.workingHours.formDay = "Mon";
  this.workingHours.toDay = "Sun";
  this.workingHours.shiftStartTime="00:00";
  this.workingHours.shiftEndTime="23:59"
 }

 openinsightsHrsOverLay(){
  this.isAddHrs1=!this.isAddHrs1
 }

 cancelinsightsaddHrs(){ //close timefeed popup 
  this.isAddHrs1=!this.isAddHrs1;
 }

  openInsightsVaraintOverLay(){
    this.dt.process_insightsHeaderValues("open_Varaint");
  }

  addWorkingHrsInsights(){
    this.dt.process_insightsHeaderValues(this.workingHours1);
    this.isAddHrs1=!this.isAddHrs1;
  }

  resetWorkingHours1(){ //working hours reset in timffed   
    this.workingHours1.formDay = "Mon";
    this.workingHours1.toDay = "Sun";
    this.workingHours1.shiftStartTime="00:00";
    this.workingHours1.shiftEndTime="23:59"
   }
   backtoWorkspace(){
     this.router.navigate(['/pages/processIntelligence/upload'])
   }

   ngOnDestroy(){
    // localStorage.setItem("pi_search_category",'allcategories')
   }

}

// <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>