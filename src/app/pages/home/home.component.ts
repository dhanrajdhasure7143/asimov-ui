import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTransferService } from "../services/data-transfer.service";
import { PagesHints } from '../model/pages.model';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataArr:any[];
  selectedIndex: number=0;

  constructor(private router: Router, private dt:DataTransferService, private route: ActivatedRoute, private hints:PagesHints) { 

    this.route.queryParams.subscribe(params => {
      
      
      var acToken=params['accessToken']
      var refToken = params['refreshToken']
      var accessToken=atob(acToken);
    var refreshToken=atob(refToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

     
       
    
    
    });
    
  }

  ngOnInit() {

    this.dt.changeParentModule(undefined);
    this.dt.changeChildModule(undefined);
    this.dataArr = [
      {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},
      {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
      {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},
      {"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"}
    ];
    this.dt.changeHints(this.hints.homeHints);
  }

  navigateToModule(){
    this.router.navigateByUrl('/pages/'+this.dataArr[this.selectedIndex].link);
  }

  loopTrackBy(index, term){
    return index;
  }

}
