

import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BpmnModel } from '../business-process/model/bpmn-autosave-model';
import { IpServiceService } from '../../services/ip-service.service';

// const httpOptions = {
//   headers: new HttpHeaders({
//     // 'Content-Type': 'application/json',
//     'Authorization': 'Bearer '+localStorage.getItem("accessToken")
//   }),
// };
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
        })
};


const  httpfileOptions={

  headers: new HttpHeaders({
  "Content-Type":"multipart/form-data"
  })

}


@Injectable({
  providedIn: 'root'
})
export class RestApiService{
  authHttpOptions;

  xmlheaderOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/xml',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '/*',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method',
    }),
    responseType: 'text'
  }
  public fileName = new BehaviorSubject<any>('file');
  constructor(private http:HttpClient, private ip:IpServiceService) { 
    //this.getIP();
   }

  public ipAddress:string;
    //nethan.price@guerrillamailblock.com , karthik.peddinti@epsoftinc.com
  //password -Welcome@123

  // sampadha.bharadwaj@epsoftinc.com , Welcome@1234 "Analyst"
  // edukondalu.chokkapu@epsoftinc.com , Welcome@123 "Architect"
  //harish.reddi@epsoftinc.com , password: Epsoft@123

  getAccessToken(){
    let data = {"userId":"harish.reddi@epsoftinc.com",
                "password":"Epsoft@123"};



    return this.http.post('/api/login/beta/accessToken',data);
  }
  getNewAccessToken(){
    return this.http.get<any[]>('/api/login/beta/newAccessToken',{responseType: 'json'});
  }
  getIP()
     {
        if(localStorage.getItem('ipAddress')==null){
        this.ip.getIPAddress().then(res => {
 var obj = JSON.parse(JSON.stringify(res));
        this.ipAddress = obj.ip;
        localStorage.setItem('ipAddress', this.ipAddress);
        });
       }
     }
  
  getInbox(){
    return this.http.get('/rpa-service/inbox');
  }
  updateInboxstatus(data){
    return this.http.post('/rpa-service/human-task-action',data);
  }
  bpmnlist(){
    return this.http.get<any[]>('/bpsprocess/approvalTnfoByUser');
  }
  approve_producemessage(bpmnProcessInfo){
    return this.http.post<any[]>('/bpsprocess/produceMessage',bpmnProcessInfo);
  }
  approve_savedb(bpmndata){
    return this.http.post<any[]>('/bpsprocess/save/bpms/notation/approval/workflow',bpmndata);
  }
  denyDiagram(msg_obj){
    // POST /bpsprocess/save/bpms/notation/approval/workflow
    return this.http.post<any[]>('/bpsprocess/save/bpms/notation/approval/workflow',msg_obj);
  }

  deleteBPMNProcess(data){
    return this.http.post('/bpsprocess/remove/bpmn/notation/user', data, {responseType: "text" });
  }

  sendReminderMailToApprover(data){
    return this.http.post('/bpsprocess/reminder/email', data, {responseType: "text" });
  }

  getBPMNFileContent(filePath){
    return this.http.get(filePath, {headers: {observe: 'response'}, responseType: 'text'});
  }

  getApproverforuser(role){
    return this.http.get("/bpsprocess/approver/info/"+role)
  }
  getmultipleApproverforusers(roles){
    return this.http.post("/bpsprocess/approver/info1/",roles)
  }
  getUserBpmnsList(){
    // return this.http.get("/bpsprocess/fetchByUser");
    return this.http.get("/bpsprocess/fetchByTenant");
  }
  saveBPMNprocessinfofromtemp(bpmnModel){
    return this.http.post("/bpsprocess/save/bpms/notation/from/temp",bpmnModel)
  }
  submitBPMNforApproval(bpmnModel){
    return this.http.post("/bpsprocess/submit/bpms/notation/approve", bpmnModel)
  }
  getBPMNTempNotations(){
    // return this.http.get("/bpsprocess/temp/bpmn/all/user");
    return this.http.get("/bpsprocess/temp/bpmn/latestModified");
  }
  autoSaveBPMNFileContent(bpmnModel){
    return this.http.post("/bpsprocess/temp/bpms/notation", bpmnModel)
  }

  sendUploadedFile(file:FormData, uid){
    let api_method_call = "";
    switch(uid){
      case 1: api_method_call = 'uploadExcel'; break;
      case 2: api_method_call = 'uploadCSV'; break;
      case 3: api_method_call = 'uploadXes'; break;
    }
    return api_method_call != ""?this.http.post('/'+api_method_call, file, {responseType: 'text'}):null;// "target" : "http://10.11.1.189:8080",
  }


  toolSet(){
    return this.http.get("/rpa-service/load-toolset");
  }
  attribute(data:any){
  return this.http.get('/rpa-service/get-attributes/'+data)
  }

  getAllAttributes(){
    return this.http.get('/rpa-service/fetch-attributes/all-tasks')
  }

  getRestAttributes(attribute, taskId, attrId){
    let all_attr_data = JSON.parse(localStorage.getItem("attributes"))
    if(attribute)
    this.http.get(attribute.dependency).subscribe(
      (res:any) => {
        if(res){
        if(!res.errorMessage ){
        let tmpOpt = [];
        if(res.length> 0){
        let keys = Object.keys(res[0])
        res.forEach(eachOpt => {
          let tmp_op = {key: eachOpt[keys[0]], label: eachOpt[keys[1]]};
          tmpOpt.push(tmp_op);
        })
        attribute.options = tmpOpt;
      }
      }
        all_attr_data[taskId][attrId] = attribute;
        localStorage.setItem("attributes", JSON.stringify(all_attr_data))
    }
      }
    )
  }


  getMultiFormAttributes(dependencyApi)
  {
    return this.http.get(dependencyApi);
  }

  async saveBot(data:any)
  {
    return await this.http.post('/rpa-service/save-bot',data)
  }

  async updateBot(data:any)
  {
    return await this.http.post('/rpa-service/update-bot',data)
  }

  async uploadfile(data:any,envids:any[])
  {
    let  url="/rpa-service/agent/file-upload-environments";
    let i=0;
    envids.forEach(env=>{
      let ct="";
      if(i==0)
      {
        ct="?env="+env;
        i++;
      }
      else
      {
        ct="&env="+env;
        i++;
      }
      url=url+ct;
    })
    return await this.http.post(url,data,httpfileOptions);
  }

  listDBConnection(){
    return this.http.get("/rpa-service/agent/get-connections")
  }
  addDBConnection(data:any){
    return this.http.post('/rpa-service/agent/save-connection',data)
  }
  updateDBConnection(data:any){
    return this.http.put('/rpa-service/agent/update-connection',data)
  }
  deleteDBConnection(data:any){
    return this.http.post('/rpa-service/agent/delete-connection',data)
  }

  getUserPause(botId){
    let data:any;
    return this.http.post('/rpa-service/pause-bot/'+botId,data)
  }
  getUserResume(botId){
    let data:any;
    return this.http.post('/rpa-service/resume-bot/'+botId,data)
  }
  botStatistics(){
    return this.http.get("/rpa-service/bot-statistics")
  }

  botStatisticsbycat(cat)
  {
    return  this.http.get("/rpa-service/bot-statistics/"+cat);
  }
  listEnvironments(){
    return this.http.get("/rpa-service/agent/get-environments")
  }
  execution(botid:number){
    let data="";
    let url='/rpa-service/start-bot/'+botid;
    return this.http.post(url,data)
  }

  stopbot(botid:number,data:any){
    let url='/rpa-service/stop-bot/'+botid;
    return this.http.post(url,data)
  }

  deployremotemachine(botId){
    let data=null;
    return this.http.post('/rpa-service/agent/deploy-bot?botId='+botId,data);
  }

  getpredefinedbots(){
    return this.http.get("/rpa-service/getall-predefinedbots")/*jitendra: need to replace URL*/
  }

  //rest-api

    getviewlogdata(botid,botverid)
    {
      return this.http.get("/rpa-service/logs/"+botid);
    }

    getViewlogbyrunid(botid,botverid,runid){
      return this.http.get("/rpa-service/logs/"+botid+"/"+botverid+"/"+runid);
    }



  updateBotLog(botid,version, runid)
  {
    return this.http.get(`/rpa-service/updateLog/${botid}/${version}/${runid}`)
  }


  kill_process_log(processid, runid)
  {
    return this.http.post(`/rpa-service/updateProcessLog/${processid}/${runid}`,"")
  }

  getbotlist(botType, botDepartment)
  {
    return this.http.get("/rpa-service/get-all-bots/"+botDepartment+"/"+botType);
  }


  getbotdata(botid)
  {
    return this.http.get("/rpa-service/get-bot/"+botid);
  }


  getBotImage(botId, version)
  {
    return this.http.get(`/rpa-service/get-botImage?bot-id=${botId}&version=${version}`)
  }

  addAuditLogs(dataInput:any[])
  {
    return this.http.post("/rpa-service/auditlogs",dataInput);
  }

  getAuditLogs(botId:number)
  {
    return this.http.get(`/rpa-service/auditlog-fetching/${botId}`)
  }

  scheduleList(botid){
    let data=""
    return this.http.post('/rpa-service/getschedulesintervals-bot/'+botid,data)
  }

  testenvironment(data:any):Observable<any>
  {
    return this.http.post<any>("/rpa-service/agent/test-connection",data);
  }

   // http://rpadev.epsoftinc.in/rpa-service/agent/dbtest-connection

  testdbconnections(data:any):Observable<any>
  {
    return this.http.post<any>("/rpa-service/agent/dbtest-connection",data);
  }

  addenvironment(data:any):Observable<any>
  {
    return this.http.post<any>("/rpa-service/agent/save-environment",data);
  }

  
  addenvironmentV2(data:any):Observable<any>
  {
    return this.http.post<any>("/rpa-service/agent/save-environment-v2",data);
  }
  

  deleteenvironment(data:any) :Observable<any>
  {
    return this.http.post<any>("/rpa-service/agent/delete-environment",data);
  }
  updateenvironment(data:any):Observable<any>
  {
    const requestOptions: Object = {
      responseType: 'text'
    }
    return this.http.put<any>("/rpa-service/agent/update-environment",data);
  }

  updateEnvironmentV2(formData)
  {
    return this.http.post<any>("/rpa-service/agent/update-environment-v2",formData);
  }
  getAllRpaWorkSpaces(id:any){
    if(id==0)
    {
      return this.http.get('/rpa-service/load-process-info/'+0);
    }
    else{
      return this.http.get('/rpa-service/load-process-info/processid='+id);
    }
  }




  saveTasksOrder(orderData)
  {
    return this.http.post("/rpa-service/save-tasks-order",orderData);
  }
  getAllOrcRpaWorkSpaces()
  {
      return this.http.get('/rpa-service/process-name');

  }
  saveConnectorConfig(body,categoryName,processName,piId){
    return this.http.post('/processintelligence/v1/connectorconfiguration/?categoryName='+categoryName+'&piId='+processName+'&piName='+piId,body)
  }
  getBotVersion(botid)
  {
   return this.http.get("/rpa-service/bot-version?botId="+botid);
  }

  getbotversiondata(botId,vid)
  {
    return this.http.get("/rpa-service/get-bot/"+botId+"/"+vid)
  }


  getautomatedtasks(process)
  {
    let id=process;
    return this.http.get("/rpa-service/load-process-info/"+id);
  }

  startprocess(processid,envid)
  {
    return this.http.post("/rpa-service/start-process/"+processid+"/"+envid,"");
  }

  fetchBpmnNotationFromPI(pid){
    return this.http.get("/bpsprocess/pi/generated/bpmn/"+pid+"/user")
  }

  // PI module rest api's

  fileupload(file){
    return this.http.post('/processintelligence/v1/connectorconfiguration/upload',file)
  }
  getCategoriesList():Observable<any>{
    return this.http.get('/processintelligence/v1/processgraph/categories')
  }
  addCategory(data){
    return this.http.post('/processintelligence/v1/processgraph/categories',data)
  }
  getAlluserProcessPiIds(){
    // return this.http.get('/processintelligence/v1/processgraph/userProcess')
    return this.http.get('/processintelligence/v1/processgraph/ProcessByTenant')
  }
  getAllVaraintList(listBody){
    //return this.http.get("/processintelligence/v1/processgraph/variantList?pid="+piId)
    return this.http.post("/ReddisCopy/getGraphData",listBody, {responseType: 'json'})
  }
  getfullGraph(fullGraphbody){
    //return this.http.get("/processintelligence/v1/processgraph/fullGraph?pid="+piId)
    return this.http.post("/ReddisCopy/getGraphData",fullGraphbody, {responseType: 'json'})
  }
  getvaraintGraph(variantgraphbody){
    return this.http.post("/ReddisCopy/getGraphData",variantgraphbody)
    // return this.http.get('/processintelligence/v1/processgraph/variantGraph?pid='+piId)
  }
  getSliderVariantGraph(sliderGraphbody){
    return this.http.post("/ReddisCopy/getGraphData",sliderGraphbody)
  }

  getVariantGraphCombo(body){
    return this.http.post("/ReddisCopy/getGraphData",body)
  }

  getVariantActivityFilter(activityFilterbody){
    return this.http.post("/ReddisCopy/getGraphData",activityFilterbody)
  }

  getDBTableList(body){
    return this.http.post('/processintelligence/v1/processgraph/pi/tenant/db/list/tables', body)
  }

