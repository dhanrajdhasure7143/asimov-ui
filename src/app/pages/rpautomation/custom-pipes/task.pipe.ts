import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'task'
})
export class TaskPipe implements PipeTransform {

  transform(node: any): any {
    let nodedata=node;
    let data:any=[];
    data= node.tasks.map(task=>{    
        
        return {
          name:nodedata.name,
          path:nodedata.path,
          selectedNodeTask:task.name,
          selectedNodeId:task.taskId,
          tasks:nodedata.tasks
        };
      })
    return data;
  }

}
