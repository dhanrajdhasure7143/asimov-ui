import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userDetials'
})
export class UserDetialsPipe implements PipeTransform {

  transform(resources:any[],users_list:any[]): any {
 
    var users:any=[];
    let data= resources.forEach(item=>{
       if(users_list.find(item2=>item2.userId.userId==item.resource)!=undefined)
        users.push(users_list.find(item2=>item2.userId.userId==item.resource))
    })
    return users;
  }

}
