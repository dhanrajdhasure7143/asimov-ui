import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Options, PointerType} from 'ng5-slider';

enum Filter{
  'Activity',
  // 'Cases',
   'Variants',
  //'End Points',
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
  @Input() variantData:any = {};
  @Input() public fetchData;
  @Input() public resetFilter:boolean;
  @Input() public isClearFilter:boolean;
  @Output() selectedNodes=new EventEmitter<any[]>();
  @Output() applyFilterValue=new EventEmitter<boolean>();
  @Output() selectedStartpoints=new EventEmitter<any[]>();
  @Output() selectedEndpoints=new EventEmitter<any[]>();
  @Output() selectedVariantOutput = new EventEmitter<any[]>();
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
  isVariantFilter:boolean = false;
  dataValuesNames:any=[]
  endPointsArray: any=[];
  variantListarray:any =[]
  isStartPoint:boolean=false;
  isEndPoint: boolean=false;
  startPointArray=[];
  endPointArray=[];
  seletedVariant:any = [];
  isDeselectAll = false;
  isDeselectActivity:boolean=true;

  constructor() { }

  ngOnInit() {
    
    setTimeout(() => {
      for(var i=0;i<this.variantData.data.length;i++){
        var obj={};
        obj["name"]=this.variantData.data[i].name;
        obj["casepercent"]=this.variantData.data[i].casepercent;
        obj["detail"]=this.variantData.data[i].detail;
        obj["days"]=this.variantData.data[i].days;
        obj["case_value"]=this.variantData.data[i].case_value;
        obj["selected"]="inactive";
        this.variantListarray.push(obj)
      }

      this.dataValuesNames = [];
      for(var i=0;i<this.dataValues.length;i++){
        var obj={};
        obj["name"]=this.dataValues[i].name;
        obj["selected"]="inactive";
        this.dataValuesNames.push(obj)
      }
      
    },  4000);

  
    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));
    
    
  }
  ngOnChanges(){    
    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));
    // console.log(this.chart_filter_options);
    if(this.isClearFilter==true){
      for (var i = 0; i < this.variantListarray.length; i++){
        this.variantListarray[i].selected= "inactive"
      };
      for (var i = 0; i < this.dataValuesNames.length; i++){
        this.dataValuesNames[i].selected= "inactive"
        };
    }

    // console.log(this.dataValues);
    
    // this.dataValuesNames = [];
    // for(var i=0;i<this.dataValues.length;i++){
    //   var obj={};
    //   obj["name"]=this.dataValues[i].name;
    //   obj["selected"]="inactive";
    //   this.dataValuesNames.push(obj)
    // }
    this.startPointArray = [];
    for(var i=0;i<this.startArray.length;i++){
      var obj={};
      obj["name"]=this.startArray[i];
      obj["selected"]="inactive";
      this.startPointArray.push(obj)
    }
    this.endPointArray = [];
    for(var i=0;i<this.endArray.length;i++){
      var obj={};
      obj["name"]=this.endArray[i];
      obj["selected"]="inactive";
      this.endPointArray.push(obj)
    }

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
      this.isDeselectActivity=false;
    }else{
      this.isApplyFilter=true;
      this.isDeselectActivity=true;
    }
    this.isDeselectAll = false;
}

selectAllDataValue(){
  for (var i = 0; i < this.dataValuesNames.length; i++){
      this.dataValuesNames[i].selected= "active"
    };
    this.isApplyFilter=false;
    this.isSelect=true;
    this.isDeselectAll = false;
    this.isDeselectActivity=false;
}

selectAllVariantList(){
  for (var i = 0; i < this.variantListarray.length; i++){
    this.variantListarray[i].selected= "active"
  };
  this.isApplyFilter=false;
  this.isSelect=true;
}

deselectAllVariantList(){
  for (var i = 0; i < this.variantListarray.length; i++){
    this.variantListarray[i].selected= "inactive"
  };
 
  this.isApplyFilter=true;
    this.isSelect=false;
}


deselectAllDataValue(){
  for (var i = 0; i < this.dataValuesNames.length; i++){
    this.dataValuesNames[i].selected= "inactive"
    };
    this.isDeselectAll = true;
    this.isApplyFilter=true;
    this.isSelect=false;
    this.isDeselectActivity=true;
}