// PI To BPMN API's START

  getFullGraphBPMN(body){
    return this.http.get('/processintelligence/v1/bpmn/FullGraph?pi_id='+body.pid+'&pi_name='+body.pname)
  }

  getSingleTraceBPMN(body){
    return this.http.get('/processintelligence/v1/bpmn/SingleTraceMulti?pi_id='+body.pid+'&pi_name='+body.pname+'&traceNumber='+body.traceNumber)
  }

  getMultiTraceBPMN(body){
    var tracNo = '';
    for(var i=0;i<body.traceNumberList.length;i++){
      tracNo+='&traceNumberList='+body.traceNumberList[i]
    }

    return this.http.get('/processintelligence/v1/bpmn/MulitpleTraces?pi_id='+body.pid+'&pi_name='+body.pname+tracNo)
  }

  getSliderTraceBPMN(body){
    return this.http.get('/processintelligence/v1/bpmn/SliderTraces?activitySlider='+body.activitySlider+'&pathSlider='+body.pathSlider+'&pi_id='+body.pid+'&pi_name='+body.pname)
  }

  // PI To BPMN API's END

  //PI Insights START
  getPIInsightMeanMedianDuration(body){
    return this.http.post("/ReddisCopy/getGraphData", body)
  }
  getPIInsightResourceSelection(body){
    return this.http.post("/ReddisCopy/getGraphData", body)
  }
  getPIVariantActivity(body){
    return this.http.post("/ReddisCopy/getGraphData", body)
  }
  getBIinsights(body){
    return this.http.post("/ReddisCopy/getGraphData", body)
  }
  //PI Insights END


  getProcessStatistics()
  {
    return this.http.get("/rpa-service/process-statistics")
  }


  getProcessStatisticsbycat(cat)
  {
    return this.http.get("/rpa-service/process-statistics/"+cat);
  }

  getBotStatistics()
  {
    return this.http.get("/rpa-service/bot-statistics")
  }

  getAllActiveBots()
  {
    return this.http.get("/rpa-service/get-bots")
  }


  getprocessnames()
  {
    return this.http.get("/rpa-service/process-name");
  }

  checkbotname(botname)
  {
    let data="";
    return this.http.post("/rpa-service/check-bot?botName="+botname,data)
  }
  getDeleteBot(botId)
  {

    return this.http.post("/rpa-service/delete-bot?botId="+botId,"")
  }


  deployenvironment(envs){
    return this.http.post("/rpa-service/agent/deploy-agent",envs)
  }
  botPerformance(){
  return this.http.get("/rpa-service/management/bot-performance")
  }
  botUsage(){
    return this.http.get("/rpa-service/management/bot-usage")
    }

  getpredefinedotdata(botId)
  {
    return this.http.get("/rpa-service/load-predefined-bot?botId="+botId)
  }
  getUserRole(appID):Observable<any>{
    return this.http.get<any>('/authorizationservice/api/v1/user/role/applications/'+appID,httpOptions)
  }



  start_schedule(data)
  {
    return this.http.post("/rpa-service/specifiedscheduled-startbot", data);
  }

  stop_schedule(data)
  {
    return this.http.post("/rpa-service/specifiedscheduled-stopbot", data);
  }

  pause_schedule(data)
  {
    return this.http.post("/rpa-service/specifiedscheduled-pausebot", data);
  }


  resume_schedule(data)
  {
    return this.http.post("/rpa-service/specifiedscheduled-resumebot", data);
  }



  getprocessschedule(id)
  {
    return this.http.get("/rpa-service/get-process-schedule/"+id);
  }

  saveprocessschedule(data)
  {
    return this.http.post("/rpa-service/save-process-schedule",data);
  }

  startprocessschedule(schedule)
  {
    return this.http.post("/rpa-service/start-process-schedule",schedule);
  }

  pauseprocessschedule(schedule)
  {
    return this.http.post("/rpa-service/pause-process-schedule",schedule)
  }

  stopprocessschedule(schedule)
  {
    return this.http.post("/rpa-service/stop-process-schedule",schedule);
  }

  resumeprocessschedule(schedule_data)
  {
    return this.http.post("/rpa-service/resume-process-schedule",schedule_data);
  }

  assign_bot_and_task_develop(id,taskid,type)
  {
    let data:any
    if(type=="Automated")
    {
      data={
        "botId":id,
        "taskId":taskid,
        "assignedUserId":"0"
      };
    }
    else if(type=="Human")
    {
      data={
        "botId":"0",
        "taskId":taskid,
        "assignedUserId":id
      }
    }
    return this.http.post("/rpa-service/assign-bot",data);
  }


  assign_bot_and_task(id,taskid,source,type)
  {
    let data:any
    if(type=="Automated")
    {
      data={
        "botId":id,
        "taskId":taskid,
        "assignedUserId":"0",
       "sourceType":source,
      };
    }
    else if(type=="Human")
    {
      // data={
      //   "botId":"0",
      //   "taskId":taskid,
      //   "assignedUserId":id,
      // }

      data={
        "botId": "", 
        "taskId": taskid,
        "assignedUserId": id,
        "sourceType":""
        }
    }
 
    return this.http.post("/rpa-service/assign-bot",data);
  }

  getJDBCConnectorConfig(body){
    // return this.http.put('http://10.11.0.101:8083/connector-plugins/JdbcSourceConnector/config/validate', body)
    return this.http.post('/processintelligence/v1/connectorconfiguration/validateConfig', body)
    }


    getoutputbox(data)
    {
      return this.http.post('/rpa-service/outputBox',data);
    }

    getUserDetails(username){
      return this.http.get('/api/user/details?userId='+username,{responseType:"json"})
    }

    getNotifications(role,userId,notificationbody):Observable<any>{
     return this.http.post<any>('/notificationservice/api/v1/listNotifications?roles='+role+'&userId='+userId,notificationbody,httpOptions);
     }
    deleteNotification(notificationId):Observable<any>{
      return this.http.delete<any>('/notificationservice/api/v1/deleteNotification?notificationId='+notificationId,{responseType:"json"})
    }

    getReadNotificaionCount(role,userId,id,notificationbody):Observable<any>{
      return this.http.post<any>('/notificationservice/api/v1/NotificationsCount?roles='+role+'&userId='+userId+'&id='+id,notificationbody,httpOptions);
    }
    getNotificationaInitialCount(role,userId,notificationbody):Observable<any>{
      return this.http.post<any>('/notificationservice/api/v1/NotificationsCountinitial?roles='+role+'&userId='+userId,notificationbody,httpOptions);
    }

    getuserslist(tenantid)
    {
      return this.http.get<any>('/api/user/tenants/'+tenantid +'/users');
    }

    getAllUsersByDept()
    {
      return this.http.get("/platform-service/project/getallUsersByDept");
    }
    getProcesslogsdata(processId)
    {
      return this.http.get("/rpa-service/process-logs/"+processId);
    }

    getprocessruniddata(processId,processrunid)
    {
      return this.http.get("/rpa-service/process-logs/"+processId+"/"+processrunid  );
    }

    deployBPMNNotation(url, body){
      let headers = new HttpHeaders({
        "Content-Type":"multipart/form-data",
        });
      return this.http.post(url, body, {headers:  headers, responseType:'json'});
    }
    deleteprocessschedule(data)
    {
      return this.http.post("/rpa-service/stop-process-schedule",data);
    }

    get_dynamic_data(url)
    {
      return this.http.get(url);
    }
    startBpmnProcess(body){
      return this.http.post("/deployprocess/start-process",body);
    }

    getCustomUserRole(appID):Observable<any>{
      return this.http.get<any>('/authorizationservice/api/v1/user/role/'+appID,httpOptions)
    }
    getBPMNProcessArchNotations(bpmnModelId){
      return this.http.get("/bpsprocess/fetchByBpmnModel?bpmnModelId="+bpmnModelId)
    }


    getincidenttickets()
    {
      return this.http.get("/rpa-service/management/incidents");
    }
	
	slaconfigapi(data){
    return this.http.post('/rpa-service/save-sla-confuguration',data);
  }
  
