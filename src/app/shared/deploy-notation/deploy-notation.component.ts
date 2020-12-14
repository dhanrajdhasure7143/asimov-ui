import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deploy-notation',
  templateUrl: './deploy-notation.component.html',
  styleUrls: ['./deploy-notation.component.css']
})
export class DeployNotationComponent implements OnInit {
  deploy_success: boolean = false;
  constructor() { }

  ngOnInit() {
    this.deploy_success = false;
  }

  deployNotation(){
    this.deploy_success = true;
  }
  playDeployedNotation(){

  }
}
