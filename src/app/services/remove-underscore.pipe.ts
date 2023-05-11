import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore'
})
export class RemoveUnderscorePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return ''; // Return an empty string if the input value is undefined or null
    }
    return value.replace(/_/g, '');
  }

}
