import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userLetters'
})
export class UserLettersPipe implements PipeTransform {
  transform(userId: any, users_list: any[]): any {
    const regex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    if (regex.test(userId)) {
      if (users_list.length > 0 && userId) {
        let user = users_list.find(item => item.userId.userId == userId);
        // if (user.userId.image == null) {
          return user != undefined ? (user.userId.firstName.replace(/\s/g, "").charAt(0) + user.userId.lastName.replace(/\s/g, "").charAt(0)) : "";
        // }
      }
    } else {
      let usernames
      let finalName='';
      if(userId){
        usernames = userId.split(' ');
        finalName = usernames[0].replace(/\s/g, "").charAt(0) + usernames[1].replace(/\s/g, "").charAt(0)
      }
      return finalName;
    }
}

}
