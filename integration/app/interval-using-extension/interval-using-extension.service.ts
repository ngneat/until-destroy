import { interval, Subject } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';

export class IntervalUsingExtensionService {
  interval$ = new Subject<number>();

  constructor() {
    interval(1000)
      .untilDestroyed(this, 'destroy')
      .subscribe(value => {
        console.log(`IntervalUsingExtensionService emits value ${value}`);
        this.interval$.next(value);
      });
  }

  destroy(): void {}
}
