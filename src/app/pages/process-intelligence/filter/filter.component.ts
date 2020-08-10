import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Options, PointerType} from 'ng5-slider';

enum Filter{
  'Activity',
  // 'Cases',
  // 'Variants',
  'End Points',
}
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() dataValues:any=[];
  @Input() startArray:any=[];
  @Input() endArray:any=[];
  @Input() public fetchData;
  @Input() public resetFilter:boolean;
  @Output() selectedNodes=new EventEmitter<any[]>();
  @Output() applyFilterValue=new EventEmitter<boolean>();
  @Output() selectedStartpoints=new EventEmitter<any[]>();
  @Output() selectedEndpoints=new EventEmitter<any[]>();
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
  endPointsArray: any=[];
  isStartPoint:boolean=false;
  isEndPoint: boolean=false;
  startPointArray=[]
  endPointArray=[]

  constructor() { }

  ngOnInit() {
    for(var i=0;i<this.startArray.length;i++){
      var obj={};
      obj["name"]=this.startArray[i];
      obj["selected"]="inactive";
      this.startPointArray.push(obj)
    }
    for(var i=0;i<this.endArray.length;i++){
      var obj={};
      obj["name"]=this.endArray[i];
      obj["selected"]="inactive";
      this.endPointArray.push(obj)
    }
    
    for(var i=0;i<this.dataValues.length;i++){
      var obj={};
      obj["name"]=this.dataValues[i].name;
      obj["selected"]="inactive";
      this.dataValuesNames.push(obj)
    }
    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));
  }
  ngOnChanges(){    
    if(this.resetFilter==true){
      this.startPointArray.forEach(e=>{
        e.selected="inactive"
      })
      this.endPointArray.forEach(elem=>{
        elem.selected="inactive"
      })
      this.isStartPoint=false;
      this.isEndPoint=false;
    }
  }

loopTrackBy(index, term){
  return index;
}
selectData(selectedData, index){
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
}

selectAllDataValue(){
  for (var i = 0; i < this.dataValuesNames.length; i++){
      this.dataValuesNames[i].selected= "active"
    };
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
      this.selectedNodes.emit(this.seletedActivity)
      this.applyFilterValue.emit(true)
}
channgeFilter(){
  this.endPointsArray=[{name:"Start",selected:"inactive"},{name:"End",selected:"inactive"}]
  if(this.filterby=="Activity"){
    this.isActivity=true;
    this.isEndpoint=false;
  }else{
    this.isActivity=false;
    this.isEndpoint=true;
  }
}
selectedStartPoint(data,index){
  if(data.selected=="inactive"){
    this.startPointArray[index].selected= "active"
  }else{
    this.startPointArray[index].selected= "inactive"
  } 
}
  selectedEndPoint(data,index){
    if(data.selected=="inactive"){
      this.endPointArray[index].selected= "active"
    }else{
      this.endPointArray[index].selected= "inactive"
    } 
  }
  applyEndpointFilter(){
    var selectedEndPoints=[]
    var selectedstartPoints=[]
    var selectedEndPoints1=[]
    var selectedstartPoints1=[]
    this.startPointArray.forEach(element => {
      selectedstartPoints1.push(element.name)
        if(element.selected==="active"){
            selectedstartPoints.push(element.name)
          }
        })
    this.endPointArray.forEach(element => {
      selectedEndPoints1.push(element.name)
      if(element.selected==="active"){
          selectedEndPoints.push(element.name)
        }
      })
      this.selectedStartpoints.emit(selectedstartPoints);
      this.selectedEndpoints.emit(selectedEndPoints);
      this.applyFilterValue.emit(true)
  }
  onStartPoint(){
    this.isStartPoint=!this.isStartPoint;
  }
  onEndPoint(){
    this.isEndPoint=!this.isEndPoint;
  }

}