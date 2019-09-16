import { Directive } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntilDestroy } from '@ngneat/until-destroy';
import { interval, of } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';

@UntilDestroy({ checkProperties: true })
@Directive({ selector: '[http]' })
export class HttpDirective {
  subscription = interval(2000)
    .pipe(
      switchMap(() => this.http.get('https://jsonplaceholder.typicode.com/users').pipe(catchError(() => of([])))),
      finalize(() => console.log('HttpDirective stream has completed'))
    )
    .subscribe(response => {
      console.log('HttpDirective got such response via HTTP: ', response);
    });

  constructor(private http: HttpClient) {}
}
