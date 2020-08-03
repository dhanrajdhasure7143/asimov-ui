import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTransferService } from "../services/data-transfer.service";
import { PagesHints } from '../model/pages.model';
import { RestApiService } from '../services/rest-api.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataArr:any[];
  public userRole:any = [];
  selectedIndex: number=0;
  error: string;

  constructor(private router: Router, private dt:DataTransferService, private rpa: RestApiService, private route: ActivatedRoute, private hints:PagesHints) { 

    this.route.queryParams.subscribe(params => {
      
      
      var acToken=params['accessToken']
      var refToken = params['refreshToken']
      if(acToken && refToken){      
      var accessToken=atob(acToken);
    var refreshToken=atob(refToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    }
     
       
    
    
    });
    
  }

  ngOnInit() {

    var tkn = localStorage.getItem("accessToken")
    
    
    
    this.dt.changeParentModule(undefined);
    this.dt.changeChildModule(undefined);
    this.rpa.getUserRole(2).subscribe(res=>{
      this.userRole=res.message;
     
      localStorage.setItem('userRole',this.userRole);
     if(this.userRole.includes('SuperAdmin')){
      this.dataArr = [
           {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},
           {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
           {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},
           {"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"}
         ];
         
      
     }else if(this.userRole.includes('Admin')){
      this.dataArr = [
        {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},
        {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
        {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},
        {"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"}
      
      ];
   
     }else if(this.userRole.includes('RPA Admin')){
      this.dataArr = [
        {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},
        {"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"}
        
      ];
   
     }else if(this.userRole.includes('RPA Designer')){
      this.dataArr = [
        {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},
        
      ];
   
     }else if(this.userRole.includes('Data Architect')){
      this.dataArr = [
        {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
        
      ];
     }else if(this.userRole.includes('Process Modeler')){
      this.dataArr = [
        {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
        
      ];
     }else if(this.userRole.includes('Automation Designer')){
      this.dataArr = [
        {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
        
      ];
     }else if(this.userRole.includes('Process Analyst')){
      this.dataArr = [
        {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},
        
      ];
     }else if(this.userRole.includes('Process Architect')){
      this.dataArr = [
        {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
        
      ];
     }else{

     }
    },error => {
      this.error = "Please complete your registration process";
      
    })
    // this.dataArr = [
    //   {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},
    //   {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
    //   {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},
    //   {"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"}
    // ];
     this.dt.changeHints(this.hints.homeHints);
  }

  navigateToModule(){
    console.log("sdnfsfnsd", this.dataArr[this.selectedIndex]);
    
    this.router.navigateByUrl('/pages/'+this.dataArr[this.selectedIndex].link);
  }

  loopTrackBy(index, term){
    return index;
  }

}
