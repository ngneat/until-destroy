import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  toggle(): void {
    this.shown = !this.shown;
  }
}
