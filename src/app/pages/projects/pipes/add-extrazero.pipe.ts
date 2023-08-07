import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'AddExtrazero'
})
export class AddExtrazeroPipe implements PipeTransform {
  transform(value: any) {
    // Add an extra zero when the value is zero
    if (value === 0) {
      return '00';
    }
    // If the value is less than 10, add a leading zero
    if (value < 10) {
      return '0' + value;
    }
    return value.toString(); // Return the original value if no special case is met
  }
}