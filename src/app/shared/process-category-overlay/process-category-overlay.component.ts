import { Component, OnInit, Output, EventEmitter, Input, HostListener, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { ActivatedRoute } from '@angular/router';

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

  @ViewChild('processCategoryForm', {static: true}) processForm: NgForm;
  constructor( private rest:RestApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if(this.data){
      let data_arr = this.data.split("@");
      this.processName = data_arr[0];
      this.categoryName = data_arr[1];
    }
    if(this.activatedRoute.snapshot['_routerState'].url.includes('businessProcess')){
      this.isBpmnModule = true;
    }
    this.rest.getCategoriesList().subscribe(res=> this.categoriesList=res );
  }

  loopTrackBy(index, term){
    return index;
  }

  onchangeCategories(categoryName){
    this.isotherCategory = categoryName =='other';
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

  proceedChanges(){
    this.saveCategory();
    let data;
    data = {
      "processName": this.processName,
      "categoryName": this.categoryName =='other'?this.othercategory:this.categoryName,
      "notationType": this.notationType
    }
    this.slideDown(null);
    this.proceed.emit(data);
  }

  slideDown(form){
    if(!this.data && form){
      form.reset();
    }
    this.isotherCategory = false;
    var modal = document.getElementById('myModal');
    modal.style.display="none";
  }

  @HostListener('document:click', ['$event'])
  clickedOutside(event){
    if(event.target.classList.contains('modal')){
      this.slideDown(this.processForm);
    }
  }
}
