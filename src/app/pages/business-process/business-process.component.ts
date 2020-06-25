import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../services/data-transfer.service';

@Component({
  selector: 'app-bussiness-process',
  template: `<div class="module-heading">
              <div class="container">
                <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>
                <span class="module-heading-title">Business Process Studio</span>
              </div>
            </div><router-outlet></router-outlet><div class="spinoverlay" *ngIf="isLoading"><div class="spincenter">
            <mat-progress-spinner diameter=50  mode="indeterminate"></mat-progress-spinner> 
            </div></div>`,
  styleUrls: ['./business-process.component.css'] 
})
export class BusinessProcessComponent implements OnInit {
  isLoading:boolean = false;

  constructor(private dt:DataTransferService) { }

  ngOnInit(){
    this.dt.is_loading.subscribe(res => this.isLoading = res);
  }

}
