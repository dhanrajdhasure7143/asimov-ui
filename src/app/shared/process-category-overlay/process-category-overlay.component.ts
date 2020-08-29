import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';

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

  constructor( private rest:RestApiService) { }

  ngOnInit() {
    if(this.data){
      let data_arr = this.data.split("@");
      this.processName = data_arr[0];
      this.categoryName = data_arr[1];
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
      "categoryName": this.categoryName =='other'?this.othercategory:this.categoryName
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

}
