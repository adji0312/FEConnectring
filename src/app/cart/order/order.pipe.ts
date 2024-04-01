import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'order'
})
export class OrderPipe implements PipeTransform {

  transform(value: any[], field: string): any[] {
    if (!Array.isArray(value) || !field) return value;

    const uniqueItems = [];
    const uniqueValues = new Set();

    for (const item of value) {
      const fieldValue = item[field];
      if (!uniqueValues.has(fieldValue)) {
        uniqueValues.add(fieldValue);
        uniqueItems.push(item);
      }
    }

    return uniqueItems;
  }

}
