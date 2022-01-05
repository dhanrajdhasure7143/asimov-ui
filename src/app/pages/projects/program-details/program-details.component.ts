import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService} from '../../services/rest-api.service'
import { NgxSpinnerService} from 'ngx-spinner'
import {  ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Base64 } from 'js-base64';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import moment from 'moment';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.css']
})
export class ProgramDetailsComponent implements OnInit {
  unassigned_projects: any=[];
  addprojectsForm:FormGroup;
  owner_letters: any;
  program_id: any;
  programeNameFlag: boolean = false;
  programePurposeFlag: boolean = false;

  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    private route:ActivatedRoute,
    private router:Router,
    private formBuilder:FormBuilder,
    private modalservice:BsModalService,
    ) { }

    projects_and_programs_list:any=[];
    program_detials:any;
    linked_projects:any=[];
    users_list:any=[];
    insertForm2:FormGroup;
    modalref:BsModalRef;
    mindate:any;
    selected_process_names:any=[];
    editdata:Boolean=false;
    displayedColumns8: string[] = ["initiatives","projectName","owner","status","projectPercentage","lastModifiedTimestamp","lastModifiedBy", "createdBy","action"];
    dataSource8:MatTableDataSource<any>;
    selectedProgram_id:any
    @ViewChild("sort104",{static:false}) sort104: MatSort;
    @ViewChild("paginator104",{static:false}) paginator104: MatPaginator;
    public userRoles: any;
    public name: any;
    email: any;
    public userRole:any = [];
    public userName:any;
    initiatives: any;
  ngOnInit() {
   // this.getprojects_and_programs();
   this.userRoles = localStorage.getItem("userRole")
   this.userRoles = this.userRoles.split(',');
   this.userName=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName");
   this.email=localStorage.getItem('ProfileuserId');

    this.mindate= moment().format("YYYY-MM-DD");
    this.getallusers();
    this.getprocessnames();
    this.getunassignedprojectslist(this.userRoles,this.userName,this.email);
    
    setTimeout(()=>{
      this.getpiechart();
      this.get_project_duration_chart();
      this.getlinechart();
    },500)
    this.insertForm2=this.formBuilder.group({
      projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      mapValueChain: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      endDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      startDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      measurableMetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      description: ["", Validators.compose([Validators.maxLength(150)])],
      access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
     // status: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  
  })
  this.addprojectsForm=this.formBuilder.group({
      
    projects: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
    
    })
    
    this.getInitiatives();
    this.getprogramdetails();
  }
  

  // getprojects_and_programs()
  // {
  //   this.spinner.show()
  //   this.userRoles = localStorage.getItem("userRole")
  //   this.userRoles = this.userRoles.split(',');
  //   this.name=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName")
  //   this.email=localStorage.getItem('ProfileuserId');
  //   this.rest.getAllProjects(this.userRoles,this.name,this.email).subscribe(data=>{
  //     this.spinner.hide()
  //     this.projects_and_programs_list=data;
  //     this.getprogramdetails();
  //   })
  // }



  getprocessnames()
  {
    this.rest.getprocessnames().subscribe(processnames=>{
      let resp:any=[]
      resp=processnames
      this.selected_process_names=resp.filter(item=>item.status=="APPROVED");
    })
  }


  getprogramdetails(){
   
    this.spinner.show()
    // this.route.queryParams.subscribe(data=>{
    //   let program_id=data.id;
    //   this.selectedProgram_id=program_id
    //   this.get_linked_projects(program_id);
    //   this.program_detials=this.projects_and_programs_list[0].find(item=>item.id==program_id);
    //   console.log("pgrmdata: ", this.program_detials)
    //   if(this.program_detials){
    //     let usr_name=this.program_detials.owner.split('@')[0].split('.');
    //     this.owner_letters=usr_name[0].charAt(0)+usr_name[1].charAt(0);
    //     console.log(this.owner_letters)
    //     }
    //   this.editdata=false;
    // });
    this.route.queryParams.subscribe(data=>{
      this.program_id=data.id;
    this.rest.getProgrmaDetailsById(this.program_id).subscribe(data=>{
      this.program_detials=data;
      if(this.program_detials){
        let usr_name=this.program_detials.owner.split('@')[0].split('.');
        // this.owner_letters=usr_name[0].charAt(0)+usr_name[1].charAt(0);
        if(usr_name.length > 1){
          this.owner_letters=usr_name[0].charAt(0)+usr_name[1].charAt(0);
          }else{
            this.owner_letters=usr_name[0].charAt(0);
          }
       
        }
        this.editdata=false;
      this.get_linked_projects(this.program_id);
      this.spinner.hide()
    })
    });
  }


  get_linked_projects(id)
  {
    this.rest.getProjectsByProgramId(id).subscribe(list=>{
      this.linked_projects=list;
     
      this.dataSource8= new MatTableDataSource(this.program_detials.project);
      this.dataSource8.sort=this.sort104;
      this.dataSource8.paginator=this.paginator104;
    })
  }



  getpiechart()
  {
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("project-cost", am4charts.PieChart);

    // Add data
    chart.data = [ {
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czechia",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }];

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    // This creates initial animation
    
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

  }


  get_project_duration_chart()
  {
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("project-duration", am4charts.XYChart);


    // Add data
    chart.data = [{
      "year": "Category 1",
      "europe": 2.5,
      "namerica": 2.5,
      "asia": 2.1,
     
    }, {
      "year": "Category 2",
      "europe": 2.6,
      "namerica": 2.7,
      "asia": 2.2,
  
    }, {
      "year": "Category 3",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
   
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    
    valueAxis.renderer.labels.template.disabled = false;
    valueAxis.min = 0;
    //valueAxis.renderer.labels.template.hide();
    // Create series
    function createSeries(field, name) {
      
      // Set up series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "year";
      series.sequencedInterpolation = true;
      
      // Make it stacked
      series.stacked = true;
      
      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
      
      // Add label
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;
      
      return series;
    }

    createSeries("europe", "Europe");
    createSeries("namerica", "North America");
    createSeries("asia", "Asia-Pacific");
    createSeries("lamerica", "Latin America");
    createSeries("meast", "Middle-East");
    createSeries("africa", "Africa");

    // Legend
    chart.legend = new am4charts.Legend();
    chart.legend.disabled=true;
  }



  getlinechart()
  {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("line-chart", am4charts.XYChart);

    // Add data
    chart.data = [{
      "year": "Category 1",
      "italy": 1,
      "germany": 5,
      "uk": 3
    }, {
      "year": "Categorty 2",
      "italy": 1,
      "germany": 2,
      "uk": 6
    }, {
      "year": "Category 3",
      "italy": 2,
      "germany": 3,
      "uk": 1
    }, {
      "year": "Category 4",
      "italy": 3,
      "germany": 4,
      "uk": 1
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = true;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = true;
    valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "italy";
    series1.dataFields.categoryX = "year";
    series1.name = "Italy";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.visible  = false;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "germany";
    series2.dataFields.categoryX = "year";
    series2.name = 'Germany';
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "uk";
    series3.dataFields.categoryX = "year";
    series3.name = 'United Kingdom';
    series3.bullets.push(new am4charts.CircleBullet());
    series3.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";


    let hs1 = series1.segments.template.states.create("hover")
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    let hs2 = series2.segments.template.states.create("hover")
    hs2.properties.strokeWidth = 5;
    series2.segments.template.strokeWidth = 1;

    let hs3 = series3.segments.template.states.create("hover")
    hs3.properties.strokeWidth = 5;
    series3.segments.template.strokeWidth = 1;

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.disabled=true;
    // chart.legend.itemContainers.template.events.on("over", function(event){
    //   let segments = event.target.dataItem.dataContext.segments;
    //   segments.each(function(segment){
    //     segment.isHover = true;
    //   })
    // })

    // chart.legend.itemContainers.template.events.on("out", function(event){
    //   let segments = event.target.dataItem.dataContext.segments;
    //   segments.each(function(segment){
    //     segment.isHover = false;
    //   })
    // })
  }

  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.rest.getuserslist(tenantid).subscribe(data=>{
       this.users_list=data;
    })
  }

  
  projectDetailsbyId(id){

    this.rest.getProjectDetailsById(id).subscribe( res =>{
      let project=res;
      this.navigatetodetailspage(project)
    })
  }


  navigatetodetailspage(project){
    this.router.navigate(['/pages/projects/projectdetails'],{queryParams:{id:project.id,programId:this.program_detials.id}})
  }


  createproject(template)
  {
    this.userRoles = localStorage.getItem("userRole")
    if (this.userRoles == "User") {
      if (this.linked_projects.length == 1) {
        Swal.fire({
          title: 'Error',
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          heightAuto: false,
          confirmButtonText: 'Ok'
        })
      }
      else {
        this.resetcreateproject()
        this.modalref = this.modalservice.show(template, { class: "modal-lg" });
      }
    }
    else {
      this.resetcreateproject()
      this.modalref = this.modalservice.show(template, { class: "modal-lg" });
    }
  }


  linkcreateproject(event)
  {
    let data=(JSON.parse(event));
    this.spinner.show();
    this.rest.saveProjectByProgramId(this.program_detials.id, data).subscribe(res=>{
      let response:any=res;
      this.spinner.hide();
      this.modalref.hide();
      if(response.errorMessage==undefined)
      {
        Swal.fire("Success",response.message,"success");
        this.getprogramdetails();
      }
      else
        Swal.fire("Error",response.errorMessage,"error");
    })
  }


  deleteproject(project)
  {
    var projectdata:any=project;
    let delete_data=[{
      id:project.id,
      type:"Project"
    }]  
    Swal.fire({
      title: 'Enter Project Name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      let value:any=result.value
      if(value!=undefined)
      if(projectdata.projectName==value)
      {
        this.spinner.show();
        this.rest.delete_Project(delete_data).subscribe( res =>{ 
          this.spinner.hide();
          let response:any=res
          if(response.warningMessage ==="Project can't be deleted with status In Progress"){
            Swal.fire("Error","Project can't be deleted with status InProgress","error")
            this.getprogramdetails();
          }else
          if(response.errorMessage==undefined)
          {
            
            Swal.fire("Success","Project Deleted Successfully !!","success")
            this.getprogramdetails();
          }
          else
          {
            Swal.fire("Error",response.errorMessage,"error")
          }
        })
      }else
      {
        Swal.fire("Error","Entered Project Name is Invalid","error")
      }
    })
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //   if (result.value) {
    //     this.spinner.show();
    //     this.api.delete_Project(delete_data).subscribe( res =>{ 
    //       this.spinner.hide();
    //       let response:any=res
    //       if(response.errorMessage==undefined)
    //       {
    //         this.projects_list=[];
    //         Swal.fire("Success",response.message,"success")
    //         this.getallProjectsdata();
    //       }
    //       else
    //       {
    //         Swal.fire("Error",response.errorMessage,"error")
    //       }
    //     })
    //   }
    //   })
  }

  resetcreateproject()
  {
        this.insertForm2.reset();
        
        this.insertForm2.get("resources").setValue("");
        this.insertForm2.get("mapValueChain").setValue("");
        this.insertForm2.get("owner").setValue("");
        this.insertForm2.get("initiatives").setValue("");
        this.insertForm2.get("priority").setValue("");
        this.insertForm2.get("process").setValue("");
        
  }

  inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   } 
  }

  updateprogramDetails()
  {
    this.spinner.show()
    this.program_detials["type"]="Program";
    this.program_detials["programPurpose"]=this.program_detials.purpose
    this.rest.update_project(this.program_detials).subscribe(res=>{
      this.spinner.hide()
      let response:any=res;
      if(response.errorMessage == undefined)
        Swal.fire("Success","Program Updated Successfully !!","success")
      else
        Swal.fire("Error",response.errorMessage,"error");
      this.getprogramdetails();
      this.editdata=false;
    });
  }
  linkproject(template){
    this.userRoles = localStorage.getItem("userRole")
    if (this.userRoles == "User") {
      if (this.linked_projects.length == 1) {
        Swal.fire({
          title: 'Error',
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          heightAuto: false,
          confirmButtonText: 'Ok'
        })
      }
      else {
        this.resetprojects();
        this.modalref = this.modalservice.show(template);
      }
    }
    else {
      this.resetprojects();
      this.modalref = this.modalservice.show(template);
    }

  }
  getunassignedprojectslist(roles,name,email)
  {
    this.rest.getunassignedprojects(roles,name,email).subscribe(data=>{
      this.unassigned_projects=data;
    })
  }
  resetprojects(){
    this.addprojectsForm.reset();
    this.addprojectsForm.get("projects").setValue("");
  }
  save(){
    let req_body:any=this.addprojectsForm.get("projects").value;
    this.rest.savedata(this.program_id,req_body).subscribe(res=>{
      this.modalref.hide();
      if(res.message==="Project Added Successfully"){
        Swal.fire("Success","Project Added Successfully !!","success")
      }else
      Swal.fire("Error","Unable to add the Project","error");
     
      this.getprogramdetails();
    })
  }

  getInitiatives(){
    this.rest.getProjectIntitiatives().subscribe(res=>{
      let response:any=res;
      this.initiatives=response;
    })
  }

  getreducedValue(value) {​​​​​​​​
    if (value.length > 15)
    return value.substring(0,16) + '...';
    else
    return value;
  }​​​​​​​​
  programeNameMaxLength(value){
    if(value.length > 50){
    this.programeNameFlag = true;
    }else{
      this.programeNameFlag = false;
    }
     }
     programePurposeMaxLength(value){
    if(value.length > 150){
    this.programePurposeFlag = true;
    }else{
      this.programePurposeFlag = false;
    }
     }
}
