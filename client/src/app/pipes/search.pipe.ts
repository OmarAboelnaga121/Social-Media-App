import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(value: any, searchValue : any): any {
    return value.filter((e:any) =>{
      return (
        e.users.indexOf(searchValue) > -1

      );
  });
  }

}
