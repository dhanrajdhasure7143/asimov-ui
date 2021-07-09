import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'processName'
})
export class ProcessNamePipe implements PipeTransform {

  transform(processId: any, process_list: any[]): any {
    let processName:any;
    if(isNaN)
    {
      processName=process_list.find(item=>item.processId==parseInt(processId));
    }
    return processName==undefined?processId:processName.processName;
  }

}
