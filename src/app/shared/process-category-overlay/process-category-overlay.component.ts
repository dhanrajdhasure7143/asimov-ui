import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';

@Component({
  selector: 'process-category-overlay',
  templateUrl: './process-category-overlay.component.html',
  styleUrls: ['./process-category-overlay.component.css']
})
export class ProcessCategoryOverlayComponent implements OnInit {

  @Input() title = "Process Category Details";
  @Output() proceed = new EventEmitter<any>();

  processName = "";
  categoryName = "";
  othercategory;
  isotherCategory:boolean=false;
  categoriesList:any=[];

  constructor( private rest:RestApiService) { }

  ngOnInit() {
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
    let data = {
      "processName": this.processName,
      "categoryName": this.categoryName
    }
    this.slideDown();
    this.proceed.emit(data);
  }

  slideDown(){
    this.processName = "";
    this.categoryName = "";
    var modal = document.getElementById('myModal');
    modal.style.display="none";
  }

}