getblueprisconnections()
    {
      return this.http.get("/rpa-service/agent/get-blue-prisms")
    }
	
 testcon_blueprism_config(data)
    {
      return this.http.post("/rpa-service/agent/blueprism-testconnection",data);
    }
	
save_blueprism_config(data)
    {
      return this.http.post("/rpa-service/agent/save-blue-prism",data);
    }

    edit_blueprism_config(data)
    {
      return this.http.put("/rpa-service/agent/update-blue-prism",data);
    }

    delete_blueprism_config(id)
    {
      return this.http.post("/rpa-service/agent/delete-blue-prism",id);
    }
	
	
	getblueprismbots()
    {
      return this.http.post("/rpa-service/management/get-blueprism-bots","");
    }
	
	getOrchestrationconfig()
    {
      return this.http.get("/rpa-service/management/get-source-details");
    }
	
	saveOrchestrationconfig(data)
    {
      return this.http.post("/rpa-service/management/save-source-details",data);
    }
	
	get_uipath_bots()
    {
      return this.http.post("/rpa-service/management/get-uipath-bots","");
    }
	update_uipath_env(data)
  {
     return this.http.put("/rpa-service/management/update-source-details",data)
  }
	getslalist()
    {
      return this.http.get("/rpa-service/list-sla-confuguration");
    }

    getallsobots()
    {
      return this.http.post("/rpa-service/management/all-bots","");
    }
	
	startuipathbot(botid)
    {
      return this.http.post("/rpa-service/management/start-uipath-bot?botKey="+botid,"")
    }
	start_blueprism_bot(bot)
    {
      return this.http.post("/rpa-service/management/start-blueprism-bot?botName="+bot,"");
    }
	
	get_blue_prism_logs(botName)
    {
      return this.http.post("/rpa-service/management/blueprism-bot-logs?botName="+botName,"");
    }
	
	getuipathlogs()
    {
      return this.http.get("/rpa-service/management/uipath-bot-logs");
    }
	
	runsmoketestuipath(){
      let data = "";
      return this.http.post("/rpa-service/management/uipath-smoketest",data);
    }
  

    runsmoketestBluePrism(data){
      let value = data;
   
      return this.http.post("/rpa-service/management/blueprism-smoketest?botName="+value,"", {responseType: "text" });
    }
	
	getschedules(botid,version)
    {
      return this.http.post("/rpa-service/getschedulesintervals-bot/"+botid+"?version="+version,"");
    }


    updateuipathschedules(schedules,bot)
    {
      return this.http.put("/rpa-service/management/update-schedules-otherbot",schedules);
    }

    update_sla_config(data)
    {
     return this.http.post("/rpa-service/update-sla-confuguration",data)
    }

    runsmoketestepsoftpath(data){
      let value = data;
      return this.http.post("/rpa-service/agent/bot-testconnection?botId="+value,"", {responseType: "text" });
    }

    getIncident(){
      return this.http.get('/rpa-service/management/incidents');
    }

    retryFailedProcessGraph(pid){
       return this.http.post("/retryPID", pid)
    }

    get_scheduled_bots(){
      return this.http.get('/rpa-service/management/scheduled-bots');
    }


    bot_export(botid)
    {
      return this.http.get("/rpa-service/exportBot/"+botid,{responseType: 'text'});
    }

    getslametrics()
    {
      return this.http.post("/rpa-service/management/sla-metrics","");
    }
	
  save_credentials(data: any) {
    return this.http.post('/rpa-service/agent/save-credentials', data)
  }

    getAllCredentials(){
      return this.http.get("/rpa-service/agent/get-credentials")
    }

   applyPerformanceFilter(data){
    return this.http.post("/ReddisCopy/getGraphData",data)
   }
 
  get_All_Credentials(role) {
    return this.http.get("/rpa-service/agent/get-credentials?role="+role)
  }

  update_Credentials(data: any) {
    return this.http.put("/rpa-service/agent/update-credential", data)
  }

  delete_Credentials(data: any) {
    return this.http.post("/rpa-service/agent/delete-credentials", data)
  }

  modifybotdetails(botdetails):Observable<any>{
      return this.http.post("/rpa-service/updateBotMetaDetails",botdetails);
  }


    importbot(data)
    {
      return this.http.post("/rpa-service/importBot",data);
    }


    save_ui_path_env(data)
    {
      return this.http.post("/rpa-service/management/save-source-details",data)
    }

    getAllProjects(roles,name,email){
      return this.http.get("/platform-service/project/fetchAllByDept?roles="+roles+"&name="+name+"&email="+email+"")
    }

 
    update_project(data:any){
      return this.http.post("/platform-service/project/updateproject", data)
    }

    delete_Project(data: any) {
      return this.http.post("/platform-service/project/deleteproject", data)
    }
    saveProgram(program: any) {
      return this.http.post("/platform-service/program/create",program)
    }

    createProject(data)
    {
      return this.http.post("/platform-service/project/create",data)
    }
    
    saveProjectByProgramId(programid, data)
    {
      return this.http.post("/platform-service/project/addProjectbyProgramId?programId="+programid,data);
    }

    getunassignedprojects(roles,name,email)
    {
      return this.http.get("/platform-service/project/getUnassignedProjects?roles="+roles+"&name="+name+"&email="+email+"");
    }

    getRole(userid){
       return this.http.get("/authorizationservice/api/v1/user/role/userId/"+userid+"")
    }


    addresourcebyid(data:any)
    {
      return this.http.post("/platform-service/project/addResources",data)
    }


    getProjectDetailsById(id):Observable<any>{
      return this.http.get("/platform-service/project/findProjectById?projectId="+id+"")
    }


    getProjectsByProgramId(id)
    {
      return this.http.get("/platform-service/project/findByProgramId?programId="+id);
    }




  createTask(data) {
    return this.http.post("/platform-service/task/create", data)
  }

  deleteTask(id){
    return this.http.post("/platform-service/task/delete", id)
  }
  updateTask(data){
    return this.http.post("/platform-service/task/update", data)
  }
  gettaskandComments(id){
    return this.http.get("/platform-service/task/fetchTasksByProjectId?projectId="+id+"")
  }
  getTaskCategories(){
    return this.http.get("/platform-service/task/fetchTaskCategories")
  }
  getTaskAttachments(projectid,taskid){
    return this.http.get("/platform-service/document/tasksAttachments/"+projectid+"/"+taskid+"")
  }


  downloadTaskAttachment(attachment)
  {
    return this.http.post("/platform-service/document/downloadFile",attachment);
  }
  uploadTaskfile(data){
    return this.http.post("/platform-service/document/uploadResource", data);
  }
  uploadProjectFile(body):Observable<any>{
    return this.http.post("/platform-service/document/uploadResource", body)
  }
  getFileDetails(projectId):Observable<any>{
    return this.http.get("/platform-service/document/uploadedFilesInfo/"+projectId)
  }
  revokeOrDenyFileRequest(body):Observable<any>{
    return this.http.post("/platform-service/document/revokeorDenyFileRequest", body)
  }
  requestFile(projectId):Observable<any>{
    return this.http.post("/platform-service/document/requestFileToUpload",projectId)
  }
  getFileCategories():Observable<any>{
    return this.http.get("/platform-service/document/fileCategories")
  }
  deleteResource(body){
    return this.http.post("/platform-service/project/deleteResources",body)
  }
  downloadFiles(id):Observable<any>{
    return this.http.get("/platform-service/document/fileCategories")
  }
  // Business Insights API's Start
  getBIActivityTime(processId){
    return this.http.get("/processintelligence/v1/processgraph/getActivityTimeData/"+processId);
  }
  getBIThroughputTime(processId){
    return this.http.get("/processintelligence/v1/processgraph/getThroughputTimeDataV2/"+processId);
  }
  getBusinessMetrics(processId){
    return this.http.get("/processintelligence/v1/processgraph/getBusinessMetricsData/"+processId);
  }
  getBIVariantsData(processId){
    return this.http.get("/processintelligence/v1/processgraph/getVariantAnalysisData/"+processId);
  }// BI Insighs apis End
  
  getLatestfiveAttachments(projectid,timezone){
    return this.http.get("/platform-service/document/uploadedFilespaged/"+projectid,timezone)
  }
  deleteFiles(input){
    return this.http.post("/platform-service/document/deleteUploadedFile",input)
  }


  getvaluechain()
  {
    return this.http.get("/vcmprocess/getVcmMasterContent")
  }

