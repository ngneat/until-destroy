import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationClass, NotificationText } from '../enums/notification.enum';

@Component({
  selector: 'app-pipe',
  templateUrl: './pipe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipeComponent {
  shown = true;

  pipeUnsubscribed$ = new BehaviorSubject<boolean>(false);

  pipeUnsubscribedClass$ = this.pipeUnsubscribed$.pipe(
    map(pipeUnsubscribed =>
      pipeUnsubscribed ? NotificationClass.Success : NotificationClass.Danger
    )
  );

  pipeUnsubscribedText$ = this.pipeUnsubscribed$.pipe(
    map(pipeUnsubscribed =>
      pipeUnsubscribed ? NotificationText.Unsubscribed : NotificationText.Subscribed
    )
  );

  toggle(): void {
    this.shown = !this.shown;
  }
}
