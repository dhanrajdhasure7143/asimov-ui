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


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef, private dt: DataTransferService ) { }


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
  }​​​​​​​​
 
  UploadFile(e){​​​​​​​​
  this.dt.bpsHeaderValues(e);
  }​​​​​​​​

  editNotation(){
    this.dt.bpsHeaderValues("edit");
    this.isEditbutton=false;
  }



}
// <i class="fa fa-arrow-left" aria-hidden="true" (click)="route()"></i>&nbsp;&nbsp;&nbsp;
//                   <span class="module-heading-title">Business Process Studio</span>
//                   
