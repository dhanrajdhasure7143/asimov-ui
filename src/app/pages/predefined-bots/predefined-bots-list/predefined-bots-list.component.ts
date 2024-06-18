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
  predefined_botsList: any[] = [];
  filteredBotsList: any[] = [];
  searchTerm: string = '';
  unsubscribed_agents:any[]=[];
  displayModal: boolean = false;
  selectedBot: any;

  constructor(private router: Router,
    private spinner: LoaderService,
    private rest_api: PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessage: toastMessages) { }

  ngOnInit(): void {
    this.getPredefinedBotsList();
  }

  getPredefinedBotsList() {
    this.spinner.show();
    this.rest_api.getPredefinedBotsList().subscribe((res: any) => {
        res.data.forEach(bot => {
            const botDetails = {
                ...bot,
                details: bot.description || 'No Description Found'
            };
            if (bot.subscribed) {
                this.predefined_botsList.push(botDetails);
            } else {
                this.unsubscribed_agents.push(botDetails)
                this.filteredBotsList.push(botDetails);
            }
        });
        this.spinner.hide();
    }, err => {
        this.spinner.hide();
        this.toaster.showError(this.toastMessage.apierror);
    });
}

  onclickBot(item) {
    // this.router.navigate(["/pages/predefinedbot/predefinedforms"], { queryParams: { type: "create", id: item.productId} });
    // this.router.navigate(['/pages/predefinedbot/agent-details'], { state: { bot: item } });
    this.router.navigate(['/pages/predefinedbot/agent-details'],{ queryParams: { id: item.productId } });
  }

  onSearch(): void {
    this.filteredBotsList = [...this.unsubscribed_agents];

    if (this.searchTerm.trim() !== '') {
      this.filteredBotsList = this.filteredBotsList.filter(bot =>
        bot.predefinedBotName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

//   navigateToBotDetails(bot: any): void {
//     this.router.navigate(['/bot-details', bot.id], { state: { bot } });
// }

  onclickBot2(item): void {
    // this.router.navigate(['/pages/predefinedbot/predefinedconfig'], { state: { bot: item } });
    this.router.navigate(['/pages/predefinedbot/predefinedconfig'],  { queryParams: { type: "create", id: item.productId, name: item.predefinedBotName, desc: item.details, isVisible:"true" } });
  }

  onclickBot3(item): void {
    // this.router.navigate(['/pages/predefinedbot/predefinedconfig'], { state: { bot: item } });
    // this.router.navigate(['/pages/predefinedbot/predefinedconfig'],  { queryParams: { type: "create", id: item.productId, name: item.predefinedBotName, desc: item.details, isVisible:"false" } });
  }

  showMore(event: Event, bot: any) {
    event.stopPropagation();
    this.selectedBot = bot;
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
  }

  createBot() {
    // Implement the logic to create a bot
    console.log('Create Agent button clicked');
    this.closeModal();
  }

  toggleDetails(event: Event,bot: any, detailsWrapper: HTMLElement) {
    event.stopPropagation();
    bot.showMore = !bot.showMore;

    if (!bot.showMore) {
      setTimeout(() => {
        detailsWrapper.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
      }, 0);
    }
  }
}



// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { LoaderService } from 'src/app/services/loader/loader.service';
// import { PredefinedBotsService } from '../../services/predefined-bots.service';
// import { ToasterService } from 'src/app/shared/service/toaster.service';
// import { toastMessages } from 'src/app/shared/model/toast_messages';

// @Component({
//   selector: 'app-predefined-bots-list',
//   templateUrl: './predefined-bots-list.component.html',
//   styleUrls: ['./predefined-bots-list.component.css']
// })
// export class PredefinedBotsListComponent implements OnInit {
//   predefined_botsList:any[]=[];


//   constructor(private router: Router,
//     private spinner: LoaderService,
//     private rest_api : PredefinedBotsService,
//     private toaster: ToasterService,
//     private toastMessage : toastMessages
//     ) { }

//   ngOnInit(): void {
//     this.getPredefinedBotsList();
//   }

//   getPredefinedBotsList(){
//     this.spinner.show();
//     this.rest_api.getPredefinedBotsList().subscribe((res:any)=>{
//       this.predefined_botsList = res.data
//       this.spinner.hide();
//     },err=>{
//       this.spinner.hide();
//       this.toaster.showError(this.toastMessage.apierror)
//     })

//   }

//   onclickBot(item){
//       this.router.navigate(["/pages/predefinedbot/predefinedforms"],{queryParams:{type:"create",id:item.productId}});
//   }

// }