applyFilter(){
  // console.log(this.isDeselectAll);
  var activityArray1=[]
  for (var i = 0; i < this.dataValuesNames.length; i++){
    if(this.dataValuesNames[i].selected== "active"){
      activityArray1.push(this.dataValuesNames[i].name)
    }
    };
    this.seletedActivity=[];
    if(activityArray1.length >= 1){
      for (var i = 0; i < this.dataValuesNames.length; i++){
        if(this.dataValuesNames[i].selected === "inactive")
          this.seletedActivity.push(this.dataValues[i].name)
        };
          this.selectedNodes.emit(this.seletedActivity)
          this.applyFilterValue.emit(true);
    }else{
      this.selectedNodes.emit(null)
          this.applyFilterValue.emit(true);
    }
  // this.seletedActivity=[];
  // if(this.isDeselectAll == true){
  //   this.seletedActivity = [];
  //   // this.selectedNodes.emit(this.seletedActivity)
  //   this.selectedNodes.emit(this.seletedActivity)
  //   this.applyFilterValue.emit(true);
  // } else {
  // for (var i = 0; i < this.dataValuesNames.length; i++){
  //   if(this.dataValuesNames[i].selected === "inactive")
  //     this.seletedActivity.push(this.dataValues[i].name)
  //   };
  //     this.selectedNodes.emit(this.seletedActivity)
  //     this.applyFilterValue.emit(true);
  // }
  this.applyVariantFilter()
}
channgeFilter(){
  this.endPointsArray=[{name:"Start",selected:"inactive"},{name:"End",selected:"inactive"}]
  if(this.filterby=="Activity"){
    this.isActivity=true;
    this.isEndpoint=false;
    this.isVariantFilter = false;
  } else if(this.filterby=="Variants"){
    this.isVariantFilter = true;
    this.isActivity=false;
  }
  else{
    this.isActivity=false;
    this.isEndpoint=true;
    this.isVariantFilter = false;
  }
}
selectedStartPoint(data,index){
  if(data.selected=="inactive"){
    this.startPointArray[index].selected= "active"
  }else{
    this.startPointArray[index].selected= "inactive"
  } 
}
selectedVariant(data,index){
  if(data.selected=="inactive"){
    this.variantListarray[index].selected= "active"
  }else{
    this.variantListarray[index].selected= "inactive"
  } 
  var activityArray=[]
  for (var i = 0; i < this.variantListarray.length; i++){
    if(this.variantListarray[i].selected== "active"){
      activityArray.push(this.variantListarray[i])
    }
    };  
    if(activityArray.length>=1){
      this.isApplyFilter=false;
    }else{
      this.isApplyFilter=true;
    }
    this.isDeselectAll = false;
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

  caseParcent(parcent){       // case persent value in variant list
    if(String(parcent).indexOf('.') != -1){
    let perc=parcent.toString().split('.')
  // return parcent.toString().slice(0,5);
  return perc[0]+'.'+perc[1].slice(0,2);
    }else{
      return parcent;
    }
  }

  timeConversion(millisec) {
    var seconds:any = (millisec / 1000).toFixed(1);
    var minutes:any = (millisec / (1000 * 60)).toFixed(1);
    var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
  }

  applyVariantFilter(){
    this.seletedVariant=[];
    for (var i = 0; i < this.variantListarray.length; i++){
      if(this.variantListarray[i].selected === "active"){
        this.seletedVariant.push(this.variantListarray[i].name)
      }
      };
      // if(this.seletedVariant.length >=1){
      //   this.selectedVariantOutput.emit(this.seletedVariant)
      //   this.applyFilterValue.emit(true)
      // }else{
      //   var seletedVariant1=[]
      //   for (var i = 0; i < this.variantListarray.length; i++){
      //       seletedVariant1.push(this.variantListarray[i].name)
      //   }
        // this.selectedVariantOutput.emit(seletedVariant1)
        this.selectedVariantOutput.emit(this.seletedVariant)
        this.applyFilterValue.emit(true)
      // }
        
  }

} 