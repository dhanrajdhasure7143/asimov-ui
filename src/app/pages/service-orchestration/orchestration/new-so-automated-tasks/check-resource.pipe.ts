import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkResource'
})
export class CheckResourcePipe implements PipeTransform {

  transform(id: any, resourceList: any[], sourceType:any, taskType:any ) {
      if(taskType=="Automated")
      {
        var val=""
        if(sourceType=="EPSoft")
          val= (resourceList.find(item=>parseInt(item.botId)==parseInt(id))!=undefined)?(resourceList.find(item=>parseInt(item.botId)==parseInt(id)).botId):"0";
        else if(sourceType=='UiPath')
          val= (resourceList.find(item=>item.Key==id)!=undefined)?resourceList.find(item=>item.Key==id).Key:"0";
        else if(sourceType=='BluePrism')
          val= (resourceList.find(item=>item.botName==id)!=undefined)?resourceList.find(item=>item.botName==id).botName:"0";
        return val;
      }
      else if(sourceType=="Human")
      {
      }
      return id
  }

}
