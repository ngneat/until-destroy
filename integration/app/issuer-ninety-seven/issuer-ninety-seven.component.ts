import { Directive, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive()
export abstract class IssueNinetySevenDirective {}

@Component({
  selector: 'app-issue-ninety-seven',
  template: ''
})
export class IssueNinetySevenComponent extends IssueNinetySevenDirective {
  constructor() {
    super();

    new Subject()
      .pipe(
        untilDestroyed(this),
        finalize(() => console.log('IssueNinetySevenComponent subject has been unsubscribed'))
      )
      .subscribe();
  }
}
