import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userPipe'
})
export class UserPipePipe implements PipeTransform {

  transform(userId: any, users_list: any[]): any {
    let user=users_list.find(item=>item.userId.userId==userId);
    return user!=undefined?(user.userId.firstName+ " "+user.userId.lastName):userId;
  }
  

}
