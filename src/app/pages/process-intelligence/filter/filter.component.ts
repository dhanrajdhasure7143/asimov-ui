import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Options, PointerType, LabelType } from 'ng5-slider';
import { Subject } from 'rxjs';

enum Filter {
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

  @Input() dataValues: any = [];
  @Input() startArray: any = [];
  @Input() endArray: any = [];
  @Input() variantData: any = {};
  @Input() performanceFilterInput: any = {};
  @Input() public fetchData;
  @Input() public resetFilter: boolean;
  @Input() public isClearFilter: boolean;
  @Input() public isFilterApplied: boolean;
  @Input() public isGraph_changed:boolean;
  @Output() selectedNodes = new EventEmitter<any[]>();
  @Output() applyFilterValue = new EventEmitter<boolean>();
  @Output() selectedStartpoints = new EventEmitter<any[]>();
  @Output() selectedEndpoints = new EventEmitter<any[]>();
  @Output() selectedVariantOutput = new EventEmitter<any[]>();
  @Output() selectedFilterValues = new EventEmitter<any[]>();
  @Output() appliedPerformanceFiterValues = new EventEmitter<any>();
  chart_filter_options;
  public chart_filter = Filter;
  search_activity: any;
  fcount = [];
  totalCases = 0;
  chagnedCases = 0;
  casePercentage: any;
  filterValue: number = 60;
  public manualRefresh = new Subject<void>();
  filterOptions: Options = {
    floor: 0,
    ceil: 100,
    translate: (filterValue: number): string => `${filterValue}%`,
    hideLimitLabels: true,
    hidePointerLabels: false,
  }

  public isSearch: boolean = false;
  public isSelect: boolean = false;
  seletedActivity: any = [];
  selectedActivityOne: any[] = [];
  isApplyFilter: boolean = true;
  filterby: any = "Activity";
  isActivity: boolean = true;
  isEndpoint: boolean = false;
  isVariantFilter: boolean = false;
  dataValuesNames: any = []
  endPointsArray: any = [];
  variantListarray: any = []
  isStartPoint: boolean = false;
  isEndPoint: boolean = false;
  startPointArray = [];
  endPointArray = [];
  seletedVariant: any = [];
  isDeselectAll = false;
  isDeselectActivity: boolean = true;
  endptBt: boolean = true;
  selectedEndPointsCount = [];
  selectedStartPointsCount = [];
  appliedFilters: any[] = [];
  pFilterType:any = "caseduration";

  performanceTotalDuration: any = [];
  perfrmanceFilterKeyValuepair: any[] = [];
  minPerfValue: any =0;
  maxPerfValue: any = 0;
  // performance filter Variable start
  options1: Options = {
    step: 0.1,
    floor: 0,
    ceil: 1,
    // translate: (value: number): string => `${value}%`,
    translate: (value: number): string => `${value * 100}`,
    hideLimitLabels: true,
    hidePointerLabels: false,
    vertical: false,
  }
  highValue: number = 1;
  vaue:number = 0;
  single = [];



  view: any[] = [1500, 200];

  // options
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'dd';
  showYAxisLabel = false;
  yAxisLabel = 'gg';

  colorScheme = {
    domain: ['#0062cf', '#0db9f0']
  };

  //Pie chart
  piesingle = [
    {name: "Total Cases", value: 100}
  ];
  // options
  piegradient: boolean = true;
  pieshowLegend: boolean = false;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  pieview: any[] = [90, 100];
  piecolorScheme = {
    domain: ['#0db9f0', '#595555']
  };
  customColors:any;
  // performance filter Variable end
  performancedrop_array:any[]=['Days','Hours','Minutes'];
  time_dropwnValue="Days";
  endtime_dropwnValue="Days";
  setvalue_input:any;
  setvalue_input1:any;
  setvalue_input2:any;
  set_endvalue_input:any;
  set_endvalue_input1:any;
  set_endvalue_input2:any;
  isDays_input:boolean=true;
  isHrs_input:boolean=false;
  isMints_input:boolean=false;
  isDays_input1:boolean=true;
  isHrs_input1:boolean=false;
  isMints_input1:boolean=false;
  isnoof_casesInput:boolean=false;
  isnoof_casesInput1:boolean=false;
  noof_casesInput_value:any;
  noof_casesInput_value1:any;
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      console.log(this.variantData)
    console.log(this.dataValues)

      for (var i = 0; i < this.variantData.data.length; i++) {
        var obj = {};
        obj["name"] = this.variantData.data[i].name;
        obj["casepercent"] = this.variantData.data[i].casepercent;
        obj["detail"] = this.variantData.data[i].detail;
        obj["days"] = this.variantData.data[i].days;
        obj["case_value"] = this.variantData.data[i].case_value;
        obj["selected"] = "inactive";
        this.variantListarray.push(obj)
      }

