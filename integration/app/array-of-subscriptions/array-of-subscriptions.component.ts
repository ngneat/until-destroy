import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationClass, NotificationText } from '../enums/notification.enum';

@Component({
  selector: 'app-array-of-subscriptions',
  templateUrl: './array-of-subscriptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayOfSubscriptionsComponent {
  shown = true;

  documentClickUnsubscribed$ = new BehaviorSubject<boolean>(false);

  documentClickUnsubscribedClass$ = this.documentClickUnsubscribed$.pipe(
    map(documentClickUnsubscribed =>
      documentClickUnsubscribed ? NotificationClass.Success : NotificationClass.Danger
    )
  );

  documentClickUnsubscribedText$ = this.documentClickUnsubscribed$.pipe(
    map(documentClickUnsubscribed =>
      documentClickUnsubscribed ? NotificationText.Unsubscribed : NotificationText.Subscribed
    )
  );

  toggle(): void {
    this.shown = !this.shown;
  }
}
