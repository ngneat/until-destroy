import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-array-of-subscriptions',
  templateUrl: './array-of-subscriptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayOfSubscriptionsComponent {
  shown = true;

  documentClickSubscriptionIsUnsubscribed$ = new BehaviorSubject<boolean>(false);

  toggle(): void {
    this.shown = !this.shown;
  }
}
