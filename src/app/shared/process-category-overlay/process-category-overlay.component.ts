import { Component, OnInit, Output, EventEmitter, Input, HostListener, ViewChild, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalScript } from '../global-script';
import Swal from 'sweetalert2';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';

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
  @Input() uploadedFileName?:string;
  @Input() overlay_data:any={};

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
  freetrail: string;
  isLoading:boolean=false;
  isValidName:boolean=false;
  @ViewChild('processCategoryForm', {static: true}) processForm: NgForm;
  constructor( private rest:RestApiService, private activatedRoute: ActivatedRoute, private global:GlobalScript,
    private cdRef: ChangeDetectorRef, private dt: DataTransferService) { }

  ngOnChanges(changes: SimpleChanges) {
    // console.log("this.ovrlayData",this.overlay_data)
    if(this.overlay_data.type=="edit"){
      this.isValidName=false;
      if(this.overlay_data.module=="pi"){
        this.categoryName=this.overlay_data.selectedObj.categoryName;
        this.processName=this.overlay_data.selectedObj.piName;
      }else{
        this.categoryName=this.overlay_data.selectedObj.category;
        this.notationType=this.overlay_data.selectedObj.ntype;
        // this.process_owner=this.overlay_data.selectedObj.processOwner;
        this.processName=this.overlay_data.selectedObj.bpmnProcessName;
        this.approver_list.forEach((e,i)=>{
          if(this.overlay_data.selectedObj.processOwner==e.userId){
            this.process_owner=i;
          }
        })
      }
    }else{
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
      this.categoryName=this.categories_list[0].categoryName
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
        this.categoryName=this.categories_list[0].categoryName
      }
    });
    this.getApproverList();
    this.freetrail=localStorage.getItem('freetrail')
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
          this.global.notify("Entered category is already existed.Please enter new category.", "error");
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
            "categoryName": this.categoryName == 'other' ? this.othercategory : this.categoryName,
          }
        }
      } else {
        if (this.isBpmnModule) {
          let approverobj = this.approver_list[this.process_owner]
          data = {
            "processName": this.processName,
            "categoryName": this.categoryName == 'other' ? this.othercategory : this.categoryName,
            "ntype": this.notationType,
            "processOwner": approverobj.userId,
            "processOwnerName": this.approver_list[this.process_owner].firstName +' ' + this.approver_list[this.process_owner].lastName,
          }
        } else {
          data = {
            "processName": this.processName,
            "categoryName": this.categoryName == 'other' ? this.othercategory : this.categoryName,
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
    var modal = document.getElementById('myModal');
    modal.style.display="none";
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

    // this.process_name_error = false;
    // if (event.target.value.length == 0) {
    //   this.process_name_error = false;
    // }
    // if (event.target.value.includes(' ')) {
    //   this.process_name_error = true;
    //   return;
    // }
    // if ((event.target.value.length != 0 && event.target.value.length < 4) || (event.target.value.length > 25) ) {
    //   this.process_name_error = true;
    // }




    // this.process_name_error=false;
    // if(event.target.value.length==0 && event.code=="Space"){
    //   event.preventDefault();
    //   return false;
    // }
    // console.log(event.code)
    
    // let count1;
    // if(event.code=="Space"){
    //   count1=this.count++;
    //   this.process_name_error=true;
    // }else{
    //   this.count=0;
    // }
    // console.log(count1)
    // if(count1>=1){
    //   event.preventDefault();
    //   return false;
    // }

    // var str=event.target.value
    // console.log("othercategory",this.othercategory);
    // console.log(str.replace(/\s\s/g, " "))

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
        Swal.fire({
          title: 'Success',
          text: res.message,
          icon: 'success',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.dt.processDetailsUpdateSuccess({"isRfresh":true});
          }
        });

        this.slideDown(null);
      });
    }else{
      this.isLoading=true;
      let req_body={
        "id":this.overlay_data.selectedObj.id,
        "bpmnModelId":this.overlay_data.selectedObj.bpmnModelId,
        "processOwner":this.approver_list[this.process_owner].userId,
        "processOwnerName": this.approver_list[this.process_owner].firstName +' ' + this.approver_list[this.process_owner].lastName,
        "bpmnProcessName": this.processName
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
          Swal.fire({
            title: 'Are you sure?',
            text: disply_text + " will be update all the versions of the bpmn",
            icon: 'warning',
            showCancelButton: true,
            heightAuto: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {
              this.isLoading=true;
            this.rest.updateBpsData(req_body).subscribe((res:any)=>{
              this.isLoading=false;
              Swal.fire({
                title: 'Success',
                text: res.message,
                icon: 'success',
                heightAuto: false,
              }).then((result) => {
                if (result.value) {
                  this.dt.processDetailsUpdateSuccess({"isRfresh":true});
                }
              });
              this.slideDown(null);
            })
          }
          });
        }else{
          this.isLoading=true;
          this.rest.updateBpsData(req_body).subscribe((res:any)=>{
            this.isLoading=false;
            Swal.fire({
              title: 'Success',
              text: res.message,
              icon: 'success',
              heightAuto: false,
            }).then((result) => {
              if (result.value) {
                this.dt.processDetailsUpdateSuccess({"isRfresh":true});
              }
            });
            this.slideDown(null);
          })

        }

      })

    

    }
  }
}
