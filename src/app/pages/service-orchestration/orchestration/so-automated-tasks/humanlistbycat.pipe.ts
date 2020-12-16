import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanlistbycat'
})
export class HumanlistbycatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    console.log('-----------------custom pipe----------',value)
    return null;
  }

}
