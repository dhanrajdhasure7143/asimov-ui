import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'botlistbycat'
})
export class BotlistbycatPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    let botlist:any=[];
    botlist=value;
    let categoryId:any=arg;
    return botlist.filter(item=>item.department==categoryId);
  }

}
