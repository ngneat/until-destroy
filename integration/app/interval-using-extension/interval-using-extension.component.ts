import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { pluck, debounceTime, finalize } from 'rxjs/operators';

import { IntervalUsingExtensionService } from './interval-using-extension.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-interval-using-extension',
  templateUrl: './interval-using-extension.component.html'
})
export class IntervalUsingExtensionComponent implements OnDestroy {
  valueFromIntervalService = 0;

  subscription = fromEvent<MouseEvent>(document, 'mousemove')
    .pipe(
      debounceTime(200),
      pluck<MouseEvent, number>('clientX'),
      finalize(() => console.log('IntervalUsingExtensionComponent fromEvent has been unsubscribed'))
    )
    .subscribe(clientX => {
      console.log(`Mouse clientX position is ${clientX}`);
    });

  private intervalService = new IntervalUsingExtensionService();

  constructor() {
    this.intervalService.interval$
      .untilDestroyed(this)
      .pipe(
        finalize(() =>
          console.log('IntervalUsingExtensionComponent intervalService.interval$ has been unsubscribed')
        )
      )
      .subscribe(value => {
        console.log(`IntervalUsingExtensionService emitted value inside component ${value}`);
        this.valueFromIntervalService = value;
      });
  }

  ngOnDestroy(): void {
    this.intervalService.destroy();
  }
}
