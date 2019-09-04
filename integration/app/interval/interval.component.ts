import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { fromEvent } from 'rxjs';
import { pluck, debounceTime } from 'rxjs/operators';

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
      pluck<MouseEvent, number>('clientX')
    )
    .subscribe(clientX => {
      console.log(`Mouse clientX position is ${clientX}`);
    });

  private intervalService = new IntervalService();

  constructor() {
    console.clear();

    this.intervalService.interval$.pipe(untilDestroyed(this)).subscribe(value => {
      console.log(`IntervalService emitted value inside component ${value}`);
      this.valueFromIntervalService = value;
    });
  }

  ngOnDestroy(): void {
    this.intervalService.destroy();
  }
}
