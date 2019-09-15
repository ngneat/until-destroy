import { interval, Subject } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

export class IntervalService {
  interval$ = new Subject<number>();

  constructor() {
    interval(1000)
      .pipe(untilDestroyed(this, 'destroy'))
      .subscribe(value => {
        console.log(`IntervalService emits value ${value}`);
        this.interval$.next(value);
      });
  }

  destroy(): void {}
}
