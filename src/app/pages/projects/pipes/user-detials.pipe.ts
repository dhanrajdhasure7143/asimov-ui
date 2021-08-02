import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userDetials'
})
export class UserDetialsPipe implements PipeTransform {

  transform(resourses:any[],users_list:any[]): any {
    console.log("resourses", resourses, users)
    var users:any=[];
    let data= resourses.forEach(item=>{
       if(users_list.find(item2=>item2.userId.userId==item)!=undefined)
        users.push(users_list.find(item2=>item2.userId.userId==item))
    })
    console.log("---------------------------------------------------------",data);
    return users;
  }

}
