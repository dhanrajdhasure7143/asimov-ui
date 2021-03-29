import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'HumanlistbycatPipe'
})
export class HumanlistbycatPipe implements PipeTransform {

  transform(value: any,arg1: any,categories:any) {
    let users:any=[],usersbycat:any=[];
    users=value;
    usersbycat=users.filter(item=>item.userId.department==arg1);
    return usersbycat;
  }

}
