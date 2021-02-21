import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationClass, NotificationText } from '../enums/notification.enum';

@Component({
  selector: 'app-inheritance',
  templateUrl: './inheritance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InheritanceComponent {
  issue61Shown = true;
  issue97Shown = true;

  issue61Status$ = new BehaviorSubject({
    directiveUnsubscribed: false,
    componentUnsubscribed: false
  });

  issue61StatusClass$ = this.issue61Status$.pipe(
    map(({ directiveUnsubscribed, componentUnsubscribed }) => {
      if (directiveUnsubscribed && componentUnsubscribed) {
        return NotificationClass.Success;
      } else {
        return NotificationClass.Danger;
      }
    })
  );

  issue61StatusText$ = this.issue61Status$.pipe(
    map(({ directiveUnsubscribed, componentUnsubscribed }) => {
      if (directiveUnsubscribed && componentUnsubscribed) {
        return NotificationText.Unsubscribed;
      } else {
        return NotificationText.Subscribed;
      }
    })
  );

  issue97Status$ = new BehaviorSubject({
    componentUnsubscribed: false
  });

  issue97StatusClass$ = this.issue97Status$.pipe(
    map(({ componentUnsubscribed }) =>
      componentUnsubscribed ? NotificationClass.Success : NotificationClass.Danger
    )
  );

  issue97StatusText$ = this.issue97Status$.pipe(
    map(({ componentUnsubscribed }) =>
      componentUnsubscribed ? NotificationText.Unsubscribed : NotificationText.Subscribed
    )
  );

  toggleIssue61(): void {
    this.issue61Shown = !this.issue61Shown;
  }

  toggleIssue97(): void {
    this.issue97Shown = !this.issue97Shown;
  }
}
