import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'HumanlistbycatPipe'
})
export class HumanlistbycatPipe implements PipeTransform {

  transform(value: any,arg1: any) {
    let users:any=[];
    let usersbycat:any=[];
    users=value;
    users.forEach(item=>{
      if(item.departmentsList.includes(arg1))
      {
         usersbycat.push(item);
      }
    });
    return usersbycat;
  }

}
