
export class columnList{
    public pi_columns = [
            {ColumnName: "piId",DisplayName: "Process ID",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
            {ColumnName: "convertedTime_new",DisplayName: "Created Date",ShowFilter: true, ShowGrid: true,filterWidget: "normal",filterType: "date",sort: true},
            {ColumnName: "piName",DisplayName: "Process Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
            {ColumnName: "categoryName",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:""},
            {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:["Completed","Inprogress","Failed"]},
            {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false}
        ];

    public projectList_columns = [
        {ColumnName: "type",DisplayName: "Type",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList: ["Project", "Program"]},
        {ColumnName: "projectName",DisplayName: "Project Name",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: true,multiOptions: ["projectName", "priority"],showTooltip:true},
        {ColumnName: "process_name",DisplayName: "Process",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,showTooltip:true},
        {ColumnName: "department",DisplayName: "Department",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList: ""},
        {ColumnName: "createdDate",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false},
        {ColumnName: "lastModifiedBy",DisplayName: "Last Updated By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: true,multiOptions: ["lastModifiedBy", "updatedDate"],userProfile:true,userProfileKey:"lastModifiedByEmail"},
        {ColumnName: "action",DisplayName: "Action",ShowGrid: true,ShowFilter: false,sort: false,multi: false},
      ];

    public recentActivities_columns = [
        {ColumnName: "replacedText",DisplayName: "Activity",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
        {ColumnName: "lastModifiedUsername",DisplayName: "Resource Name",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"lastModifiedByEmail"},
        {ColumnName: "lastModifiedTimestamp_new",DisplayName: "Last Modified", ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true}
      ];

    public taskList_columns = [
        {ColumnName: "taskName",DisplayName: "Task Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "taskCategory",DisplayName: "Type",ShowFilter: true,ShowGrid: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:[]},
        {ColumnName: "priority",DisplayName: "Priority",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false, dropdownList:["High","Medium","Low"]},
        {ColumnName: "assignedTo",DisplayName: "Assigned To",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "endDate_converted",DisplayName: "Due Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        { ColumnName: "action",DisplayName: "Action",ShowGrid: true,ShowFilter: false,sort: false,multi: false}
      ];
    
      public users_columns = [
        {ColumnName: "firstName",DisplayName: "Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: true,multiOptions: ["firstName", "roles"],userProfile:true,userProfileKey:"email"},
        {ColumnName: "email",DisplayName: "Email",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,showTooltip:true},
        {ColumnName: "designation",DisplayName: "Designation",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
        {ColumnName: "department",DisplayName: "Department",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,showTooltip:true},
        // {ColumnName: "roles",DisplayName: "Roles",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
        {ColumnName: "created_at_modified",DisplayName: "Created At",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,dropdownList:["ACTIVE","INACTIVE"]},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false},
      ];

    public environments_column = [
        {ColumnName: "environmentName",DisplayName: "Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,showTooltip:true},
        {ColumnName: "environmentType",DisplayName: "Type",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":['Windows','Linux'],width:"flex: 0 0 8rem"},
        {ColumnName: "agentPath",DisplayName: "Agent Path",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,showTooltip:true},
        {ColumnName: "categoryName",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":''},
        {ColumnName: "hostAddress",DisplayName: "IP Address / Host",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
        {ColumnName: "portNumber",DisplayName: "Port",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,width:"flex: 0 0 5rem"},
        // {ColumnName: "username",DisplayName: "User Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
        // {ColumnName: "password_new",DisplayName: "Password / Key",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
        {ColumnName: "activeStatus_new",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":["Active","Inactive"],width:"flex: 0 0 5rem"},
        {ColumnName: "deploy_status_new",DisplayName: "Deployed",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":["Yes","No"],width:"flex: 0 0 8rem"},
        // {ColumnName: "createdTimeStamp_converted",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
        {ColumnName: "createdBy",DisplayName: "Created By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"createdBy",multi: true,multiOptions: ["createdBy", "createdTimeStamp_converted"]},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,freeze:false},
      ];

    public databaseConnections_column = [
        {ColumnName: "connectiontName",DisplayName: "Connection Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,showTooltip:true},
        {ColumnName: "categoryName",DisplayName: "Category",ShowFilter: true,ShowGrid: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,"dropdownList":''},
        {ColumnName: "dataBaseType",DisplayName: "Database Type",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,"dropdownList":''},
        {ColumnName: "databasename",DisplayName: "Database Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "hostAddress",DisplayName: "IP Address / Host",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "portNumber",DisplayName: "Port",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,width:"flex: 0 0 8rem"},
        // {ColumnName: "username",DisplayName: "Username",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,showTooltip:true},
        {ColumnName: "schemaName",DisplayName: "Schema",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "createdBy",DisplayName: "Created By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"createdBy",multi: true,multiOptions: ["createdBy", "createdTimeStamp_converted"]},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,"dropdownList":["Active","Inactive"]},
        // {ColumnName: "createdTimeStamp_converted",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,freeze:false},
      ];

        // connection manager table
      public connectionsList_column =[
        {ColumnName: "name",DisplayName: "Connector Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "actionCount",DisplayName: "Action Count",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "connectionLogo",DisplayName: "Connector Logo",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];
      // connection manager actions table
      public actionItemsList_column= [
        {ColumnName: "name", DisplayName: "Action Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false,},
        {ColumnName: "actionType", DisplayName: "Action Type", ShowFilter: true, ShowGrid: true, filterWidget: "dropdown", filterType: "text", sort: true, multi: false,dropdownList:["Authenticated","APIRequest"]},
        {ColumnName: "endPoint", DisplayName: "URL/Root Domain", ShowFilter: true, ShowGrid: true, filterWidget: "normal", filterType: "text", sort: true, multi: false,showTooltip:true},
        {ColumnName: "methodType", DisplayName: "Method Type", ShowGrid: true, ShowFilter: true, filterWidget: "dropdown", filterType: "text", sort: true, multi: false,dropdownList:["GET","POST","PUT","DELETE"]},
        {ColumnName: "actionLogo", DisplayName: "Action Logo", ShowGrid: true, ShowFilter: false, filterWidget: "normal", filterType: "text", sort: true, multi: false,},
        {ColumnName: "action", DisplayName: "Actions", ShowGrid: true, ShowFilter: false, sort: false, multi: false,},
      ];
    
      public emailList_column = [
        {ColumnName: "userName",DisplayName: "Email",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "serverName",DisplayName: "Server Type",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        // {ColumnName: "password_new",DisplayName: "Password",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "tableClientId",DisplayName: "Client Id",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "tableClientSecret",DisplayName: "Client Secret",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "tableOfficeTenant",DisplayName: "Tenant Id",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "host",DisplayName: "Host",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "port",DisplayName: "Port",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "categoryName",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,"dropdownList":""},
        {ColumnName: "createdBy",DisplayName: "Created By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,userProfile:true,userProfileKey:"createdBy",multi: true,multiOptions: ["createdBy", "createdTimeStamp_converted"]},
        // {ColumnName: "createdTimeStamp_converted",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,freeze:false},
      ];

      public schedularInbox_column =[
        {ColumnName: "processName",DisplayName: "Process Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "processRunId",DisplayName: "Run Id",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "taskName",DisplayName: "Task Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "previousTask",DisplayName: "Previous Task",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "nextSuccessTask",DisplayName: "Next Task (Upon Success)",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "nextFailureTask",DisplayName: "Next Task (Upon Failure)",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false},
        {ColumnName: "status",DisplayName: "status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:['Approved','Rejected']},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,ShowFilter: false,sort: false,multi: false,},
      ];

      public schedulerBots_column=[
        {ColumnName: "botName",DisplayName: "Bot Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "botSource",DisplayName: "Bot Source",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "category",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,},
        {ColumnName: "lastRunTS",DisplayName: "Previous Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "nextRunTS",DisplayName: "Next Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "scheduleInterval",DisplayName: "Schedule Interval",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:['Running','Failure','Success','Paused','New','Pending','Stop']},
        {ColumnName: "timezone",DisplayName: "Time Zone",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
      ];
      public schedulerProcess_column=[
        {ColumnName: "processName",DisplayName: "Process Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "category",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:[]},
        {ColumnName: "environmentName",DisplayName: "Environment",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "lastRunTS",DisplayName: "Previous Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "nextRunTS",DisplayName: "Next Run",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true,multi: false,},
        {ColumnName: "scheduleInterval",DisplayName: "Schedule Interval",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
        {ColumnName: "status",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,multi: false,dropdownList:['Completed','Running','Failure','Success','Paused','New','Pending','Stop']},
        {ColumnName: "timezone",DisplayName: "Time Zone",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true,multi: false,},
      ];
}