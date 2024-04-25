import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-predefined-bots-list',
  templateUrl: './predefined-bots-list.component.html',
  styleUrls: ['./predefined-bots-list.component.css']
})
export class PredefinedBotsListComponent implements OnInit {

  predefined_botsList = [
    { id: "recruitment", botname: "Recruitment Bot" },
    { id: "marketing", botname: "Marketing Bot" },
    { id: "sales", botname: "Sales Bot" },
    { id: "customer_support", botname: "Customer Support Bot" },
    { id: "hr", botname: "HR Bot" },
    { id: "it_support", botname: "IT Support Bot" },
    { id: "ecommerce", botname: "E-commerce Bot" },
    { id: "healthcare", botname: "Healthcare Bot" },
    { id: "finance", botname: "Finance Bot" },
    { id: "travel", botname: "Travel Bot" },
    { id: "sports", botname: "Sports Bot" }
];


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onclickBot(item){
    console.log(item)
    if(item.id =='marketing'){
      this.router.navigate(["/pages/predefinedbot/predefinedforms"],{queryParams:{type:"create",id:item.id}});
    }
    if(item.id =='recruitment'){
      this.router.navigate(["/pages/predefinedbot/predefinedforms"],{queryParams:{type:"create",id:item.id}});
    }
  }

}
