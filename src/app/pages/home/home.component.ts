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
  dataArr:any[] = [];
  public userRole:any = [];
  selectedIndex: number=0;
  error: string;
  newAccessToken:any;
  customUserRole: any;
  
  constructor(private router: Router, private dt:DataTransferService, private rpa: RestApiService, private route: ActivatedRoute, private hints:PagesHints) {

    this.route.queryParams.subscribe(params => {
      var acToken=params['accessToken']
      var refToken = params['refreshToken']
      var firstName=params['firstName']
      var lastName=params['lastName']
      var ProfileuserId=params['ProfileuserId']
      var tenantName=params['tenantName']
      if(acToken && refToken){
        var accessToken=atob(acToken);
        var refreshToken=atob(refToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("ProfileuserId", ProfileuserId);
        localStorage.setItem("tenantName", tenantName);
      }
    });
    this.rpa.getNewAccessToken().subscribe(resp=>{
      this.newAccessToken=resp;
      console.log("token",this.newAccessToken.accessToken)
      localStorage.setItem('accessToken', this.newAccessToken.accessToken);
  });
  }

  ngOnInit() {
    var tkn = localStorage.getItem("accessToken")
    this.dt.changeParentModule(undefined);
    this.dt.changeChildModule(undefined);
    this.rpa.getUserRole(2).subscribe(res=>{
    this.userRole=res.message;

      localStorage.setItem('userRole',this.userRole);
      if(this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('User')){
      this.dataArr = [
           {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},
           {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
           {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},
           {"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"}
         ];
     }

     if(this.userRole.includes('RPA Admin')){
      
       if(this.dataArr.filter(f=>f.id === 'RPABox' ).length <= 0){
         this.dataArr.push({"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"})
       }
       if(this.dataArr.filter(f=>f.id === 'SOBox' ).length <= 0){
        this.dataArr.push({"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"})
      }
      // this.dataArr = [
      //   {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},
      //   {"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"}

      // ];

     }
     if(this.userRole.includes('RPA Designer')){
      if(this.dataArr.filter(f=>f.id === 'RPABox' ).length <= 0){
        this.dataArr.push({"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"})
      }
      // this.dataArr = [
      //   {"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"},

      // ];

     }

     this.rpa.getCustomUserRole(2).subscribe(role=>{

      this.customUserRole=role.message[0].permission;
      var test = false;

      this.customUserRole.forEach(element => {
        if(!test){

        if(element.permissionName.includes('RPA_Bot_Create') ||element.permissionName.includes('RPA_Bot_Configuration_full')
        || element.permissionName.includes('RPA_Workspace_full') || element.permissionName.includes('RPA_Environmet_full') 
        || element.permissionName.includes('RPA_DbConnection_full')){
        console.log(element.permissionName)
          this.dataArr.push({"id":"RPABox", "img":"assets/images/Group 348.svg", "title":"RPA", "link":"rpautomation/home"})
        test = true;
        }
      }
          });
        
          
        })
        this.rpa.getCustomUserRole(2).subscribe(role=>{
          this.customUserRole=role.message[0].permission;
          var test = false;
        this.customUserRole.forEach(element => {
          if(!test){
          if(element.permissionName.includes('PI_upload_full')
          || element.permissionName.includes('PI_Workspace_full') || element.permissionName.includes('PI_Process_Graph_full')){
          console.log(element.permissionName)
            this.dataArr.push( {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"})
            test = true;
          }
          }
            });
           
          })
          this.rpa.getCustomUserRole(2).subscribe(role=>{
            this.customUserRole=role.message[0].permission;
            var test = false;
            this.customUserRole.forEach(element => {
              if(!test){
              if(element.permissionName.includes('Bpmn_Home_full')
              || element.permissionName.includes('Bpmn_Studio_full')){
                 console.log(element.permissionName)
                  this.dataArr.push( {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"})
                  test = true;
                }
              }
                });
              })

              this.rpa.getCustomUserRole(2).subscribe(role=>{
                this.customUserRole=role.message[0].permission;
                var test = false;
                this.customUserRole.forEach(element => {
                  if(!test){
                  if(element.permissionName.includes('SO_Dashboard_full')
                  || element.permissionName.includes('SO_Orchestration_full')|| element.permissionName.includes('SO_Bot_Management_full')
                  || element.permissionName.includes('SO_Inbox_full')){
                     console.log(element.permissionName)
                      this.dataArr.push({"id":"SOBox", "img":"assets/images/Group 216.1.svg", "title":"Service Orchestration", "link":"serviceOrchestration/home"})
                      test = true;
                    }
                  }
                    });
                  })

     if(this.userRole.includes('Data Architect') || this.userRole.includes('Process Modeler') || this.userRole.includes('Automation Designer')){
      if(this.dataArr.filter(f=>f.id === 'BPSBox' ).length <= 0){
        this.dataArr.push( {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"})
      }
     
      // this.dataArr = [
      //   {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"},
      // ];

     }
     if(this.userRole.includes('Process Analyst')){
      if(this.dataArr.filter(f=>f.id === 'PIBox' ).length <= 0){
        this.dataArr.push( {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"})
      }
      // this.dataArr = [
      //   {"id":"PIBox", "img":"assets/images/Group 214.svg", "title":"Process Intelligence", "link":"processIntelligence/upload"},

      // ];

     }
     if(this.userRole.includes('Process Architect')){
      if(this.dataArr.filter(f=>f.id === 'BPSBox' ).length <= 0){
        this.dataArr.push( {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"businessProcess/home"})
      }
      // this.dataArr = [
      //   {"id":"BPSBox", "img":"assets/images/Group 215.svg", "title":"Business Process Studio", "link":"approvalWorkflow/home"},
      // ];

     }
    },error => {
      this.error = "Please complete your registration process";

    })

     this.dt.changeHints(this.hints.homeHints);
  }

  navigateToModule(){
    this.router.navigateByUrl('/pages/'+this.dataArr[this.selectedIndex].link);
  }

  loopTrackBy(index, term){
    return index;
  }

}
