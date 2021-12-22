import { Component, OnInit, Output, EventEmitter, Input, HostListener, ViewChild, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalScript } from '../global-script';

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
  @ViewChild('processCategoryForm', {static: true}) processForm: NgForm;
  constructor( private rest:RestApiService, private activatedRoute: ActivatedRoute, private global:GlobalScript,
    private cdRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
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
      this.categories_list=this.categoriesList.data
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
    //console.log(this.categoriesList.data['categoryName'].includes(this.othercategory));

    // if(this.categoryName =='other'){
    //   if(this.categoriesList.data.includes(this.othercategory) == true){
    //     console.log("exusted");
    //     return;
    //   }
    // }
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
    console.log("in else", found);

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
            "processOwner": approverobj.userId
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
    var regex = new RegExp("^[a-zA-Z0-9-_]+$");
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
}
