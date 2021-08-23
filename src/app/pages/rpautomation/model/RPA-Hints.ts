export class Rpa_Hints{
    public rpahomehints = [
        { selector:'#createbot-Home', description:'Create Bot',showNext:true },
        //{ selector:'#loadbot-Home', description:'Load Bot',showNext:true },
        { selector:'#Configuration_Home', description:'Configurations',showNext:true },
        { selector:'#botdetails-Home', description:'My Workspace',showNext:false },
    ]

    public rpaenvhints = [
        { selector:'#listofenv', description:'List of Environment(s)',showNext:true  },
        { selector:'#addenvbtn', description:'Create an Environment',showNext:true },        
        { selector:'#updateenvbtn', description:'Update an Environment',showNext:true },
        { selector:'#deleteenvbtn', description:'Delete Environment(s)',showNext:true },
        { selector:'#deployenvbtn', description:'Deploy Agent(s)' }
     
    ]
    
    public rpadbchints = [
        { selector:'#listofdb', description:'List of Database Connections',showNext:true  },
        { selector:'#adddbbtn', description:'Create an Database Connection',showNext:true },        
        { selector:'#updatedbbtn', description:'Modify an Database Connection',showNext:true },
        { selector:'#deletedbbtn', description:'Delete Database Connection' }
     
    ]
    
    public rpaWorkspaceHints = [
        //{ selector:'#botStatus', description:'Bot Statistics',showNext:true },
       
        { selector:'#bots', description:'Shows the list Of Bots',showNext:true },
        { selector:'#schedule', description:'Configure Schedule for Bot',showNext:true },
        { selector:'#Environments', description:'Select Environments',showNext:true },
        { selector:'#savebot', description:'Save the configured Bot',showNext:true },
        { selector:'#versions', description:'Shows the Versions Of Bot',showNext:true },
        /*{ selector:'#edit', description:'Edit Bot',showNext:true },*/
        //{ selector:'#deployBot', description:'Agent Deployment for selected Environment(s)',showNext:true  },
        { selector:'#startbot', description:'Start Bot',showNext:true },
        { selector:'#stopbot', description:'Stop Bot',showNext:true },
        /*{ selector:'#reset', description:'Reset',showNext:true },*/
        { selector:'#edit', description:'Edit Bot',showNext:true },
        { selector:'#reset', description:'Reset Bot',showNext:true },
        { selector:'#delete', description:'Delete Bot',showNext:true },
        { selector:'#Logs', description:'Bot Logs',showNext:true},
        { selector:'#dragicons', description:'Activity Panel',showNext:true },
        { selector:'#search', description:'Search an Activity',showNext:true },
        { selector:'#screen', description:'Configure Bot by Drag and Drop Activities',showNext:true },
        { selector:'#zoominzoomout', description:'Zoom-In & Zoom-Out the Activity Area'  },
      ]

      public rpaworkspacehints1 = [
        { selector:'#automatedtasks', description:'Automated Task(s)',showNext:true },
        { selector:'#humantasks', description:'Human Task(s)',showNext:true },
        { selector:'#orchestrations', description:'Orcherstations(Human + Automated) Task(s)'},
        
    ]

}