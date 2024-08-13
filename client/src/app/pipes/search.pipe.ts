import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], searchValue: string): any[] {
    if (!Array.isArray(value) || !searchValue) {
      return value;
    }

    return value.filter((user: any) => {
      return user.displayName.toLowerCase().includes(searchValue.toLowerCase());
    });
  }

}
