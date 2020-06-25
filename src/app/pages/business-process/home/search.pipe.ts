import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!args){
      return value;
    }
    return value.filter((val)=>{
      let rVal=(val.name.toLocaleLowerCase().includes(args)) || (val.venue.toLocaleLowerCase().includes(args)) || (val.timing.toString().includes(args)) || (val.address.toLocaleLowerCase().includes(args));
      return rVal;
    })
    
  }

}