getvaluechainprocess(id)
{
  return this.http.get("/vcmprocess/getVcmProcessGroupInfoByMasterId/"+id);
}


  exportproject(projectid)
  {
    return this.http.get("/platform-service/program/exportProject?projectId="+projectid)
  }
  savedata(id,data):Observable<any>{
    return this.http.post("/platform-service/project/addProjecttoexistingProgram/"+id,data)
  }
  
  getBpmnNotationById(bpmnId){
    return this.http.get("/bpsprocess/get/"+bpmnId)
  }

  updateUser(user: any): Observable<any> {
    return this.http.post<any>(`/api/user/updateUserDetails`, user);

  }
  getDepartments():Observable<any>{
    return this.http.get<any>('/processintelligence/v1/processgraph/categories')
  }
  changePassword(pswdbody:any): Observable<any>{
    return this.http.post<any>('/api/user/passwordChange', pswdbody,httpOptions)
  }

  deleteSelectedProcessID(request_body:any): Observable<any>{
    return this.http.post<any>('/processintelligence/v1/processgraph/deletebyPiId', request_body)
  }
  get_processes_scheduled(){
    return this.http.get("/rpa-service/scheduled-process")
  }

  // Support module
  getAllCustomerRequests() {
    return this.http.get("/api/servicedesk/getAllCustomerRequests");
  }
  getAllCustomerRequestsByOrg(orgName:string){
   return this.http.get('/api/servicedesk/getAllCustomerRequestsByOrg?orgName=' + orgName);
  }
  createTemporaryFile(data){
   return this.http.post("/api/servicedesk/createTemporaryFile",data);
  }
  createCustomerRequest(data:object){
   return this.http.post('/api/servicedesk/createCustomerRequest',data, { responseType: "text" });
  }
  getAllImpactLevels() {
    return this.http.get('/api/servicedesk/getAllImpactLevels');
  }
  getAllSeverityLevels(){
    return this.http.get('/api/servicedesk/getAllSeverityLevels');
  }
  getAllRequestTypes(){
    return this.http.get('/api/servicedesk/getAllRequestTypes');
  }
  getAllJiraOrganizations(){
    return this.http.get('/api/servicedesk/getAllJiraOrganizations');
  }
  getRequestComments(id:any){
    return this.http.get("/api/servicedesk/getRequestComments?requestKey=" + id);
  }
  createCommentInRequest(data:any){
    return this.http.post('/api/servicedesk/createCommentInRequest',data,{ responseType: "text" })
  }
  editComment(comment:any){
    return this.http.post('/api/servicedesk/editComment',comment, { responseType: "text" });
  }
  editSummary(id:any,data:any){
    return this.http.post('/api/servicedesk/editSummary?request='+id,data, { responseType: "text" })
  }
  editDescription(id:any,data:any){
    return this.http.post('/api/servicedesk/editDescription?request='+id,data, { responseType: "text" })
  }
  getAttachmentsForCustomerRequest(id:any){
    return this.http.get('/api/servicedesk/getAttachmentsForCustomerRequest?requestKey='+id, { responseType: "json" });
  }
  createAttachmentsForATicket(data){
    return this.http.post('/api/servicedesk/createAttachmentsForATicket',data , { responseType: "text" });
  }
  getCustomerRequestStatus(requestKey){
    return this.http.get("/api/servicedesk/getCustomerRequestStatus?requestKey=" + requestKey, { responseType: "text" });
  }
  removeAttachmentsFromCustomerRequest(data:any){
   return this.http.post('/api/servicedesk/removeAttachmentsFromCustomerRequest', data, { responseType: "text" });
  }
  removeAllAttachmentsFromCustomerRequest(requestId:any){
   return this.http.get("/api/servicedesk/removeAllAttachmentsFromCustomerRequest?requestKey="+ requestId, { responseType: "text" });
  }
  deleteComment(body){
   return this.http.post('/api/servicedesk/deleteComment',body,{ responseType: "text" });
  }
  getListOfComponents(){
    return this.http.get('/api/servicedesk/getcomponents')
  }
  getselectedRequestKey(key){
   return this.http.get('/api/servicedesk/getCustomerRequestsByRequestKey?requestKey='+key);
  }

  deleteDepartments(data):Observable<any>{
    const httpOps = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
            }),
      body: data
    }
    return this.http.delete<any>('/platform-service/department/categories',httpOps)
     
  }

  getDepartmentsList(): Observable<any>{
    return this.http.get('/platform-service/department/categories')
  }

  createDepartment(body:any): Observable<any>{
    return this.http.post<any>('/platform-service/department/categories', body,httpOptions)
  }

  updateDepartment(data:any): Observable<any>{
    return this.http.put<any>('/platform-service/department/categories', data,httpOptions)
  }

  getDepartmentDetails(id){
    return this.http.get('/platform-service/department/'+id+'')
  }

  deleteSelectedUser(userId):Observable<any>{
    return this.http.delete<any>('/api/user/deleteSelectedUser?userId='+userId)
     
 }

 inviteUserwithoutReg(body):Observable<any>{
  return this.http.post<any>("/api/user/userInviteRegistration", body)
 }
 getAllRoles(appId):Observable<any>{
  return this.http.get<any>('/authorizationservice/api/v1/application/'+appId+'/roles')

}

