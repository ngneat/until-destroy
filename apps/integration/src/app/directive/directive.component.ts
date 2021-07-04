import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationClass, NotificationText } from '../enums/notification.enum';

@Component({
  selector: 'app-directive',
  templateUrl: './directive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectiveComponent {
  shown = true;

  directiveUnsubscribed$ = new BehaviorSubject<boolean>(false);

  directiveUnsubscribedClass$ = this.directiveUnsubscribed$.pipe(
    map(directiveUnsubscribed =>
      directiveUnsubscribed ? NotificationClass.Success : NotificationClass.Danger
    )
  );

  directiveUnsubscribedText$ = this.directiveUnsubscribed$.pipe(
    map(directiveUnsubscribed =>
      directiveUnsubscribed ? NotificationText.Unsubscribed : NotificationText.Subscribed
    )
  );

  toggle(): void {
    this.shown = !this.shown;
  }
}
