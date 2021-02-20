import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-directive',
  templateUrl: './directive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectiveComponent {
  shown = true;

  httpDirectiveStatus$ = new BehaviorSubject({
    subscriptionIsUnsubscribed: false
  });

  toggle(): void {
    this.shown = !this.shown;
  }
}
