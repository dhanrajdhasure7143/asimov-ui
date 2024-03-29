import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'tasksearch'
})
export class TasksearchPipe implements PipeTransform {

  transform(nodes, filteredText): any {
    let data=nodes.filter(item=>item.name.toLowerCase().includes(filteredText.toLowerCase()));
    if(data.length==0)
    {
      let finaltask:any=[];
      nodes.forEach(item=>{
        item.tasks.forEach(item2=>{
          if(item2.name.toLowerCase().includes(filteredText.toLowerCase()))
          {
            finaltask=nodes.filter(nodedata=>nodedata.name==item.name);
                finaltask =finaltask.map(finalnode=>{
                finalnode.expanded=true;
                return finalnode
            })
          }
        })
      })
      let finalnodes:any[];
      
      return filteredText==""?nodes:finaltask;
    }
    else
    {
      data.forEach(itemdata=>{
        $("#"+itemdata.name).click();
      })

      return data;
    }
    
  }

}
