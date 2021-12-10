import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userImagePipe'
})
export class UserImagePipe implements PipeTransform {
    transform(userId: any, users_list: any[]): any {
      console.log(userId, "  ", users_list);
      if(users_list.length > 0 && userId){
        let user=users_list.find(item=>item.userId.userId==userId);
        if(user.userId.image==null){
          return user!=undefined?(user.userId.firstName.charAt(0)+ " "+user.userId.lastName.charAt(0)):userId;
        }
        if(user.userId.image!=null){
          return user!=undefined?('data:image/jpeg;base64,' +user.userId.image):userId;
        }
    }
  }


}