import { Injectable } from "@angular/core";
@Injectable()
export class sohints{
    public sodashboard1 = [
        { selector:'#processgroup', description:'Search', showNext:true },
        { selector:'#botsbyprocesschart', description:'Category Search', showNext:false },
       
      ];
      public botmanagment=[
        { selector:'#bmsearch', description:'Search', showNext:true },
        { selector:'#bmcategorySearch', description:'Bot by Source', showNext:true },
        { selector:'#bmcategorySearch1', description:'process group', showNext:false },
       
       
        
        

      ];
      // public botmanagment1=[
      //   { selector:'#bmbotname', description:'Bot Names', showNext:true },
      //   { selector:'#bmcategorySearch', description:'Bot by Source', showNext:true },
      //   { selector:'#bmcategorySearch1', description:'process group', showNext:false },
        

      // ];
      
      

      public soinboxhints = [
        { selector:'#inboxsearch', description:'Search', showNext:true },
        { selector:'#inboxreset', description:'Reset', showNext:true},
        { selector:'#inboxtable', description:'Inbox List'},
      ];

    public sodashboardhints = [
        { selector:'#dashcategorysearch', description:'Select Category', showNext:true},
        { selector:'#dashreset', description:'Reset', showNext:true},
        { selector:'#dashbotstas', description:'Bot Statistics', showNext:true},
        { selector:'#dashprostas', description:'Process Statistics', showNext:true},
        { selector:'#dashrunprostas', description:'Bot Runtime Process Statistics', showNext:true},
        { selector:'#dashautovshuman', description:'Automated Vs Human tasks', showNext:true},
        { selector:'#dashbottrans', description:'Bot Transactions', showNext:true},
        { selector:'#dashenv', description:'Environments'}
    ];

    public soochestartionhints = [
        { selector:'#autocategorysearch', description:'Select Category', showNext:true},
        { selector:'#autoprocesssearch', description:'Select Process', showNext:true},
        { selector:'#autoenvsearch', description:'Select Environment', showNext:true},
        { selector:'#autoreset', description:'Reset', showNext:true},
        { selector:'#autoStartProcess', description:'Start Process', showNext:true},
        { selector:'#autoOpenScheduler', description:'Open Scheduler', showNext:true},
        { selector:'#autoViewLogs', description:'View Logs', showNext:true},
        { selector:'#autotable', description:'Ochestration List'}
    ];
}
