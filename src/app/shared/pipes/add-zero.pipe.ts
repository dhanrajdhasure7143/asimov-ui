import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addZero'
})
export class AddZeroPipe implements PipeTransform {
  transform(value: any) {
    console.log(value)
    // Add an extra zero when the value is zero
    if (value == 0) {
      return '00';
    }
    // If the value is less than 10, add a leading zero
    if (value < 10) {
      return '0' + parseInt(value);
    }
    return value.toString(); // Return the original value if no special case is met
  }
}