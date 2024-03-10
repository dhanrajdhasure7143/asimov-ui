import {ViewChild,Input, Output, Component,Injectable, OnInit, ElementRef, EventEmitter  } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
@Injectable()
@Component({
  selector: 'app-rpa-toolset',
  templateUrl: './rpa-toolset.component.html',
  styleUrls: ['./rpa-toolset.component.css']
})

export class RpaToolsetComponent implements OnInit {
  
    constructor(
      private rest:RestApiService,
      public dt:DataTransferService,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      ) { }

    public userFilter:any={name:""};
    @ViewChild('section') section: ElementRef<any>;
    @Input("toolsetItems") public templateNodes:any=[];
    @Output("closeToolset") closeToolset=new EventEmitter();
    userRole:any;
    search:any=false;
    sidenavbutton:Boolean=false;
    isMicroBotsTabActive: boolean = false;
    isToolSetTabActive: boolean = false;
    public microBotsUserFilter: any = { name: "" };
    microBotsList: any[] = [];
    microBotToDelete: any;

    ngOnInit() {
      this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
      this.dt.changeChildModule({"route":"/pages/rpautomation/home","title":"Designer"});
      this.getMicroBots();
      this.dt.microBotsList$.subscribe((microBotsList: any[]) => {
        this.microBotsList = microBotsList;
      });
    }
    searchclear(){
      this.search=false
      this.userFilter.name=""
      this.microBotsUserFilter.name = ""
    }
    closeToolsetEvent(){
      this.closeToolset.emit(null);
    }

    onTabChange(event: any) {
      this.isMicroBotsTabActive = event.index === 1;
      this.isToolSetTabActive = event.index === 0;
      this.searchclear();
    }

    get filteredMicroBotsList(): any[] {
      return this.microBotsList.filter(microBot =>
          microBot.microBotName.toLowerCase().includes(this.microBotsUserFilter.name.toLowerCase())
      );
  }
  
  getMicroBots(){
    this.rest.getMicroBots().subscribe((data: any[]) => {
      this.microBotsList = data;
    });
  }   

  showDeleteIcon(microBot: any) {
    microBot.showDeleteIcon = true;
  }

  hideDeleteIcon(microBot: any) {
    microBot.showDeleteIcon = false;
  }

  deleteMicroBot(microBot: any) {
    this.microBotToDelete = microBot;
    console.log("Deleting micro bot:", microBot);
     this.rest.deleteMicroBot(microBot.id).subscribe(
      (data: any) => {
        if (data.usedInOtherBots) {
          this.messageService.add({severity:'error', summary:'Warning', detail:`This Micro Bot is used in the following bots: ${data.usedInOtherBots.join(', ')}`});      
           }
      else{
      this.confirmationService.confirm({   
        header: 'Are you sure?',
        message: "Are you sure you want to delete this Micro Bot?",
        rejectLabel: "No",
        acceptLabel: "Yes",
        rejectButtonStyleClass: 'btn reset-btn',
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        rejectIcon: 'null',
        acceptIcon: 'null',
        key: 'positionDialog3',
        accept: () => {
          console.log("User confirmed deletion...");
          this.deleteMicroBotFromList();
        }
      })
    }
      })   
    }
    deleteMicroBotFromList() {
      const index = this.filteredMicroBotsList.indexOf(this.microBotToDelete);
      if (index !== -1) {
        this.filteredMicroBotsList.splice(index, 1);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Micro Bot deleted successfully' });
      }
    }
}