import { Component, OnInit, Output, EventEmitter, Input, HostListener, ViewChild, SimpleChanges, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalScript } from '../global-script';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from '../service/toaster.service';

@Component({
  selector: 'process-category-overlay',
  templateUrl: './process-category-overlay.component.html',
  styleUrls: ['./process-category-overlay.component.css']
})
export class ProcessCategoryOverlayComponent implements OnInit {

  @Input() headerTitle:string = "Process Category Details";
  @Input() buttonName:string = "Proceed";
  @Input() data:string;
  @Output() proceed = new EventEmitter<any>();
  @Output() closeOverlay = new EventEmitter<any>();
  @Input() uploadedFileName?:string;
  @Input() overlay_data:any={};
  processCategoryForm:any;

  processName = "";
  categoryName = "";
  othercategory = "";
  isotherCategory:boolean=false;
  categoriesList:any=[];
  botName = "";
  botType = "";
  botDescription = "";
  notationType = "";
  isBpmnModule: boolean = false;
  uploadedFileSplit:any=[];
  uploadedFileExtension:string;
  count:number=0;
  categories_list:any[]=[];
  approver_list:any[]=[];
  process_owner:any;
  process_name_error:boolean=false;
  freetrail: string = "false"
  isLoading:boolean=false;
  isValidName:boolean=false;
  notationsTypes=[{type:"BPMN",id:"bpmn"},{type:"CMMN",id:"cmmn"},{type:"DMN",id:"dmn"}];
  @ViewChild('processCategoryForm', {static: true}) processForm: NgForm;
  constructor( private rest:RestApiService, private activatedRoute: ActivatedRoute, private global:GlobalScript,
    private cdRef: ChangeDetectorRef, private dt: DataTransferService,
    private toastService: ToasterService,
    private confirmationService: ConfirmationService,) { }

  ngOnChanges(changes: SimpleChanges) {
    if(this.overlay_data.type=="edit"){
      this.isValidName=false;
      if(this.overlay_data.module=="pi"){
        // this.categoryName=this.overlay_data.selectedObj.categoryName;
        this.categoryName=this.overlay_data.selectedObj.categoryId;
        this.processName=this.overlay_data.selectedObj.piName;
      }else{
        // this.categoryName=this.overlay_data.selectedObj.category;
        this.categoryName=this.overlay_data.selectedObj.categoryId;
        this.notationType=this.overlay_data.selectedObj.ntype;
        this.processName=this.overlay_data.selectedObj.bpmnProcessName;
        this.approver_list.forEach((e,i)=>{
          if(this.overlay_data.selectedObj.processOwner==e.userId){
            this.process_owner=i;
          }
        })
      }
    }else{
    if(this.overlay_data.component == 'vcm'){
      this.notationsTypes=[{type:"BPMN",id:"bpmn"},{type:"DMN",id:"dmn"}];
    }
      if(this.activatedRoute.snapshot['_routerState'].url.includes('businessProcess') || this.activatedRoute.snapshot['_routerState'].url.includes('vcm')){
        this.isBpmnModule = true;
      }
      this.processName='';
      this.categoryName=undefined;
      this.isValidName=false;
      if(this.overlay_data.module !="pi"){
        this.process_owner=undefined;
        this.notationType='';
        if(this.overlay_data.ntype){
          this.notationType=this.overlay_data.ntype
        }
      }
    }
    this.uploadedFileExtension= undefined;
  if(changes['uploadedFileName']){
    let change = changes['uploadedFileName'];
    if(!change.firstChange){
      this.uploadedFileName = change.currentValue;
      this.uploadedFileSplit = this.uploadedFileName.split('.');
      this.uploadedFileExtension = this.uploadedFileSplit[this.uploadedFileSplit.length - 1];
      this.notationType = this.uploadedFileExtension;
    }
  }
  }

  ngAfterViewChecked(){
    if(this.categories_list.length==1){
      // this.categoryName=this.categories_list[0].categoryName
      this.categoryName=this.categories_list[0].categoryId
    }
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    if(this.data){
      let data_arr = this.data.split("@");
      this.processName = data_arr[0];
      this.categoryName = data_arr[1];
    }
    if(this.activatedRoute.snapshot['_routerState'].url.includes('businessProcess')){
      this.isBpmnModule = true;
    }
    this.rest.getCategoriesList().subscribe(res=> {
      this.categoriesList=res
      this.categories_list=this.categoriesList.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
      if(this.categories_list.length==1){
        // this.categoryName=this.categories_list[0].categoryName
        this.categoryName=this.categories_list[0].categoryId
      }
    });
    this.getApproverList();
    // this.freetrail=localStorage.getItem('freetrail')
  }

  loopTrackBy(index, term){
    return index;
  }

  onchangeCategories(categoryName){
    // this.isotherCategory = categoryName =='other';
  }

  saveCategory(){
    if(this.categoryName =='other'){
      let otherCategory={
        "categoryId": 0,
        "categoryName": this.othercategory
      }
      this.rest.addCategory(otherCategory).subscribe(res=>{})
    }
  }

