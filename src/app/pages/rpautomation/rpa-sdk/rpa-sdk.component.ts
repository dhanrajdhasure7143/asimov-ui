import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rpa-sdk',
  templateUrl: './rpa-sdk.component.html',
  styleUrls: ['./rpa-sdk.component.css']
})
export class RpaSdkComponent implements OnInit {
  isCreateForm: boolean;
  hideLables: boolean;
  hiddenPopUp: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  openCreateCredential(){
    this.isCreateForm = true;
    this.hideLables = false
    this.hiddenPopUp=true;
  }

  refreshCredentialList(event){
    if(event){
      this.hiddenPopUp=false;
    }
  }

  closeOverlay(event){
    this.hiddenPopUp=false;
  }

}
