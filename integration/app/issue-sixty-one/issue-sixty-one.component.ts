import { Directive, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Directive()
export abstract class IssueSixtyOneBaseDirective {
  constructor() {
    interval(1000)
      .pipe(
        untilDestroyed(this),
        finalize(() =>
          console.log('IssueSixtyOneBaseDirective interval has been unsubscribed')
        )
      )
      .subscribe(value =>
        console.log(`IssueSixtyOneBaseDirective has emitted value ${value}`)
      );
  }
}

@UntilDestroy()
@Component({
  selector: 'app-issue-sixty-one',
  template: ''
})
export class IssueSixtyOneComponent extends IssueSixtyOneBaseDirective {
  constructor() {
    super();

    interval(1000)
      .pipe(
        untilDestroyed(this),
        finalize(() => console.log('IssueSixtyOneComponent subject has been unsubscribed'))
      )
      .subscribe(value => console.log(`IssueSixtyOneComponent has emitted value ${value}`));
  }
}
