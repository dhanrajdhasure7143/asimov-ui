import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSizePipe'
})
export class FileSizePipe implements PipeTransform {
    transform(size: number, extension: string = 'MB') {
      // return (size / (1024 * 1024)).toFixed(2)+" " + extension;
      if (size === 0) {
        return '0 B';
      }
      const k = 1024;
      const decimals = 2;
      const sizes = ['B', 'KB', 'MB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      const formattedValue = parseFloat((size / Math.pow(k, i)).toFixed(decimals));
      return `${formattedValue} ${sizes[i]}`;
    }
  }