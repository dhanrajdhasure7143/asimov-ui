import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'task'
})
export class TaskPipe implements PipeTransform {

  transform(node: any): any {
    let nodedata=node;
    let data:any=[];
    data= node.tasks.map(task=>{
        let updatedTaskObj={
          name:nodedata.name,
          path:nodedata.path,
          selectedNodeTask:task.name,
          selectedNodeId:task.taskId,
          action_uid:task.action_uid,
          tasks:nodedata.tasks
        };
        if(task.taskIcon!="null" && task.taskIcon !="")
          updatedTaskObj["path"]='data:image/png;base64,'+task.taskIcon;
        return updatedTaskObj;
      })
    return data;
  }

}
