import { Component, OnInit, Input } from '@angular/core';
import { Options, PointerType} from 'ng5-slider';

enum Filter{
  'Activity',
  'Cases',
  'Variants',
  'End Points',
}
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() public dataValues;
  @Input() public reports;
  @Input() public fetchData;
  chart_filter_options;
  public chart_filter = Filter;
  queryString;
  filterValue:number=60;
  filterOptions: Options = {
    floor: 0,
    ceil: 100,
     translate: (filterValue: number): string => `${filterValue}%`,
     hideLimitLabels: true,
     hidePointerLabels:false,
    }

public isSearch:boolean = false;
public isSelect:boolean = false;

  constructor() { }

  ngOnInit() {
    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));
  }

slideDown(){
  document.getElementById("foot").classList.add("slide-down");
  document.getElementById("foot").classList.remove("slide-up");
  
}

loopTrackBy(index, term){
  return index;
}
SelectData(selectedData, index){
  console.log("data1", selectedData, index);
  if(this.dataValues[index].selected == "inactive"){
    var select = {
      name: selectedData.name, 
      selected: "active"
    };
    this.dataValues[index]= select;
  }else{
    var select = {
      name: selectedData.name, 
      selected: "inactive"
    };
    this.dataValues[index]= select;
  }
  console.log("data", this.dataValues);
}

selectAllDataValue(){
  for (var i = 0; i < this.dataValues.length; i++){
    this.dataValues[i].selected= "active"
    };
    this.isSelect=true;
    this.isSearch=false;
}

deselectAllDataValue(){
  for (var i = 0; i < this.dataValues.length; i++){
    this.dataValues[i].selected= "inactive"
    };
    this.isSelect=false;
    this.isSearch=false;
}

applyFilter(){
  for (var i = 0; i < this.dataValues.length; i++){
    if(this.dataValues[i].selected === "active")
    console.log("selected values",this.dataValues[i].name)
    };

  this.deselectAllDataValue();
  this. slideDown();
  
}

}