updateUserRoleDepartment(data):Observable<any>{
  return this.http.put<any>('/authorizationservice/api/v1/user/role/userUpdate', data)
}
 
getProjectIntitiatives():Observable<any>{
  return this.http.get<any>('/platform-service/project/get-initiatives')
 }

// Process Owner && Process Architect Dashboard 

getProjectsTasksProcessChanged(email,name,role){
  return this.http.get
  (`/platform-service/dashboard/getProjectsTasksProcessChanged?email=${email}&name=${name}&roles=${role}`);
}
getProjectCompletionDuration(role,email,name,duration){
  return this.http.get
  (`/platform-service/dashboard/getProjectCompletionDuration?roles=${role}&email=${email}&name=${name}&duration=${duration}`);
}
getPendingApprovals(role,email,name,duration){
  return this.http.get(`/platform-service/dashboard/getPendingApprovals?roles=${role}&email=${email}&name=${name}&duration=${duration}`);
}
getAllProjectProgress(role,email,name,duration){
  return this.http.get(`/platform-service/dashboard/getAllProjectProgress?roles=${role}&email=${email}&name=${name}&duration=${duration}`);
}
getAllProjectStatus(role,email,name,duration){
  return this.http.get(`/platform-service/dashboard/getAllProjectStatus?roles=${role}&email=${email}&name=${name}&duration=${duration}`);
}
getActivityStream(role,email,name){
  return this.http.get(`/platform-service/dashboard/getActivityStream?roles=${role}&email=${email}&name=${name}`);
}
getUpcomingDueDates(role,email,name){
  return this.http.get(`/platform-service/dashboard/getUpcomingDueDates?roles=${role}&email=${email}&name=${name}`);
}
gettotalEffortExpenditure(role,email,name){
  return this.http.get(`/platform-service/dashboard/gettotalEffortExpenditure?roles=${role}&email=${email}&name=${name}`);
}
getEffortExpenditureAnalysis(role,email,name){
  return this.http.get(`/platform-service/dashboard/getEffortExpenditureAnalysis?roles=${role}&email=${email}&name=${name}`);
}
gettopEffortsSpent(role,email,name){
  return this.http.get(`/platform-service/dashboard/gettopEffortsSpent?roles=${role}&email=${email}&name=${name}`);
}

