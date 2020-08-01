import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Options, PointerType} from 'ng5-slider';

enum Filter{
  'Activity',
  // 'Cases',
  // 'Variants',
  // 'End Points',
}
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() dataValues:any=[];
  @Input() public fetchData;
  @Output() selectedNodes=new EventEmitter<any[]>();
  @Output() applyFilterValue=new EventEmitter<boolean>();
  chart_filter_options;
  public chart_filter = Filter;
  search_activity:any;
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
seletedActivity:any=[];
selectedActivityOne:any[]=[];
isApplyFilter:boolean=true;
filterby:any="Activity";
isActivity:boolean=true;
isEndpoint:boolean=false;
dataValuesNames:any=[]

  constructor() { }

  ngOnInit() {
    for(var i=0;i<this.dataValues.length;i++){
      var obj={};
      obj["name"]=this.dataValues[i].name;
      obj["selected"]="inactive";
      this.dataValuesNames.push(obj)
    }

    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));
  }

loopTrackBy(index, term){
  return index;
}
selectData(selectedData, index){
  // console.log("data1", selectedData, index);
  if(this.dataValuesNames[index].selected == "inactive"){
    var select = {
      name: selectedData.name,
      selected: "active"

    };
    this.dataValuesNames[index]= select;
  }else{
    var select = {
      name: selectedData.name, 
      selected: "inactive"
    };
    this.dataValuesNames[index]= select;
  }
  // console.log(this.dataValuesNames);
  
  var activityArray=[]
  for (var i = 0; i < this.dataValuesNames.length; i++){
    if(this.dataValuesNames[i].selected== "active"){
      activityArray.push(this.dataValuesNames[i].name)
    }
    };    
    if(activityArray.length>=1){
      this.isApplyFilter=false;
    }else{
      this.isApplyFilter=true;
    }
  // console.log("data", this.dataValuesNames);
}

selectAllDataValue(){
  for (var i = 0; i < this.dataValuesNames.length; i++){
    this.dataValuesNames[i].selected= "active"
    };
    // console.log(this.dataValuesNames);
    this.isApplyFilter=false;
    this.isSelect=true;
}

deselectAllDataValue(){
  for (var i = 0; i < this.dataValuesNames.length; i++){
    this.dataValuesNames[i].selected= "inactive"
    };
    this.isApplyFilter=true;
    this.isSelect=false;
}

applyFilter(){
  this.seletedActivity=[];
  for (var i = 0; i < this.dataValuesNames.length; i++){
    if(this.dataValuesNames[i].selected === "active")
    this.seletedActivity.push(this.dataValues[i].name)
    };
    // console.log(this.seletedActivity);
    this.selectedNodes.emit(this.seletedActivity)
    this.applyFilterValue.emit(true)
}
channgeFilter(){
  // console.log(this.filterby);
  // if(this.filterby=="Activity"){
  //   this.isActivity=true;
  //   this.isEndpoint=false;
  // }else{
  //   this.isActivity=false;
  //   this.isEndpoint=true;
  // }
  
}

}