  proceedChanges(form){
    if(this.processName.trim().length == 0){
      this.isValidName=true;
      return;
    }
    var found = false;
    if (this.categoryName == 'other') {

      for (var i = 0; i < this.categoriesList.data.length; i++) {
        if (this.categoriesList.data[i].categoryName == this.othercategory) {
          found = true;
          this.global.notify("Entered category already exists. Please enter a new category!", "error");
          break;
        }
      }
    }

    if (found == false) {
      this.saveCategory();
      let data;
      if (this.freetrail == 'true') {
        if (this.isBpmnModule) {
          data = {
            "processName": this.processName,
            "categoryName": this.categoryName == 'other' ? this.othercategory : this.categoryName,
            "ntype": this.notationType,
          }
        } else {
          data = {
            "processName": this.processName,
            "categoryId": this.categoryName == 'other' ? this.othercategory : this.categoryName,
            "categoryName": this.categories_list.find(item=>item.categoryId == this.categoryName).categoryName,
          }
        }
      } else {
        if (this.isBpmnModule) {
          let approverobj = this.approver_list[this.process_owner]
          data = {
            "processName": this.processName,
            // "categoryName": this.categoryName == 'other' ? this.othercategory : this.categoryName,
            "categoryId": this.categoryName == 'other' ? this.othercategory : this.categoryName,
            "ntype": this.notationType,
            "processOwner": approverobj.userId,
            "processOwnerName": this.approver_list[this.process_owner].firstName +' ' + this.approver_list[this.process_owner].lastName,
          }
        } else {
          data = {
            "processName": this.processName,
            "categoryName": this.categories_list.find(item=>item.categoryId == this.categoryName).categoryName,
            "categoryId": this.categoryName == 'other' ? this.othercategory : this.categoryName,
          }
        }
      }
      this.slideDown(null);
      this.proceed.emit(data);
    }
  }

  slideDown(form){
    if(!this.data && form){
      form.reset();
    }
    this.isotherCategory = false;
    this.uploadedFileExtension = undefined;
    // var modal = document.getElementById('myModal');
    // modal.style.display="none";
    this.closeOverlay.emit(false);
  }

  @HostListener('document:click', ['$event'])
  clickedOutside(event){
    if(event.target.classList.contains('modal')){
      this.slideDown(this.processForm);
    }
  }

  lettersOnly(event) {
    this.isValidName=false;
    var regex = new RegExp("^[a-zA-Z0-9-_ ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
      if ((event.target.selectionStart === 0 && event.code === 'Space')){
        event.preventDefault();
      }
  }

  async getApproverList(){
    let roles={
      "roleNames": ["Process Owner"]
  }

  await this.rest.getmultipleApproverforusers(roles).subscribe( res =>  {//Process Architect
     if(Array.isArray(res))
       this.approver_list = res;
   });
  }

  updateChanges() {
    if(this.processName.trim().length == 0){
      this.isValidName=true;
      return;
    };

    if (this.overlay_data.module == "pi") {
      this.isLoading=true;
      let req_body = {
        "piId": this.overlay_data.selectedObj.piId,
        "piName": this.processName
      }
      this.rest.updatePiData(req_body).subscribe((res:any) => {
        this.isLoading=false;
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: res.message
        // })
        this.toastService.showSuccess(this.processName,'update');
        setTimeout(() => {
          this.dt.processDetailsUpdateSuccess({"isRfresh":true});
        }, 1500);
        this.slideDown(null);
      });
    }else{
      this.isLoading=true;
      let req_body={
        "id":this.overlay_data.selectedObj.id,
        "bpmnModelId":this.overlay_data.selectedObj.bpmnModelId,
        "processOwner":this.approver_list[this.process_owner].userId,
        "processOwnerName": this.approver_list[this.process_owner].firstName +' ' + this.approver_list[this.process_owner].lastName,
        "bpmnProcessName": this.processName,
        "bpmnVersion": String(this.overlay_data.selectedObj.version)
    }
      this.rest.bpmnVersionChecking(req_body.bpmnModelId).subscribe((res:any)=>{
        this.isLoading=false;
        if(res.message=="This Bpmn Process has Multiple Versions"){
          let disply_text;
          if(this.overlay_data.selectedObj.bpmnProcessName != this.processName && this.overlay_data.selectedObj.processOwner != this.approver_list[this.process_owner].userId){
            disply_text="Process name & Process owner"
           }else if(this.overlay_data.selectedObj.bpmnProcessName != this.processName){
           disply_text="Process name"
          }else if(this.overlay_data.selectedObj.processOwner != this.approver_list[this.process_owner].userId){
            disply_text="Process owner"
          }else{
            disply_text="Process name & Process owner"
          }
          this.confirmationService.confirm({
            message: disply_text + " will be updated for all versions of the BPMN.",
            header: "Are you sure?",            
            acceptLabel:'Yes',
            rejectLabel: "No",
            rejectButtonStyleClass: 'btn reset-btn',
            acceptButtonStyleClass: 'btn bluebg-button',
            defaultFocus: 'none',
            rejectIcon: 'null',
            acceptIcon: 'null',
            accept: () => {
              this.rest.updateBpsData(req_body).subscribe((res:any)=>{
                this.isLoading=false;
                // this.messageService.add({
                //   severity: 'success',
                //   summary: 'Success',
                //   detail: res.message
                // })
                this.toastService.showSuccess(this.processName,'update');
                setTimeout(() => {
                  this.dt.processDetailsUpdateSuccess({"isRfresh":true});
                }, 1500);
                this.slideDown(null);
              })
            }
          });
        }else{
          this.isLoading=true;
          this.rest.updateBpsData(req_body).subscribe((res:any)=>{
            this.isLoading=false;
            this.toastService.showSuccess(this.processName,'update');
            setTimeout(() => {
              this.dt.processDetailsUpdateSuccess({"isRfresh":true});
            }, 1500);
            this.slideDown(null);
          })
        }
      })
    }
  }

}
