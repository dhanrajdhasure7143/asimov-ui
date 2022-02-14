import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'initiativePipe'
  })
  export class IntitiativePipe implements PipeTransform {
    transform(Id: any, initiatives_list: any[]): any {
      if(initiatives_list!=undefined){
        let data=initiatives_list.find(item=>item.id==Id);
        return data!=undefined?(data.initiative):Id;
      }
       
      }
    }