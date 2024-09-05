
export class columnList{
    public pi_columns = [
            {ColumnName: "piId",DisplayName: "Process ID",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
            {ColumnName: "piName",DisplayName: "Process Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,showTooltip:true},
            {ColumnName: "categoryName",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:[]},
            {ColumnName: "convertedTime_new",DisplayName: "Created Date",ShowFilter: true, ShowGrid: true,filterWidget: "normal",filterType: "date",sort: true},
            {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:["Completed","Inprogress","Failed"],status_icon:true},
            {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false}
        ];

    public projectList_columns = [
        // {ColumnName: "type",DisplayName: "Type",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList: ["Project", "Program"]},
        {ColumnName: "projectName",DisplayName: "Project",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: true,multiOptions: ["projectName", "priority"],showTooltip:true},
        {ColumnName: "processName",DisplayName: "Process",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,showTooltip:true},
        {ColumnName: "department",DisplayName: "Department",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList: ""},
        {ColumnName: "createdDate",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false},
        {ColumnName: "lastModifiedBy",DisplayName: "Last Updated By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: true,multiOptions: ["lastModifiedBy", "updatedDate"],userProfile:true,userProfileKey:"lastModifiedByEmail",datePipe:true},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:["New","In Progress","On Hold","Closed"],status_icon:true},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false},
      ];

    public recentActivities_columns = [
        {ColumnName: "replacedText",DisplayName: "Activity",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: false},
        {ColumnName: "lastModifiedUsername",DisplayName: "Resource",ShowFilter: false,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: false,userProfile:true,userProfileKey:"lastModifiedByEmail"},
        {ColumnName: "lastModifiedTimestamp_new",DisplayName: "Timestamp", ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "date",sort: false}
      ];

    public taskList_columns = [
        {ColumnName: "taskName",DisplayName: "Task",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: true,showTooltip:true,multiOptions: ["taskName", "priority"]},
        {ColumnName: "taskCategory",DisplayName: "Type",ShowFilter: true,ShowGrid: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:[]},
        // {ColumnName: "priority",DisplayName: "Priority",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false, dropdownList:["High","Medium","Low"]},
        {ColumnName: "assignedTo",DisplayName: "Assigned To",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,userProfile:true,userProfileKey:"assignedTo"},
        {ColumnName:"percentageComplete",DisplayName: "Completed(%)",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 12rem"},
        {ColumnName: "endDate_converted",DisplayName: "Due Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:["New","In Progress","In Review","Closed"],status_icon:true},
        { ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false}
      ];
    
      public users_columns = [
        {ColumnName: "firstName",DisplayName: "Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: true,multiOptions: ["firstName", "roles"],userProfile:true,userProfileKey:"email",width:"flex: 0 0 16rem"},
        {ColumnName: "email",DisplayName: "Email",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,showTooltip:true},
        {ColumnName: "designation",DisplayName: "Designation",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
        {ColumnName: "department",DisplayName: "Department",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,showTooltip:true},
        // {ColumnName: "roles",DisplayName: "Roles",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
        {ColumnName: "created_at",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,dropdownList:["Active","Inactive"],status_icon:true},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false},
      ];

    public environments_column = [
        {ColumnName: "environmentName",DisplayName: "Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,showTooltip:true},
        {ColumnName: "environmentType",DisplayName: "Type",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":['Windows','Linux'],width:"flex: 0 0 8rem"},
        {ColumnName: "agentPath",DisplayName: "Agent Path",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,showTooltip:true,width:"flex: 0 0 10rem"},
        {ColumnName: "categoryName",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":''},
        {ColumnName: "hostAddress",DisplayName: "IP Address / Host",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,width:"flex: 0 0 12rem"},
        {ColumnName: "portNumber",DisplayName: "Port",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,width:"flex: 0 0 7rem"},
        // {ColumnName: "username",DisplayName: "User Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
        // {ColumnName: "password_new",DisplayName: "Password / Key",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
        {ColumnName: "activeStatus_new",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":["Active","Inactive"],width:"flex: 0 0 8rem",status_icon:true},
        {ColumnName: "deploy_status_new",DisplayName: "Deployed",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":["Yes","No"],width:"flex: 0 0 9rem"},
        // {ColumnName: "createdTimeStamp_converted",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
        {ColumnName: "createdBy",DisplayName: "Created By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"createdBy",multi: true,multiOptions: ["createdBy", "createdTimeStamp_converted"],datePipe:true,width:"flex: 0 0 10rem"},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,freeze:false,width:"flex: 0 0 5rem"},
      ];

    public databaseConnections_column = [
        {ColumnName: "connectiontName",DisplayName: "Connection Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,showTooltip:true,width:"flex: 0 0 13rem"},
        {ColumnName: "categoryName",DisplayName: "Category",ShowFilter: true,ShowGrid: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,"dropdownList":'',width:"flex: 0 0 10rem"},
        {ColumnName: "databasename",DisplayName: "Database Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 12rem"},
        {ColumnName: "dataBaseType",DisplayName: "Database Type",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,"dropdownList":["My Sql","MongoDB","PostgreSQL","Snowflake","Oracle","H2","SQL Server","Cassandra"],width:"flex: 0 0 11rem"},
        {ColumnName: "hostAddress",DisplayName: "IP Address / Host",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 12rem"},
        {ColumnName: "portNumber",DisplayName: "Port",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 7rem"},
        // {ColumnName: "username",DisplayName: "Username",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,showTooltip:true},
        {ColumnName: "schemaName",DisplayName: "Schema",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 8rem"},
        {ColumnName: "createdBy",DisplayName: "Created By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"createdBy",multi: true,multiOptions: ["createdBy", "createdTimeStamp_converted"],datePipe:true,width:"flex: 0 0 10rem"},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,"dropdownList":["Active","Inactive"],width:"flex: 0 0 8rem",status_icon:true},
        // {ColumnName: "createdTimeStamp_converted",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,freeze:false,width:"flex: 0 0 6rem"},
      ];

        // connection manager table
      public connectionsList_column =[
        {ColumnName: "name",DisplayName: "Connector Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 20rem"},
        {ColumnName: "actionCount",DisplayName: "Action Count",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "connectionLogo",DisplayName: "Connector Logo",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "createdBy",DisplayName: "Created By ",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"createdBy",multi: true,multiOptions: ["createdBy","createdAt"],datePipe:true,width:"flex: 0 0 20rem"},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];
      // connection manager actions table
      public actionItemsList_column= [
        {ColumnName: "name", DisplayName: "Action Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false,showTooltip:true},
        {ColumnName: "actionType", DisplayName: "Action Type", ShowFilter: true, ShowGrid: true, filterWidget: "dropdown", filterType: "text", sort: true, multi: false,dropdownList:["Authenticated","APIRequest"],width:"flex: 0 0 15rem"},
        // {ColumnName: "authenticationType", DisplayName: "Authentication Type", ShowGrid: true, ShowFilter: true, filterWidget: "dropdown", filterType: "text", sort: true, multi: false,dropdownList:["API Key","OAuth 2.0","Basic","OAuth","None"]},
        {ColumnName: "authenticationType", DisplayName: "Authentication Type", ShowGrid: true, ShowFilter: true, filterWidget: "dropdown", filterType: "text", sort: true, multi: false,dropdownList:["API Key","OAuth 2.0"]},
        {ColumnName: "endPoint", DisplayName: "URL/Root Domain", ShowFilter: true, ShowGrid: true, filterWidget: "normal", filterType: "text", sort: true, multi: false,showTooltip:true},
        {ColumnName: "methodType", DisplayName: "Method Type", ShowGrid: true, ShowFilter: true, filterWidget: "dropdown", filterType: "text", sort: true, multi: false,dropdownList:["GET","POST","PUT","DELETE"],width:"flex: 0 0 10rem"},
        {ColumnName: "actionLogo", DisplayName: "Action Logo", ShowGrid: true, ShowFilter: false, filterWidget: "normal", filterType: "text", sort: false, multi: false,width:"flex: 0 0 6rem"},
        {ColumnName: "action", DisplayName: "Actions", ShowGrid: true, ShowFilter: false, sort: false, multi: false,width:"flex: 0 0 10rem"},
      ];
    
      public emailList_column = [
        {ColumnName: "userName",DisplayName: "Email / Organization Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,showTooltip:true,width:"flex: 0 0 16rem"},
        {ColumnName: "serverName",DisplayName: "Server Type",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:["Office365","G-mail","Others"]},
        // {ColumnName: "password_new",DisplayName: "Password",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "tableClientId",DisplayName: "Client Id",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "tableClientSecret",DisplayName: "Client Secret",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "tableOfficeTenant",DisplayName: "Tenant Id",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "host",DisplayName: "Host",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "port",DisplayName: "Port",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "categoryName",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,"dropdownList":""},
        {ColumnName: "createdBy",DisplayName: "Created By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"createdBy",multi: true,multiOptions: ["createdBy", "createdTimeStamp_converted"],datePipe:true},
        // {ColumnName: "createdTimeStamp_converted",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,freeze:false},
      ];

      public schedularInbox_column =[
        {ColumnName: "processName",DisplayName: "Process Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "processRunId",DisplayName: "Run Id",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "taskName",DisplayName: "Task Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "previousTask",DisplayName: "Previous Task",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "nextSuccessTask",DisplayName: "Next Task (Upon Success)",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "nextFailureTask",DisplayName: "Next Task (Upon Failure)",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 15rem"},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:['Approved','Pending','Running','Rejected'],status_icon:true},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];

      public schedulerBots_column=[
        {ColumnName: "botName",DisplayName: "Bot Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "botSource",DisplayName: "Bot Source",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "category",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,},
        {ColumnName: "lastRunTS",DisplayName: "Previous Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "nextRunTS",DisplayName: "Next Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "scheduleInterval",DisplayName: "Schedule Interval",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 12rem"},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:['Running','Failure','Success','Paused','New','Pending','Stop'],status_icon:true},
        {ColumnName: "timezone",DisplayName: "Time Zone",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
      ];
      public schedulerProcess_column=[
        {ColumnName: "processName",DisplayName: "Process Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "category",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:[]},
        {ColumnName: "environmentName",DisplayName: "Environment",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "lastRunTS",DisplayName: "Previous Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "nextRunTS",DisplayName: "Next Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "scheduleInterval",DisplayName: "Schedule Interval",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 12rem"},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:['Completed','Running','Failure','Success','Paused','New','Pending','Stop'],status_icon:true},
        {ColumnName: "timezone",DisplayName: "Time Zone",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
      ];

      public department_column = [
        {ColumnName: "categoryName",DisplayName: "Department",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "created_user",DisplayName: "Owner",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"created_user"},
        {ColumnName: "createdBy",DisplayName: "Created By",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true},
        {ColumnName: "createdAt",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
        {ColumnName: "action",DisplayName: "Action",ShowGrid: true,ShowFilter: false,sort: false},
      ];

      public adminScreenlist_column=[
        {ColumnName: "Screen_Name",DisplayName: "Screen Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text", sort: true,multi: false},
        {ColumnName: "Table_Name",DisplayName: "Table Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: false,multi: false},
      ]

      public adminAddScreen_column=[
        {ColumnName: "ColumnName",DisplayName: "Column Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "DisplayName",DisplayName: "Display Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "data_type",DisplayName: "Data Type",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: false,multi: false}
      ]

      public adminChangeTable_column=[
        {ColumnName: "column_name",DisplayName: "Column Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "data_type",DisplayName: "Data Type",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
      ]

      public saveTable_column = [
        {ColumnName: "ColumnName",DisplayName: "Column Name",ShowGrid: true,sort: true,ShowFilter:true},
        {ColumnName: "DisplayName",DisplayName: "Display Name",ShowGrid: true,sort: true,ShowFilter:true},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,sort: false,ShowFilter:false},
      ];

      public auditLogs_column = [
        {ColumnName:"versionNew",DisplayName:"Version",ShowGrid: true,ShowFilter: true,filterWidget: "normal",width:"flex: 0 0 10rem",filterType:"text",sort: true},
        // {ColumnName:"changedDate_new",DisplayName:"Timestamp",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType:"date",sort: true},
        {ColumnName:"changeActivity",DisplayName:"Activity",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType:"text"},
        {ColumnName:"changedBy",DisplayName:"Changed By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType:"text",sort: true,userProfile:true,userProfileKey:"changedBy",multi: true,multiOptions: ["changedBy", "changedDate_new"],datePipe:true,width:"flex: 0 0 12rem"},
        {ColumnName:"comments",DisplayName:"Comments",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType:"text",sort: true},
      ];

      public invoice_column=[
        {ColumnName: "invoiceNumber",DisplayName: "Invoice Number",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true,width:"flex: 0 0 15rem"},
        // {ColumnName: "subscriptionId",DisplayName: "Subscription Id",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true,width:"flex: 0 0 23rem"},
        {ColumnName: "productName",DisplayName: "Agent",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true,width:"flex: 0 0 23rem"},
        {ColumnName: "amount_modified",DisplayName: "Price",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true,width:"flex: 0 0 10rem"},
        {ColumnName: "createDate",DisplayName: "Issue Date",filterWidget: "normal",filterType: "date",ShowGrid: true,sort: true,ShowFilter:true,width:"flex: 0 0 16rem"},
        {ColumnName: "status_converted",DisplayName: "Status",filterWidget: "dropdown",filterType: "text",ShowGrid: true,sort: false,ShowFilter:false,dropdownList:['Paid','Voided'],status_icon:true,width:"flex: 0 0 12rem"},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,sort: false,ShowFilter:false},
      ];

      public approval_column=[
        {ColumnName:"botId",DisplayName:"Bot Id",filterWidget: "normal",ShowFilter: true,filterType:"text",ShowGrid: true,sort: true, width:"flex: 0 0 7rem"} ,
        {ColumnName:"runId",DisplayName:"Run Id",filterWidget: "normal",ShowFilter: true,filterType:"text",ShowGrid: true,sort: true, width:"flex: 0 0 8rem"},
        {ColumnName:"approverConvertedName",DisplayName:"Approver Name",filterWidget: "normal",ShowFilter: true,width:"flex: 0 0 12rem",filterType:"text",ShowGrid: true,sort: true,},
        {ColumnName:"comments",DisplayName:"Comments",filterWidget: "normal",ShowFilter: true,width:"flex: 0 0 10rem",filterType:"text",ShowGrid: true,sort: true,},
       {ColumnName:"createdAt",DisplayName:"Created Date",filterWidget: "normal",ShowFilter: true,width:"flex: 0 0 10rem",filterType:"date",ShowGrid: true,sort: true,},
       {ColumnName:"createdBy",DisplayName:"Created By",filterWidget: "normal",ShowFilter: true,width:"flex: 0 0 10rem",filterType:"text",ShowGrid: true,sort: true,},
        {ColumnName:"modfiedAt",DisplayName:"Modified Date",filterWidget: "normal",ShowFilter: true,width:"flex: 0 0 11rem",filterType:"date",ShowGrid: true,sort: true,},
        {ColumnName:"modifiedBy",DisplayName:"Modified By",filterWidget: "normal",ShowFilter: true,width:"flex: 0 0 10rem",filterType:"text",ShowGrid: true,sort: true,},
        {ColumnName:"approvalInfo",DisplayName:"Approval Info", ShowFilter:true, filterType:"text",ShowGrid: true,sort: true,  width:"flex: 0 0 9rem"},
        {ColumnName:"status",DisplayName:"Status",filterWidget: "dropdown",ShowFilter: true,width:"flex: 0 0 8rem",filterType:"text",ShowGrid: true,sort: true,dropdownList:['Approved','Rejected','Pending','Completed'],status_icon:true},
        {ColumnName:"action",DisplayName:"Actions", ShowGrid: true,sort: false,ShowFilter:false,width:"flex: 0 0 7rem"}
      ];



      public orchestration_process_runs_columns=[
        {ColumnName:"processRunId",DisplayName:"Run Id",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
        {ColumnName:"environmentName",DisplayName:"Environment Name",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"processStartTime",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"runStatus",DisplayName:"Status",ShowFilter: false,width:"",filterType:"text"},
      ];

      public orchestration_process_logs_columns=[
        {ColumnName:"bot_name",DisplayName:"Source Name",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
        {ColumnName:"taskType",DisplayName:"Task Type",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"modifiedVersionNew",DisplayName:"Version",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
        {ColumnName:"start_time",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"end_time",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"bot_status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"log_statement",DisplayName:"Info",ShowFilter: false,width:"",filterType:"text"},
        
      
      ];


      public orchestration_bot_logs_columns=[
        {ColumnName:"task_name",DisplayName:"Task Name",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
        //{ColumnName:"versionNew",DisplayName:"Version",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"start_time",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"end_time",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"error_info",DisplayName:"Error Info",ShowFilter: false,width:"",filterType:"text"}
      ]


      public orchestration_child_logs_columns=[
        {ColumnName:"task_name",DisplayName:"Task Name",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
        {ColumnName:"iteration_id",DisplayName:"Iteration Id",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"start_time",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"end_time",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"error_info",DisplayName:"Error Info",ShowFilter: false,width:"",filterType:"text"}
      ];

     //EzAsk Admin screens coloumns
     
      public manage_cutomer_support_bot_coloumns = [
        {ColumnName: "customerSupportBotName",DisplayName: "Bot Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "customerSupportBotSource",DisplayName: "Bot Data Source Type",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,},
        // {ColumnName: "isActive",DisplayName: "Active",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];
      
      public train_cutomer_support_bot_coloumns = [
        {ColumnName: "trainBotName",DisplayName: "Trained Model Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "trainData",DisplayName: "File Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];
      
      public view_cutomer_support_bot_coloumns = [
        {ColumnName: "fileName",DisplayName: "File Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "fileDetails",DisplayName: "File Details",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];

      public custom_tasks = [
        { ColumnName: "customTaskName", DisplayName: "Custom Task Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", width: "flex: 0 0 13rem", filterType: "text", sort: true, status_icon: false, showTooltip: true },
        { ColumnName: "createdUser", DisplayName: "Created By", filterWidget: "normal", ShowFilter: true, filterType: "text", ShowGrid: true, sort: true, multi: true, multiOptions: ["createdUser", "createdAt"], userProfile: true, datePipe: true, userProfileKey: "createdBy" },
        { ColumnName: "languageType", DisplayName: "Language Type", ShowGrid: true, ShowFilter: true, filterWidget: "dropdown", filterType: "text", dropdownList: ['Java'], sort: true, },
        {ColumnName: "approverName", DisplayName: "Approver", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, status_icon: false },
        {ColumnName: "comments", DisplayName: "Comments", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, status_icon: false, showTooltip: true },
        //temporarly commenting the input and output reference columns as it is not in use for now.
        { ColumnName: "status", DisplayName: "Status", ShowGrid: true, ShowFilter: true, filterWidget: "dropdown", filterType: "text", sort: true, status_icon: true, dropdownList: ['Approved', 'Rejected', 'Pending', 'Draft'], multi: true, multiOptions: ["status", "updatedAt"], datePipe: true },
        // {ColumnName: "version",DisplayName: "Version",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];

      public subscrption_overview = [
        {ColumnName: "planname",DisplayName: "Product ",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        // {ColumnName: "plan",DisplayName: "Plan",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "amount",DisplayName: "Price",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "term",DisplayName: "Billing Cycle",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "nextBilling",DisplayName: "Next Billing Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "customerMailId",DisplayName: "Receipt Email",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,status_icon:false},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",dropdownList:['Active','Cancelled'],sort: true,status_icon:true},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];

      public predefined_orchestration_process_runs_columns=[
        {ColumnName:"predefinedRunId",DisplayName:"Run Id",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
        // {ColumnName:"environmentName",DisplayName:"Environment Name",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"startTS",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"endTS",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"info",DisplayName:"Info",ShowFilter: false,width:"",filterType:"text"}
      ];

  public sdk_approval_list = [
    { ColumnName: "customTaskName", DisplayName: "Custom Task Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", width: "flex: 0 0 13rem", filterType: "text", sort: true, status_icon: false, showTooltip: true },
    // { ColumnName: "createdAt", DisplayName: "Created Date", filterWidget: "normal", width: "flex: 0 0 11rem", ShowFilter: true, filterType: "date", ShowGrid: true, sort: true, },
    { ColumnName: "createdUser", DisplayName: "Created By", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, status_icon: false, multi: true, multiOptions: ["createdUser", "createdAt"], userProfile: true, datePipe: true, userProfileKey: "createdBy" },
    { ColumnName: "languageType", DisplayName: "Language Type", ShowGrid: true, ShowFilter: true, filterWidget: "dropdown", filterType: "text", width: "flex: 0 0 11rem", dropdownList: ['Java'], sort: true, },

    // { ColumnName: "approverName", DisplayName: "Approver", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, status_icon: false },
    { ColumnName: "comments", DisplayName: "Comments", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, status_icon: false, showTooltip: true },
    { ColumnName: "status", DisplayName: "Status", ShowGrid: true, ShowFilter: true, filterWidget: "dropdown", filterType: "text", sort: true, status_icon: true, dropdownList: ['Approved', 'Rejected', 'Pending'], multi: true, multiOptions: ["status", "updatedAt"], datePipe: true },
    { ColumnName: "action", DisplayName: "Actions", ShowGrid: true, ShowFilter: false, sort: false, multi: false, },
  ];
}