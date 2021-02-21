import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationClass, NotificationText } from '../enums/notification.enum';

@Component({
  selector: 'app-destroyable-provider',
  templateUrl: './destroyable-provider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestroyableProviderComponent {
  shown = true;

  providerStatus$ = new BehaviorSubject({
    subjectIsUnsubscribed: false,
    subscriptionIsUnsubscribed: false
  });

  providerStatusClass$ = this.providerStatus$.pipe(
    map(({ subjectIsUnsubscribed, subscriptionIsUnsubscribed }) => {
      if (subjectIsUnsubscribed && subscriptionIsUnsubscribed) {
        return NotificationClass.Success;
      } else {
        return NotificationClass.Danger;
      }
    })
  );

  providerStatusText$ = this.providerStatus$.pipe(
    map(({ subjectIsUnsubscribed, subscriptionIsUnsubscribed }) => {
      if (subjectIsUnsubscribed && subscriptionIsUnsubscribed) {
        return NotificationText.Unsubscribed;
      } else {
        return NotificationText.Subscribed;
      }
    })
  );

  toggle(): void {
    this.shown = !this.shown;
  }
}
