import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-predefined-bot-list',
  templateUrl: './predefined-bot-list.component.html',
  styleUrls: ['./predefined-bot-list.component.css']
})
export class PredefinedBotListComponent implements OnInit {
  predefined_botsList=[
    {id:"recruitment",botname:"Recruitment Bot"},
    {id:"marketing",botname:"Marketing Bot"}
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onclickBot(item){
    console.log(item)
    if(item.id =='marketing'){
      this.router.navigate(["/pages/serviceOrchestration/dynamicForm"],{queryParams:{type:"create",id:item.id}});
    }
    if(item.id =='recruitment'){
      this.router.navigate(["/pages/serviceOrchestration/prdefinedForm"],{queryParams:{type:"create",id:item.id}});
    }
  }

}
