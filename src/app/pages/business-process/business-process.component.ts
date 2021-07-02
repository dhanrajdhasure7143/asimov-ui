import { Component, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bussiness-process',
  template: `<div class="main-content">
              <div class="row content-area">
                <div class=" row module-heading title">
                    <div class="col-md-6 new-bps-header-title">
                        <span class="module-heading-title">Business Process Studio</span>
                            <div class="value">
                                <span class="level3"><strong>Level 3</strong> - Value Chain Acneage</span>
                                <span class="level3">Last Modified By: Peter James</span>
                                <span>Auto Save: April-09-2021</span>
                            </div> 
                    </div>
                    <div class="col-md-6 new-bps-icons">
                      <div class="row">
                        <button><img src="../assets/images/BPMS/Edit.svg"></button>
                        <button><img src="../assets/images/BPMS/Approve.svg"></button>
                        <button><img src="../assets/images/BPMS/download.svg"></button>
                        <button><img src="../assets/images/BPMS/share.svg"></button>
                        <button><img src="../assets/images/BPMS/Forward.svg"></button>
                        <button><img src="../assets/images/BPMS/copy.svg"></button>
                        <button><img src="../assets/images/BPMS/Favorite.svg"></button>
                        <button class="bps-save-icon"><img src="../assets/images/BPMS/save.svg"></button>
                        <button><img src="../assets/images/BPMS/refresh.svg"></button>
                        <button><img src="../assets/images/BPMS/Delete.svg"></button>
                        <button class="upload-btn bps-upload"><img src="../assets/images/BPMS/upload.svg">Upload</button>
                      </div>  
                    </div>
                </div>    
                <router-outlet></router-outlet>
              </div>
            </div>`,
  styleUrls: ['./business-process.component.css']
})
export class BusinessProcessComponent implements AfterViewChecked {

  isShowConformance: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngAfterViewChecked() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.isShowConformance = params['isShowConformance'] == 'true';
    });
  }

  route() {
    this.router.navigate(['/pages/home']);
  }


}
// <i class="fa fa-arrow-left" aria-hidden="true" (click)="route()"></i>&nbsp;&nbsp;&nbsp;
//                   <span class="module-heading-title">Business Process Studio</span>
//                   
