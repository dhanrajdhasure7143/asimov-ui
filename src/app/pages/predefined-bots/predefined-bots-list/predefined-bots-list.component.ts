import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

@Component({
  selector: 'app-predefined-bots-list',
  templateUrl: './predefined-bots-list.component.html',
  styleUrls: ['./predefined-bots-list.component.css']
})
export class PredefinedBotsListComponent implements OnInit {
  predefined_botsList:any[]=[];


  constructor(private router: Router,
    private spinner: LoaderService,
    private rest_api : PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessage : toastMessages
    ) { }

  ngOnInit(): void {
    this.getPredefinedBotsList();
  }

  getPredefinedBotsList(){
    this.spinner.show();
    this.rest_api.getPredefinedBotsList().subscribe((res:any)=>{
      this.predefined_botsList = res.data
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror)
    })

  }

  onclickBot(item){
      this.router.navigate(["/pages/predefinedbot/predefinedforms"],{queryParams:{type:"create",id:item.productId}});
  }

}
