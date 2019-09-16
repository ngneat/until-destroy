import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { pluck, debounceTime, finalize } from 'rxjs/operators';

import { IntervalService } from './interval.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html'
})
export class IntervalComponent implements OnDestroy {
  valueFromIntervalService = 0;

  subscription = fromEvent<MouseEvent>(document, 'mousemove')
    .pipe(
      debounceTime(200),
      pluck<MouseEvent, number>('clientX'),
      finalize(() => console.log('IntervalComponent fromEvent stream has completed'))
    )
    .subscribe(clientX => {
      console.log(`Mouse clientX position is ${clientX}`);
    });

  private intervalService = new IntervalService();

  constructor() {
    console.clear();

    this.intervalService.interval$
      .pipe(
        untilDestroyed(this),
        finalize(() => console.log('IntervalComponent intervalService.interval$ stream has completed'))
      )
      .subscribe(value => {
        console.log(`IntervalService emitted value inside component ${value}`);
        this.valueFromIntervalService = value;
      });
  }

  ngOnDestroy(): void {
    this.intervalService.destroy();
  }
}
