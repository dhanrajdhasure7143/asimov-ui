import { Component, OnInit, Input, Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Options, PointerType} from 'ng5-slider';

enum Filter{
  'Activity',
  // 'Cases',
   'Variants',
  'End Points',
  'Performance'
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
  @Input() public isFilterApplied:boolean;
  @Output() selectedNodes=new EventEmitter<any[]>();
  @Output() applyFilterValue=new EventEmitter<boolean>();
  @Output() selectedStartpoints=new EventEmitter<any[]>();
  @Output() selectedEndpoints=new EventEmitter<any[]>();
  @Output() selectedVariantOutput = new EventEmitter<any[]>();
  @Output() selectedFilterValues=new EventEmitter<any[]>();
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
  endptBt:boolean=true;
  selectedEndPointsCount=[];
  selectedStartPointsCount=[];
  appliedFilters: any[]=[];

  // performance filter Variable start
  options1: Options = {
    step:0.1,
    floor: 0,
    ceil: 1,
    // translate: (value: number): string => `${value}%`,
    translate: (value: number): string => `${value*100}`,
    hideLimitLabels: true,
    hidePointerLabels: false,
    vertical: false,
  }
  highValue: number = 1;
  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "Germany1",
      "value": 8940000
    },
    {
      "name": "USA1",
      "value": 5000000
    },
    {
      "name": "France1",
      "value": 7200000
    },
    {
      "name": "Germany2",
      "value": 8940000
    },
    {
      "name": "USA2",
      "value": 5000000
    },
    {
      "name": "France2",
      "value": 7200000
    },
    {
      "name": "Germany3",
      "value": 8940000
    },
    {
      "name": "USA3",
      "value": 5000000
    },
    {
      "name": "France3",
      "value": 7200000
    },
    {
      "name": "Germany4",
      "value": 8940000
    },
    {
      "name": "USA4",
      "value": 5000000
    },
    {
      "name": "France4",
      "value": 7200000
    },
    {
      "name": "Germany5",
      "value": 8940000
    },
    {
      "name": "USA5",
      "value": 5000000
    },
    {
      "name": "France5",
      "value": 7200000
    },
    {
      "name": "Germany6",
      "value": 8940000
    },
    {
      "name": "USA6",
      "value": 5000000
    },
    {
      "name": "France6",
      "value": 7200000
    }
  ];
  
  
    view: any[] = [1200, 200];
  
    // options
    showXAxis = false;
    showYAxis = false;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'dd';
    showYAxisLabel = true;
    yAxisLabel = 'gg';
  
    colorScheme = {
      domain: ['#337ab7', '#cdc9c9']
    };
  
    //Pie chart
    piesingle = [
      {
        "name": "Germany",
        "value": 8940000
      },
      {
        "name": "USA",
        "value": 5000000
      }
    ];
    // options
    piegradient: boolean = true;
    pieshowLegend: boolean = false;
    showLabels: boolean = false;
    isDoughnut: boolean = false;
    legendPosition: string = 'below';
    pieview: any[] = [90, 100];
    piecolorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
  
  // performance filter Variable end

  constructor(private changeDetectorRef:ChangeDetectorRef) { }

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
    },  4000);
  
    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));   
  }
  ngOnChanges(){    
    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));
    
    if(this.isClearFilter==true){
      this.endptBt=true;
      for (var i = 0; i < this.variantListarray.length; i++){
        this.variantListarray[i].selected= "inactive"
      };
      for (var i = 0; i < this.dataValuesNames.length; i++){
        this.dataValuesNames[i].selected= "inactive"
        };
        this.startPointArray.forEach(e=>{
          e.selected="inactive"
        })
        this.endPointArray.forEach(elem=>{
          elem.selected="inactive"
        })
        this.isStartPoint=false;
        this.isEndPoint=false;
        this.appliedFilters=[];
        this.isActivity=true;
        this.isEndpoint=false;
        this.isVariantFilter = false;
        this.filterby="Activity";
    }
    
    if(this.isFilterApplied==true){
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
      // this.isApplyFilter=false;
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
  this.appliedFilters=[];
  var activityArray1=[];
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
          this.appliedFilters.push("Activity")
    }else{
      this.selectedNodes.emit(null)
          this.applyFilterValue.emit(true);
    }
  this.applyVariantFilter()
}
channgeFilter(){    // filter type in bottom over lay
  this.endPointsArray=[{name:"Start",selected:"inactive"},{name:"End",selected:"inactive"}]
  if(this.filterby=="Activity"){
    this.isActivity=true;
    this.isEndpoint=false;
    this.isVariantFilter = false;
  } else if(this.filterby=="Variants"){
    this.isVariantFilter = true;
    this.isActivity=false;
    this.isEndpoint=false;
  } else if(this.filterby == "Performance"){
    this.isVariantFilter = false;
    this.isActivity=true;
    this.isEndpoint=false;
    // this.filterby = 'Activity';
    var modal = document.getElementById('myModal');
    modal.style.display="block";


  }else{
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

  this.selectedStartPointsCount=[]
  this.startPointArray.forEach(element => {
      if(element.selected==="active"){
          this.selectedStartPointsCount.push(element.name)
        }
      })
  if(this.selectedStartPointsCount.length >=1 && this.selectedEndPointsCount.length >=1){
    this.endptBt=false;
  }else{
    this.endptBt=true;
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
    this.selectedEndPointsCount=[]
    this.endPointArray.forEach(element => {
      if(element.selected==="active"){
          this.selectedEndPointsCount.push(element.name)
        }
      })
      if(this.selectedStartPointsCount.length >=1 && this.selectedEndPointsCount.length >=1){
        this.endptBt=false;
      }else{
        this.endptBt=true;
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
      if(this.appliedFilters.indexOf('EndPoint')==-1){
        this.appliedFilters.push("EndPoint")
      }
      
      var obj:any={startPoint:selectedstartPoints,endPoint:selectedEndPoints,}
      console.log(obj);

      this.selectedStartpoints.emit(obj);
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

        if(this.seletedVariant.length >= 1){
          this.appliedFilters.push("Variant")
        }
        this.selectedVariantOutput.emit(this.seletedVariant)
        this.applyFilterValue.emit(true)  
  }

  removeTag(value){   // remove applied tag on filter

    for (var i = this.appliedFilters.length - 1; i >= 0; i--) {
      if (this.appliedFilters[i] === value) {
        this.appliedFilters.splice(i, 1);
      }
     }
     if(value=="EndPoint"){
        this.startPointArray.forEach(element => {
            element.selected= "inactive";
        })

        this.endPointArray.forEach(element => {
            element.selected= "inactive";
        })
        this.comboFilter();
     }else if(value=="Activity"){
          for (var i = 0; i < this.dataValuesNames.length; i++){
              this.dataValuesNames[i].selected = "inactive"
            };
            this.comboFilter();
            this.isDeselectActivity=true;
     }else if(value=="Variant"){
        this.seletedVariant=[];
          for(var i = 0; i < this.variantListarray.length; i++){
              this.variantListarray[i].selected = "inactive"
            };
            this.comboFilter();
            this.isApplyFilter=true;
     }
     this.isStartPoint=false;
     this.isEndPoint=false;
  }
  
  comboFilter(){      //cobination filter apply
    this.appliedFilters=[]
    // Activity
    let seletedActivity=[];
    let seletedActivity1=[];
        for (var i = 0; i < this.dataValuesNames.length; i++){
          if(this.dataValuesNames[i].selected === "active"){
            seletedActivity.push(this.dataValues[i].name)
          }
          if(this.dataValuesNames[i].selected === "inactive"){
              seletedActivity1.push(this.dataValues[i].name)
            }
          };

          // Variant 
          let seletedVariantArray=[];
          let seletedVariantArray1=[]
        for (var i = 0; i < this.variantListarray.length; i++){
          seletedVariantArray1.push(this.variantListarray[i].name)
          if(this.variantListarray[i].selected === "active"){
            seletedVariantArray.push(this.variantListarray[i].name)
            }
          };

          // End points
          let selectedstartPoints=[];
          let selectedEndPoints=[]
          let selectedstartPoints1=[];
          let selectedEndPoints1=[]

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
            let object:any={activity:seletedActivity1,variants:seletedVariantArray,startPoint:selectedstartPoints,endPoint:selectedEndPoints}

            if(seletedVariantArray.length==0){
              object.variants=seletedVariantArray1;
            }
            
            if(seletedActivity.length==0||seletedActivity1.length==0){
              object.activity=null;
            }
            if(selectedstartPoints.length==0 && selectedEndPoints.length==0){
              object.startPoint=null;
              object.endPoint=null;
            }
            if(selectedstartPoints.length==0 && selectedEndPoints.length!=0){
              object.startPoint=selectedstartPoints1;
            }
            if(selectedstartPoints.length!=0 && selectedEndPoints.length==0){
              object.endPoint=selectedEndPoints1;
            }

            this.selectedFilterValues.emit(object);
            this.applyFilterValue.emit(true)
            
            if(seletedActivity.length!=0 ){
              if(this.appliedFilters.indexOf('Activity')==-1){
                this.appliedFilters.push("Activity")
              }
            }
            if(seletedVariantArray.length!=0 ){
              if(this.appliedFilters.indexOf('Variant')==-1){
                this.appliedFilters.push("Variant")
              }
            }
              if(selectedstartPoints.length!=0 ||selectedEndPoints.length!=0){
                if(this.appliedFilters.indexOf('EndPoint')==-1){
                  this.appliedFilters.push("EndPoint")
                }
              }
  }

  closePerformancePopup() {
   this.filterby="Activity";
    var modal = document.getElementById('myModal');
    modal.style.display="none";
  }


} 