      this.dataValuesNames = [];
      for (var i = 0; i < this.dataValues.length; i++) {
        var obj = {};
        obj["name"] = this.dataValues[i].name;
        obj["selected"] = "inactive";
        this.dataValuesNames.push(obj)
      }

      this.startPointArray = [];
      for (var i = 0; i < this.startArray.length; i++) {
        var obj = {};
        obj["name"] = this.startArray[i];
        obj["selected"] = "inactive";
        this.startPointArray.push(obj)
      }
      this.endPointArray = [];
      for (var i = 0; i < this.endArray.length; i++) {
        var obj = {};
        obj["name"] = this.endArray[i];
        obj["selected"] = "inactive";
        this.endPointArray.push(obj)
      }
      this.performanceLogic(this.performanceFilterInput, 'caseduration');
      // console.log("performance",this.performanceFilterInput)
    }, 4000);
    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));

    // Performance filter logic 
    
    
    this.manualRefresh.next();
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

  ngOnChanges() {
    if(this.isGraph_changed){
      setTimeout(() => {
        for (var i = 0; i < this.variantData.data.length; i++) {
          var obj = {};
          obj["name"] = this.variantData.data[i].name;
          obj["casepercent"] = this.variantData.data[i].casepercent;
          obj["detail"] = this.variantData.data[i].detail;
          obj["days"] = this.variantData.data[i].days;
          obj["case_value"] = this.variantData.data[i].case_value;
          obj["selected"] = "inactive";
          this.variantListarray.push(obj)
        }

        this.dataValuesNames = [];
        for (var i = 0; i < this.dataValues.length; i++) {
          var obj = {};
          obj["name"] = this.dataValues[i].name;
          obj["selected"] = "inactive";
          this.dataValuesNames.push(obj)
        }
  
        this.startPointArray = [];
        for (var i = 0; i < this.startArray.length; i++) {
          var obj = {};
          obj["name"] = this.startArray[i];
          obj["selected"] = "inactive";
          this.startPointArray.push(obj)
        }
        this.endPointArray = [];
        for (var i = 0; i < this.endArray.length; i++) {
          var obj = {};
          obj["name"] = this.endArray[i];
          obj["selected"] = "inactive";
          this.endPointArray.push(obj)
        }
        this.performanceLogic(this.performanceFilterInput, 'caseduration');
        // console.log("performance",this.performanceFilterInput)
      }, 1000);
    }
    this.chart_filter_options = Object.keys(Filter).filter(val => isNaN(Filter[val]));

    if (this.isClearFilter == true) {
      this.endptBt = true;
      for (var i = 0; i < this.variantListarray.length; i++) {
        this.variantListarray[i].selected = "inactive"
      };
      for (var i = 0; i < this.dataValuesNames.length; i++) {
        this.dataValuesNames[i].selected = "inactive"
      };
      this.startPointArray.forEach(e => {
        e.selected = "inactive"
      })
      this.endPointArray.forEach(elem => {
        elem.selected = "inactive"
      })
      this.isStartPoint = false;
      this.isEndPoint = false;
      this.appliedFilters = [];
      this.isActivity = true;
      this.isEndpoint = false;
      this.isVariantFilter = false;
      this.filterby = "Activity";
    }

    if (this.isFilterApplied == true) {
      this.startPointArray = [];
      for (var i = 0; i < this.startArray.length; i++) {
        var obj = {};
        obj["name"] = this.startArray[i];
        obj["selected"] = "inactive";
        this.startPointArray.push(obj)
      }
      this.endPointArray = [];
      for (var i = 0; i < this.endArray.length; i++) {
        var obj = {};
        obj["name"] = this.endArray[i];
        obj["selected"] = "inactive";
        this.endPointArray.push(obj)
      }
    }

   // this.performanceLogic(this.performanceFilterInput, 'caseduration');
    
  }

  loopTrackBy(index, term) {
    return index;
  }

  selectData(selectedData, index) {
    if (this.dataValuesNames[index].selected == "inactive") {
      var select = {
        name: selectedData.name,
        selected: "active"
      };
      this.dataValuesNames[index] = select;
    } else {
      var select = {
        name: selectedData.name,
        selected: "inactive"
      };
      this.dataValuesNames[index] = select;
    }

    var activityArray = []
    for (var i = 0; i < this.dataValuesNames.length; i++) {
      if (this.dataValuesNames[i].selected == "active") {
        activityArray.push(this.dataValuesNames[i].name)
      }
    };
    if (activityArray.length >= 1) {
      // this.isApplyFilter=false;
      this.isDeselectActivity = false;
    } else {
      this.isApplyFilter = true;
      this.isDeselectActivity = true;
    }
    this.isDeselectAll = false;
  }

  selectAllDataValue() {
    for (var i = 0; i < this.dataValuesNames.length; i++) {
      this.dataValuesNames[i].selected = "active"
    };
    this.isApplyFilter = false;
    this.isSelect = true;
    this.isDeselectAll = false;
    this.isDeselectActivity = false;
  }

  selectAllVariantList() {
    for (var i = 0; i < this.variantListarray.length; i++) {
      this.variantListarray[i].selected = "active"
    };
    this.isApplyFilter = false;
    this.isSelect = true;
  }

  deselectAllVariantList() {
    for (var i = 0; i < this.variantListarray.length; i++) {
      this.variantListarray[i].selected = "inactive"
    };

    this.isApplyFilter = true;
    this.isSelect = false;
  }


  deselectAllDataValue() {
    for (var i = 0; i < this.dataValuesNames.length; i++) {
      this.dataValuesNames[i].selected = "inactive"
    };
    this.isDeselectAll = true;
    this.isApplyFilter = true;
    this.isSelect = false;
    this.isDeselectActivity = true;
  }

  applyFilter() {
    this.appliedFilters = [];
    var activityArray1 = [];
    for (var i = 0; i < this.dataValuesNames.length; i++) {
      if (this.dataValuesNames[i].selected == "active") {
        activityArray1.push(this.dataValuesNames[i].name)
      }
    };
    this.seletedActivity = [];
    if (activityArray1.length >= 1) {
      for (var i = 0; i < this.dataValuesNames.length; i++) {
        if (this.dataValuesNames[i].selected === "inactive")
          this.seletedActivity.push(this.dataValues[i].name)
      };
      this.selectedNodes.emit(this.seletedActivity)
      this.applyFilterValue.emit(true);
      this.appliedFilters.push("Activity")
    } else {
      this.selectedNodes.emit(null)
      this.applyFilterValue.emit(true);
    }
    this.applyVariantFilter()
  }
  channgeFilter() {    // filter type in bottom over lay
    this.endPointsArray = [{ name: "Start", selected: "inactive" }, { name: "End", selected: "inactive" }]
    if (this.filterby == "Activity") {
      this.isActivity = true;
      this.isEndpoint = false;
      this.isVariantFilter = false;
    } else if (this.filterby == "Variants") {
      this.isVariantFilter = true;
      this.isActivity = false;
      this.isEndpoint = false;
    } else if (this.filterby == "Performance") {
      this.isVariantFilter = false;
      this.isActivity = true;
      this.isEndpoint = false;
      // this.filterby = 'Activity';
      var modal = document.getElementById('myModal');
      modal.style.display = "block";


    } else {
      this.isActivity = false;
      this.isEndpoint = true;
      this.isVariantFilter = false;
    }
  }
  selectedStartPoint(data, index) {
    if (data.selected == "inactive") {
      this.startPointArray[index].selected = "active"
    } else {
      this.startPointArray[index].selected = "inactive"
    }

    this.selectedStartPointsCount = []
    this.startPointArray.forEach(element => {
      if (element.selected === "active") {
        this.selectedStartPointsCount.push(element.name)
      }
    })
    if (this.selectedStartPointsCount.length >= 1 && this.selectedEndPointsCount.length >= 1) {
      this.endptBt = false;
    } else {
      this.endptBt = true;
    }
  }

  selectedVariant(data, index) {
    if (data.selected == "inactive") {
      this.variantListarray[index].selected = "active"
    } else {
      this.variantListarray[index].selected = "inactive"
    }
    var activityArray = []
    for (var i = 0; i < this.variantListarray.length; i++) {
      if (this.variantListarray[i].selected == "active") {
        activityArray.push(this.variantListarray[i])
      }
    };
    if (activityArray.length >= 1) {
      this.isApplyFilter = false;
    } else {
      this.isApplyFilter = true;
    }
    this.isDeselectAll = false;
  }

  selectedEndPoint(data, index) {
    if (data.selected == "inactive") {
      this.endPointArray[index].selected = "active"
    } else {
      this.endPointArray[index].selected = "inactive"
    }
    this.selectedEndPointsCount = []
    this.endPointArray.forEach(element => {
      if (element.selected === "active") {
        this.selectedEndPointsCount.push(element.name)
      }
    })
    if (this.selectedStartPointsCount.length >= 1 && this.selectedEndPointsCount.length >= 1) {
      this.endptBt = false;
    } else {
      this.endptBt = true;
    }
  }

  applyEndpointFilter() {
    var selectedEndPoints = []
    var selectedstartPoints = []
    var selectedEndPoints1 = []
    var selectedstartPoints1 = []
    this.startPointArray.forEach(element => {
      selectedstartPoints1.push(element.name)
      if (element.selected === "active") {
        selectedstartPoints.push(element.name)
      }
    })
    this.endPointArray.forEach(element => {
      selectedEndPoints1.push(element.name)
      if (element.selected === "active") {
        selectedEndPoints.push(element.name)
      }
    })
    if (this.appliedFilters.indexOf('EndPoint') == -1) {
      this.appliedFilters.push("EndPoint")
    }

    var obj: any = { startPoint: selectedstartPoints, endPoint: selectedEndPoints, }
   

    this.selectedStartpoints.emit(obj);
    this.applyFilterValue.emit(true)
  }

  onStartPoint() {
    this.isStartPoint = !this.isStartPoint;
  }

  onEndPoint() {
    this.isEndPoint = !this.isEndPoint;
  }

  caseParcent(parcent) {       // case persent value in variant list
    if (String(parcent).indexOf('.') != -1) {
      let perc = parcent.toString().split('.')
      return perc[0] + '.' + perc[1].slice(0, 2);
    } else {
      return parcent;
    }
  }

  timeConversion(millisec) {
    var seconds: any = (millisec / 1000).toFixed(1);
    var minutes: any = (millisec / (1000 * 60)).toFixed(1);
    var hours: any = (millisec / (1000 * 60 * 60)).toFixed(1);
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

  applyVariantFilter() {
    this.seletedVariant = [];
    for (var i = 0; i < this.variantListarray.length; i++) {
      if (this.variantListarray[i].selected === "active") {
        this.seletedVariant.push(this.variantListarray[i].name)
      }
    };

    if (this.seletedVariant.length >= 1) {
      this.appliedFilters.push("Variant")
    }
    this.selectedVariantOutput.emit(this.seletedVariant)
    this.applyFilterValue.emit(true)
  }

  removeTag(value) {   // remove applied tag on filter

    for (var i = this.appliedFilters.length - 1; i >= 0; i--) {
      if (this.appliedFilters[i] === value) {
        this.appliedFilters.splice(i, 1);
      }
    }
    if (value == "EndPoint") {
      this.startPointArray.forEach(element => {
        element.selected = "inactive";
      })

      this.endPointArray.forEach(element => {
        element.selected = "inactive";
      })
      this.comboFilter();
    } else if (value == "Activity") {
      for (var i = 0; i < this.dataValuesNames.length; i++) {
        this.dataValuesNames[i].selected = "inactive"
      };
      this.comboFilter();
      this.isDeselectActivity = true;
    } else if (value == "Variant") {
      this.seletedVariant = [];
      for (var i = 0; i < this.variantListarray.length; i++) {
        this.variantListarray[i].selected = "inactive"
      };
      this.comboFilter();
      this.isApplyFilter = true;
    }
    this.isStartPoint = false;
    this.isEndPoint = false;
  }

  comboFilter() {      //cobination filter apply
    this.appliedFilters = []
    // Activity
    let seletedActivity = [];
    let seletedActivity1 = [];
    for (var i = 0; i < this.dataValuesNames.length; i++) {
      if (this.dataValuesNames[i].selected === "active") {
        seletedActivity.push(this.dataValues[i].name)
      }
      if (this.dataValuesNames[i].selected === "inactive") {
        seletedActivity1.push(this.dataValues[i].name)
      }
    };

    // Variant 
    let seletedVariantArray = [];
    let seletedVariantArray1 = []
    for (var i = 0; i < this.variantListarray.length; i++) {
      seletedVariantArray1.push(this.variantListarray[i].name)
      if (this.variantListarray[i].selected === "active") {
        seletedVariantArray.push(this.variantListarray[i].name)
      }
    };

    // End points
    let selectedstartPoints = [];
    let selectedEndPoints = []
    let selectedstartPoints1 = [];
    let selectedEndPoints1 = []

    this.startPointArray.forEach(element => {
      selectedstartPoints1.push(element.name)
      if (element.selected === "active") {
        selectedstartPoints.push(element.name)
      }
    })
    this.endPointArray.forEach(element => {
      selectedEndPoints1.push(element.name)
      if (element.selected === "active") {
        selectedEndPoints.push(element.name)
      }
    })
    let object: any = { activity: seletedActivity1, variants: seletedVariantArray, startPoint: selectedstartPoints, endPoint: selectedEndPoints }

    if (seletedVariantArray.length == 0) {
      object.variants = seletedVariantArray1;
    }

    if (seletedActivity.length == 0 || seletedActivity1.length == 0) {
      object.activity = null;
    }
    if (selectedstartPoints.length == 0 && selectedEndPoints.length == 0) {
      object.startPoint = null;
      object.endPoint = null;
    }
    if (selectedstartPoints.length == 0 && selectedEndPoints.length != 0) {
      object.startPoint = selectedstartPoints1;
    }
    if (selectedstartPoints.length != 0 && selectedEndPoints.length == 0) {
      object.endPoint = selectedEndPoints1;
    }

    this.selectedFilterValues.emit(object);
    this.applyFilterValue.emit(true)

    if (seletedActivity.length != 0) {
      if (this.appliedFilters.indexOf('Activity') == -1) {
        this.appliedFilters.push("Activity")
      }
    }
    if (seletedVariantArray.length != 0) {
      if (this.appliedFilters.indexOf('Variant') == -1) {
        this.appliedFilters.push("Variant")
      }
    }
    if (selectedstartPoints.length != 0 || selectedEndPoints.length != 0) {
      if (this.appliedFilters.indexOf('EndPoint') == -1) {
        this.appliedFilters.push("EndPoint")
      }
    }
  }

  closePerformancePopup() {
    this.filterby = "Activity";
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }

  startValue(e) {
    this.fcount = [];
    let fcount1 = [];
    this.perfrmanceFilterKeyValuepair.filter(res => {
      if (Number(res.duration) >= Number(this.minPerfValue) && Number(res.duration) <= Number(this.maxPerfValue)) {
        this.fcount.push(res);
      }
      if(Number(res.duration) < Number(this.minPerfValue) || Number(res.duration) > Number(this.maxPerfValue)){
        fcount1.push(res);      
      }
    });

    let single1=[];
    fcount1.filter(res => {
      single1.push({ name: res.duration, value: res.caseCount })
    });
    let custom_colorArray=[];
    for(var i=0; i<single1.length; i++){
      custom_colorArray.push({
        name: single1[i].name,
        value: '#333'
      })
    }
    this.customColors=custom_colorArray;

   
    var cc = 0;
    //const unique = [...new Set(this.fcount.map(item => item.caseCount))];
  
    this.fcount.filter(r => {
      cc += Number(r.caseCount);
    })
    this.chagnedCases = cc;
    let casePer = ((Number(this.chagnedCases) / Number(this.totalCases)) * 100).toFixed(0);
    this.casePercentage =Number(casePer);
    if(this.totalCases == this.chagnedCases){
      this.piesingle = [
        {name: "Total Cases", value: this.totalCases}
      ]
    } else {
    this.piesingle = [
      {name: "Total Cases", value: this.totalCases},
      {name: "Filter Cases", value: this.chagnedCases}
    ]
  }
  }
  endValue(e) {
    this.fcount = []
    let fcount1 = []
    this.perfrmanceFilterKeyValuepair.filter(res => {
      if (Number(res.duration) >= Number(this.minPerfValue) && Number(res.duration) <= Number(this.maxPerfValue)) {
        this.fcount.push(res);
      }
      // if(Number(res.duration) > Number(this.maxPerfValue)){
      if(Number(res.duration) < Number(this.minPerfValue) || Number(res.duration) > Number(this.maxPerfValue)){
        fcount1.push(res);        
      }
    });
    let single1=[];
    fcount1.filter(res => {
      single1.push({ name: res.duration, value: res.caseCount })
    });
    let custom_colorArray=[];
    for(var i=0; i<single1.length; i++){
      custom_colorArray.push({
        name: single1[i].name,
        value: '#333'
      })
    }

    this.customColors=custom_colorArray;
    var cc = 0;
    this.fcount.filter(r => {
      cc += Number(r.caseCount);
    })
    this.chagnedCases = cc;
    let casePer = ((Number(this.chagnedCases) / Number(this.totalCases)) * 100).toFixed(0);
    this.casePercentage =Number(casePer);
    if(this.totalCases == this.chagnedCases){
      this.piesingle = [
        {name: "Total Cases", value: this.totalCases}
      ]
    } else {
    this.piesingle = [
      {name: "Total Cases", value: this.totalCases},
      {name: "Filter Cases", value: this.chagnedCases}
    ]
  }

  }

  setselectedFilter(type){
    this.performanceLogic(this.performanceFilterInput, type)
  }

  performanceLogic(performData, pType) {
    this.isnoof_casesInput=false;
      this.isnoof_casesInput1=false;
    if(pType == 'caseduration'){
      this.getCaseDurationMetrics(performData)
    } else if(pType == 'meanactivetime'){
      this.getMeanActiveTime(performData);
    } else if(pType == 'meanwaitingtime'){
      this.getMeanWaitingTime(performData);
    } else if(pType == 'medianactivetime'){
      this.getMedianActiveTime(performData)
    } else if(pType == 'medianwaitingtime'){
      this.getMedianWaitingTime(performData)
    } else if(pType == 'caseutilization'){
      this.getCaseUtilization(performData)
    } else if(pType == 'noofcases'){
      this.getNoOfCases(performData)
      this.isnoof_casesInput=true;
      this.isnoof_casesInput1=true;
    }
    
  }
  convertMS(ms) {
    if(this.pFilterType == 'noofcases'){
      return ms;
    }else if(this.pFilterType == 'caseutilization'){
      return Number(Number(ms).toFixed(2));
    } else{
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;

    var pad = function (n) { return n < 10 ? '0' + n : n; };
    var result: any;
    if (d == 0) {
      result = pad(h) + ' hours ,' + pad(m) + ' mins';
    } else {
      var ext = 'day';
      (d == 1) ? ext = " day" : ext = " days";
      result = d + ext + ' ,' + pad(h) + ' hours ,' + pad(m) + ' mins';
    }

    return result;
  } 
  };
  getCaseDurationMetrics(pData){

    this.performanceTotalDuration =[];
    this.perfrmanceFilterKeyValuepair =[];
    this.single = [];
    this.totalCases = 0;
    this.minPerfValue = 0;
    this.maxPerfValue = 0;
    this.options1 = {};
    // console.log("pData",pData)
    pData.data.filter(res => {
      this.totalCases += Number(res.case_value);
      this.performanceTotalDuration.push({ durationArray: res.filter_total_durations, caseValue: res.case_value });
    });

    this.performanceTotalDuration.forEach((obj) => {
      obj.durationArray.forEach(objDuartion => {
        Object.entries(objDuartion).forEach(([key, value]) => {
          this.perfrmanceFilterKeyValuepair.push({ duration: key, caseID: value['caseIds'],caseCount: value['bar_graph_count_caseIds'], noofCases: obj.caseValue })
        });
      });
    });
    this.perfrmanceFilterKeyValuepair = this.perfrmanceFilterKeyValuepair.sort((a, b) => {
      return a.duration - b.duration;
    });
    this.perfrmanceFilterKeyValuepair.filter(res => {
      this.single.push({ name: res.duration, value: res.caseCount })
    });

    // console.log(this.single)
    this.options1 = {

      floor: Number(this.perfrmanceFilterKeyValuepair[0].duration),
      ceil: Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration),
      // translate: (value: number): string => `${value}%`,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            this.minPerfValue = value;
            //console.log(value);
            return this.convertMS(value);
          case LabelType.High:
            this.maxPerfValue = value;
           // console.log(value);
            return this.convertMS(value);
          default:
            return this.convertMS(value);
        }
      },
      hideLimitLabels: true,
      hidePointerLabels: false,
      vertical: false,
    }
    this.vaue = Number(this.perfrmanceFilterKeyValuepair[0].duration)
    this.highValue = Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration)
    // console.log(this.casePercentage);
  }
  getMeanActiveTime(pData){
   
    this.performanceTotalDuration =[];
    this.perfrmanceFilterKeyValuepair =[];
    this.single = [];
    this.totalCases = 0;
    this.minPerfValue = 0;
    this.maxPerfValue = 0;
    this.options1 = {};
    pData.data.filter(res => {
      this.totalCases += Number(res.case_value);
      this.performanceTotalDuration.push({ durationArray: res.filter_mean_active_time, caseValue: res.case_value });
    });

    this.performanceTotalDuration.forEach((obj) => {
      obj.durationArray.forEach(objDuartion => {
        Object.entries(objDuartion).forEach(([key, value]) => {
          this.perfrmanceFilterKeyValuepair.push({ duration: key, caseID: value['caseIds'],caseCount: value['bar_graph_count_caseIds'], noofCases: obj.caseValue })
        });
      });
    });
    this.perfrmanceFilterKeyValuepair = this.perfrmanceFilterKeyValuepair.sort((a, b) => {
      return a.duration - b.duration;
    });
    this.perfrmanceFilterKeyValuepair.filter(res => {
      this.single.push({ name: res.duration, value: res.caseCount })
    });
    this.options1 = {

      floor: Number(this.perfrmanceFilterKeyValuepair[0].duration),
      ceil: Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration),
      // translate: (value: number): string => `${value}%`,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            this.minPerfValue = value;
            return this.convertMS(value);
          case LabelType.High:
            this.maxPerfValue = value;
            return this.convertMS(value);
          default:
            return this.convertMS(value);
        }
      },
      hideLimitLabels: true,
      hidePointerLabels: false,
      vertical: false,
    }
    this.vaue = Number(this.perfrmanceFilterKeyValuepair[0].duration)
    this.highValue = Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration)

  }

  getMeanWaitingTime(pData){
    this.performanceTotalDuration =[];
    this.perfrmanceFilterKeyValuepair =[];
    this.single = [];
    this.totalCases = 0;
    this.minPerfValue = 0;
    this.maxPerfValue = 0;
    this.options1 = {};
    pData.data.filter(res => {
      this.totalCases += Number(res.case_value);
      this.performanceTotalDuration.push({ durationArray: res.filter_mean_wait_time, caseValue: res.case_value });
    });

    this.performanceTotalDuration.forEach((obj) => {
      obj.durationArray.forEach(objDuartion => {
        Object.entries(objDuartion).forEach(([key, value]) => {
          this.perfrmanceFilterKeyValuepair.push({ duration: key, caseID: value['caseIds'],caseCount: value['bar_graph_count_caseIds'], noofCases: obj.caseValue })
        });
      });
    });
    this.perfrmanceFilterKeyValuepair = this.perfrmanceFilterKeyValuepair.sort((a, b) => {
      return a.duration - b.duration;
    });
    this.perfrmanceFilterKeyValuepair.filter(res => {
      this.single.push({ name: res.duration, value: res.caseCount })
    });

    this.options1 = {

      floor: Number(this.perfrmanceFilterKeyValuepair[0].duration),
      ceil: Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration),
      // translate: (value: number): string => `${value}%`,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            this.minPerfValue = value;
            return this.convertMS(value);
          case LabelType.High:
            this.maxPerfValue = value;
            return this.convertMS(value);
          default:
            return this.convertMS(value);
        }
      },
      hideLimitLabels: true,
      hidePointerLabels: false,
      vertical: false,
    }
    this.vaue = Number(this.perfrmanceFilterKeyValuepair[0].duration)
    this.highValue = Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration)

  }

  getMedianActiveTime(pData){
    this.performanceTotalDuration =[];
    this.perfrmanceFilterKeyValuepair =[];
    this.single = [];
    this.totalCases = 0;
    this.minPerfValue = 0;
    this.maxPerfValue = 0;
    this.options1 = {};
    pData.data.filter(res => {
      this.totalCases += Number(res.case_value);
      this.performanceTotalDuration.push({ durationArray: res.filter_median_active_time, caseValue: res.case_value });
    });

    this.performanceTotalDuration.forEach((obj) => {
      obj.durationArray.forEach(objDuartion => {
        Object.entries(objDuartion).forEach(([key, value]) => {
          this.perfrmanceFilterKeyValuepair.push({ duration: key, caseID: value['caseIds'],caseCount: value['bar_graph_count_caseIds'], noofCases: obj.caseValue })
        });
      });
    });
    this.perfrmanceFilterKeyValuepair = this.perfrmanceFilterKeyValuepair.sort((a, b) => {
      return a.duration - b.duration;
    });
    this.perfrmanceFilterKeyValuepair.filter(res => {
      this.single.push({ name: res.duration, value: res.caseCount })
    });

    this.options1 = {

      floor: Number(this.perfrmanceFilterKeyValuepair[0].duration),
      ceil: Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration),
      // translate: (value: number): string => `${value}%`,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            this.minPerfValue = value;
            return this.convertMS(value);
          case LabelType.High:
            this.maxPerfValue = value;
            return this.convertMS(value);
          default:
            return this.convertMS(value);
        }
      },
      hideLimitLabels: true,
      hidePointerLabels: false,
      vertical: false,
    }
    this.vaue = Number(this.perfrmanceFilterKeyValuepair[0].duration)
    this.highValue = Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration)

  }

  getMedianWaitingTime(pData){
    this.performanceTotalDuration =[];
    this.perfrmanceFilterKeyValuepair =[];
    this.single = [];
    this.totalCases = 0;
    this.minPerfValue = 0;
    this.maxPerfValue = 0;
    this.options1 = {};
    pData.data.filter(res => {
      this.totalCases += Number(res.case_value);
      this.performanceTotalDuration.push({ durationArray: res.filter_median_waiting_time, caseValue: res.case_value });
    });

    this.performanceTotalDuration.forEach((obj) => {
      obj.durationArray.forEach(objDuartion => {
        Object.entries(objDuartion).forEach(([key, value]) => {
          this.perfrmanceFilterKeyValuepair.push({ duration: key, caseID: value['caseIds'],caseCount: value['bar_graph_count_caseIds'], noofCases: obj.caseValue })
        });
      });
    });
    this.perfrmanceFilterKeyValuepair = this.perfrmanceFilterKeyValuepair.sort((a, b) => {
      return a.duration - b.duration;
    });
    this.perfrmanceFilterKeyValuepair.filter(res => {
      this.single.push({ name: res.duration, value: res.caseCount })
    });

    this.options1 = {

      floor: Number(this.perfrmanceFilterKeyValuepair[0].duration),
      ceil: Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration),
      // translate: (value: number): string => `${value}%`,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            this.minPerfValue = value;
            return this.convertMS(value);
          case LabelType.High:
            this.maxPerfValue = value;
            return this.convertMS(value);
          default:
            return this.convertMS(value);
        }
      },
      hideLimitLabels: true,
      hidePointerLabels: false,
      vertical: false,
    }
    this.vaue = Number(this.perfrmanceFilterKeyValuepair[0].duration)
    this.highValue = Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration)

  }

  getCaseUtilization(pData){
    this.performanceTotalDuration =[];
    this.perfrmanceFilterKeyValuepair =[];
    this.single = [];
    this.totalCases = 0;
    this.minPerfValue = 0;
    this.maxPerfValue = 0;
    this.options1 = {};
    pData.data.filter(res => {
      this.totalCases += Number(res.case_value);
      this.performanceTotalDuration.push({ durationArray: res.filter_case_utlization, caseValue: res.case_value });
    });

    this.performanceTotalDuration.forEach((obj) => {
      obj.durationArray.forEach(objDuartion => {
        Object.entries(objDuartion).forEach(([key, value]) => {
          this.perfrmanceFilterKeyValuepair.push({ duration: key, caseID: value['caseIds'],caseCount: value['bar_graph_count_caseIds'], noofCases: obj.caseValue })
        });
      });
    });
    this.perfrmanceFilterKeyValuepair = this.perfrmanceFilterKeyValuepair.sort((a, b) => {
      return a.duration - b.duration;
    });
    this.perfrmanceFilterKeyValuepair.filter(res => {
      this.single.push({ name: res.duration, value: res.caseCount })
    });
    this.options1 = {
      step: 0.1,
      floor: Number(Number(this.perfrmanceFilterKeyValuepair[0].duration).toFixed(2)),
      ceil: Number(Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration).toFixed(2)),
      // translate: (value: number): string => `${value}%`,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            this.minPerfValue = value;
            return this.convertMS(value);
          case LabelType.High:
            this.maxPerfValue = value;
            return this.convertMS(value);
          default:
            return this.convertMS(value);
        }
      },
      hideLimitLabels: true,
      hidePointerLabels: false,
      vertical: false,
    }
    this.vaue = Number(Number(this.perfrmanceFilterKeyValuepair[0].duration).toFixed(2))
    this.highValue = Number(Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration).toFixed(2));
  }

  getNoOfCases(pData){
    this.performanceTotalDuration =[];
    this.perfrmanceFilterKeyValuepair =[];
    this.single = [];
    this.totalCases = 0;
    this.minPerfValue = 0;
    this.maxPerfValue = 0;
    this.options1 = {};
    pData.data.filter(res => {
      this.totalCases += Number(res.case_value);
      this.performanceTotalDuration.push({ durationArray: res.filter_num_of_cases, caseValue: res.case_value });
    });

    this.performanceTotalDuration.forEach((obj) => {
      obj.durationArray.forEach(objDuartion => {
        Object.entries(objDuartion).forEach(([key, value]) => {
          this.perfrmanceFilterKeyValuepair.push({ duration: key, caseID: value['caseIds'],caseCount: value['bar_graph_count_caseIds'], noofCases: obj.caseValue })
        });
      });
    });
    this.perfrmanceFilterKeyValuepair = this.perfrmanceFilterKeyValuepair.sort((a, b) => {
      return a.duration - b.duration;
    });
    this.perfrmanceFilterKeyValuepair.filter(res => {
      this.single.push({ name: res.duration, value: res.caseCount })
    });
    // console.log(this.single)

    this.options1 = {

      floor: Number(this.perfrmanceFilterKeyValuepair[0].duration),
      ceil: Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration),
      // translate: (value: number): string => `${value}%`,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            this.minPerfValue = value;
            return this.convertMS(value);
          case LabelType.High:
            this.maxPerfValue = value;
            return this.convertMS(value);
          default:
            return this.convertMS(value);
        }
      },
      hideLimitLabels: true,
      hidePointerLabels: false,
      vertical: false,
    }
    this.vaue = Number(this.perfrmanceFilterKeyValuepair[0].duration)
    this.highValue = Number(this.perfrmanceFilterKeyValuepair[this.perfrmanceFilterKeyValuepair.length - 1].duration)
  }


  applyPerformanceFilter(){
    this.closePerformancePopup();
    var reqObj = {
      "min_tot_duration":this.minPerfValue,
      "max_tot_duration":this.maxPerfValue,
      "filterType": this.pFilterType
    }
    this.appliedPerformanceFiterValues.emit(reqObj)
  }

  ontimedropdown_change(e){
      this.isDays_input=false;
      this.isHrs_input=false;
      this.isMints_input=false;

    if(this.time_dropwnValue=="Days"){
      this.isDays_input=true;
    }else if(this.time_dropwnValue=="Hours"){
      this.isHrs_input=true;
    }else if(this.time_dropwnValue=="Minutes"){
      this.isMints_input=true;
    }
  }
  ontimedropdown_change1(e){
    this.isDays_input1=false;
    this.isHrs_input1=false;
    this.isMints_input1=false;

  if(this.endtime_dropwnValue=="Days"){
    this.isDays_input1=true;
  }else if(this.endtime_dropwnValue=="Hours"){
    this.isHrs_input1=true;
  }else if(this.endtime_dropwnValue=="Minutes"){
    this.isMints_input1=true;
  }
}

  onminvalueSet(){
    if(this.pFilterType=="noofcases"){
      this.vaue=this.noof_casesInput_value
    }else{
      let h,m,d;
      h=m=d=0;
      if(this.setvalue_input){
        d=Number(this.setvalue_input)*60000*60*24;
      }
      if(this.setvalue_input1){
        h=Number(this.setvalue_input1)*60000* 60;
      }
      if(this.setvalue_input2){
        m=Number(this.setvalue_input2)*60000;
      }
    this.vaue=d+h+m;
    }
  }

  onmaxvalueSet(){
    if(this.pFilterType=="noofcases"){
      this.highValue=this.noof_casesInput_value1
    }else{
    let h,m,d;
        h=m=d=0;
        if(this.set_endvalue_input){
          d=Number(this.set_endvalue_input)*60000*60*24;
        }
        if(this.set_endvalue_input1){
          h=Number(this.set_endvalue_input1)*60000* 60;
        }
        if(this.set_endvalue_input2){
          m=Number(this.set_endvalue_input2)*60000;
        }
      this.highValue=d+h+m;
    }
    }


} 