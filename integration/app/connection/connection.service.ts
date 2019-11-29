import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Injectable()
export class ConnectionService {
  subscription = new Subject()
    .pipe(
      finalize(() => {
        console.log('The first ConnectionService stream has completed');
      })
    )
    .subscribe();

  constructor() {
    new Subject()
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          console.log('The second ConnectionService stream has completed');
        })
      )
      .subscribe();
  }
}
