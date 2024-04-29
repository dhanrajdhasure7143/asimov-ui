import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-predefined-bots-orchestration',
  templateUrl: './predefined-bots-orchestration.component.html',
  styleUrls: ['./predefined-bots-orchestration.component.css']
})
export class PredefinedBotsOrchestrationComponent implements OnInit {

  columns_list: any[] = [
    { ColumnName: "automationName", DisplayName: "Automation Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false,showTooltip:true },
    { ColumnName: "predefinedBotType", DisplayName: "Type", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "convertedSchedule", DisplayName: "Schedule", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false,width:"flex: 0 0 20rem", showTooltip:true },
    { ColumnName: "action", DisplayName: "Action", ShowGrid: true, ShowFilter: false, filterWidget: "normal", filterType: "text", sort: false, multi: false, }
  ];
  scheduledbots:any[]=[];
  // scheduledbots = [
  //   {
  //     AutomationName: "Cipal Recruitment",
  //     Schedule: "2024-05-01",
  //     id:'pre-6473824',
  //     type:"Recruitment bot"
  //   },
  //   {
  //     AutomationName: "Epsot",
  //     Schedule: "2024-05-01",
  //     id:'rec-6473824',
  //     type:"Recuritment Bot"
  //   },
  //   {
  //     AutomationName: "ABC",
  //     Schedule: "2024-05-01",
  //     id:'mar_74797584',
  //     type:"Marketing Bot"
  //   },
  //   {
  //     AutomationName: "XYZ MA",
  //     Schedule: "2024-05-01",
  //     id:'mar_74797584',
  //     type:"Marketing Bot"
  //   }
  // ]
  table_searchFields: any = [];
  showOverlay: boolean = false;
  showBotForm: boolean = false;

  constructor(
    private rest: RestApiService,
    private spinner: LoaderService,
    private router: Router,
    private rest_api: PredefinedBotsService,
    private toaster : ToasterService,
    private toastMessage: toastMessages,
    private confirmationService: ConfirmationService,

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getListOfItems();
  }

  getListOfItems(){
    this.rest_api.getOrchestrationPredefinedBotsList().subscribe((res:any)=>{
      console.log("res",res);
      this.scheduledbots = res.data
      this.scheduledbots.map(item=>{
        item["convertedSchedule"] = this.convertSchedule(item.schedule)
      })
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
    })
  }

    convertSchedule(schedule) {
      try {
        // Try parsing schedule as JSON
        const scheduleData = JSON.parse(schedule);
        // If successful, assume it's a schedule object
        const startDateArray = scheduleData.startDate.split(',').map(Number);
        const endDateArray = scheduleData.endDate.split(',').map(Number);
        const interval = scheduleData.scheduleInterval;

        // Formatting start date
        const startDate = new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2], startDateArray[3], startDateArray[4]);
        const formattedStartDate = startDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

        // Formatting end date
        const endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2], endDateArray[3], endDateArray[4]);
        const formattedEndDate = endDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

        // Converting interval to human-readable format
        const intervalParts = interval.split(' ');
        const frequency = intervalParts[1];

        // Creating a string for the desired format
        return `${formattedStartDate} - ${formattedEndDate}`;
      } catch (error) {

          // If parsing as JSON fails, assume it's just a date
          return schedule;
      }
    }

  ngOnChanges() {

  }

  ngAfterViewInit() {

  }

  deleteById(event: any) {
    let botName = event.automationName
    this.confirmationService.confirm({
      message: "Do you want to delete this bot? This can't be undo.",
      header: "Are you sure?",
      acceptLabel: "Yes",
      rejectLabel: "No",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show();
        this.rest_api.deletePredefinedBot(event.predefinedOrchestrationBotId).subscribe(res => {
          this.toaster.showSuccess(botName,"delete")
          this.getListOfItems();
        }, err => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessage.apierror)
        });
      },
      reject: (type) => { }
    });
  }

  viewDetails($event: any) {

  }

  editById(item: any) {
    console.log("testing",item)
    this.router.navigate(["/pages/predefinedbot/predefinedforms"],{queryParams:{type:"edit",id:item.predefinedOrchestrationBotId}});
  }

  runById(event: any) {
    console.log(event)
    this.confirmationService.confirm({
      message: "Do you want to execute bot?",
      header: "Confirmation",
      acceptLabel: "Yes",
      rejectLabel: "No",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show();
        this.rest_api.startPredefinedBot(event.predefinedOrchestrationBotId).subscribe(res => {
          this.toaster.toastSuccess(this.toastMessage.botExcecution_success);
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessage.botExcecution_fail)
        })
      }
    })
  }

  stopById($event: any) {

  }


}
