import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userLetters'
})
export class UserLettersPipe implements PipeTransform {
  transform(userId: any, users_list: any[]): any {
    
    if(users_list.length > 0 && userId){
      let user=users_list.find(item=>item.userId.userId==userId);
      if(user.userId.image==null){
        return user!=undefined?(user.userId.firstName.charAt(0)+user.userId.lastName.charAt(0)):userId;
      }
  }
}

}