// Process Analyst

getAllTaskStatus(role,email,name,duration){
  return this.http.get(`/platform-service/dashboard/getAllTaskStatus?roles=${role}&email=${email}&name=${name}&duration=${duration}`);
}
getAllTasksProgress(role,email,name,duration){
  return this.http.get(`/platform-service/dashboard/getAllTasksProgress?roles=${role}&email=${email}&name=${name}&duration=${duration}`);
}



deleteTaskInProcess(id):Observable<any>{
  return this.http.get('/rpa-service/delete-task/'+id)
}

tasksListInProcess(id):Observable<any>{
  return this.http.get('/rpa-service/get-tasks/'+id)

}

addtaskInProcess(id):Observable<any>{
  return this.http.post('/rpa-service/add-task',id)
}
getProgrmaDetailsById(programid){
  return this.http.get('/platform-service/project/getProgramDetailsById?programId='+programid)
}

  getProductPlans(productId, tenantID): Observable<any[]> {
    return this.http.get<any[]>('/subscriptionservice/v1/products/' + productId + '/plans', { responseType: 'json' });
  }
  listofsubscriptions(): Observable<any> {
    return this.http.get<any>('/subscriptionservice/v1/subscriptions');
  }
  cancelSubscription(data): Observable<any> {
    return this.http.post<any>('/subscriptionservice/v1/subscriptions/' + data.id + '/cancel?isImmediateCancel=' + true, { responseType: 'json' });
  }
  invoicedownload(invoiceId): Observable<any> {
    return this.http.get<any>('/subscriptionservice/v1/invoices/' + invoiceId + '/pdf', { responseType: 'blob' as 'json' })
  }
  listofinvoices(): Observable<any> {
    return this.http.get<any>('/subscriptionservice/v1/invoices')
  }
  listofPaymentModes():Observable<any>{
    return this.http.get<any>('/subscriptionservice/v1/paymentmethods')
  }

  getSubscriptionPaymentToken(cardData,){
    return this.http.post('/subscriptionservice/v1/paymentmethods/cardToken?tab=subs',cardData,{ responseType:'json'})
  }

  subscribePlan(token,planData){
    return this.http.post<any>('/subscriptionservice/v1/orders?paymentToken='+token,planData,{responseType:'json'})
  }

  expiryInfo():Observable<any>{
     return this.http.get<any>('/subscriptionservice/v1/freetrials/planExpiryInfo')
  }
  getWhiteListedDomain(domain):Observable<any>{
    return this.http.get<any>('/api/tenant/whiteListedDomain?domain='+domain)
     
 }
 getMyAccountPaymentToken(cardData){
  return this.http.post('/subscriptionservice/v1/paymentmethods/cardToken?tab=myaccount',cardData,{responseType:'json'})
}
addNewCard(token,isdefault) :Observable<any>{
  return this.http.post<any>('/subscriptionservice/v1/paymentmethods?paymentToken='+token+'&markAsDeafult='+isdefault,httpOptions)
}
deletePaymentMode(paymentMethodId):Observable<any>{
  return this.http.post<any>('/subscriptionservice/v1/paymentmethods/'+paymentMethodId,httpOptions);
}
setasDefaultCard(paymentModeId){
  return this.http.post('/subscriptionservice/v1/paymentmethods/set-default/'+paymentModeId,{responseType:'json'});
}

updatePiData(body){
  return this.http.post('/processintelligence/v1/processgraph/UpdateProcessName',body)
}
updateBpsData(body){
  return this.http.post('/bpsprocess/updateBpmnInfo',body);
}
bpmnVersionChecking(bpmnId){
  return this.http.get('/bpsprocess/checkBpmnVersion?bpmnModelId='+bpmnId);
}
deleteNotationFromTemp(body){
  return this.http.post('/bpsprocess/delete/processTempInfo/data',body); 
}

// vcm apis
createVcm(body){
  return this.http.post('/vcmv2/saveLevel1andlevel2vcm',body); 
}

getAllvcms(){
  return this.http.get('/vcmv2/fetchallvcm');
}

getselectedVcmById(id){
  return this.http.get('/vcmv2/fetchvcm?vcmId='+id);
}
deleteVcm(body){
  return this.http.post('/vcmv2/deletevcm',body); 
}

uploadVCMPropDocument(body){
  return this.http.post('/vcmv2/uploadDocuments',body);
}
getvcmAttachements(body){
  return this.http.post('/vcmv2/fetchDocumentsByProcessType',body); 
}
ondeleteAttachements(body){
  return this.http.post('/vcmv2/deleteDocument',body);
}
updateVcm(body){
  return this.http.post('/vcmv2/updatevcm',body);
}
getCollaborators(uniqueId){
  return this.http.get('/vcmv2/fetchCollaborations?uniqueId='+uniqueId)
}
createCollaborators(body){
  return this.http.post('/vcmv2/createCollaborations',body);
}
updateCollaborators(body){
  return this.http.post('/vcmv2/updateCollaborations',body);
}
deleteCollaborators(body){
  return this.http.post('/vcmv2/deleteCollaborations',body);
}
deleteAttachements(body){
  return this.http.post('/vcmv2/deleteDocument',body);
}
getAttachementsByIndivdualProcess(body){
  return this.http.post('/vcmv2/fetchDocumentsByIndivdualProcess',body);
}
getAttachementsById(body){
  return this.http.post('/vcmv2/fetchDocumentsBydocumentId',body);
}
getAttachementsBycategory(body){
  return this.http.post('/vcmv2/fetchDocumentsByProcessType',body);
}
getAttachementsByLevel(body){
  return this.http.post('/vcmv2/fetchDocumentsByLevel',body);
}

getLooplogs(botId,version,runId){
  return this.http.get(`/rpa-service/loop-logs/${botId}/${version}/${runId}`);
}


}
