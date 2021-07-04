import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationClass, NotificationText } from '../enums/notification.enum';

import { Issue66Service } from './issue-66.service';

@Component({
  selector: 'app-multiple-custom-methods',
  templateUrl: './multiple-custom-methods.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleCustoMethodsComponent {
  issue66Status$ = new BehaviorSubject({
    firstStreamStarted: false,
    firstStreamStopped: false,
    secondStreamStarted: false,
    secondStreamStopped: false
  });

  firstStreamStatusClass$ = this.issue66Status$.pipe(
    map(({ firstStreamStarted, firstStreamStopped }) => {
      if (firstStreamStarted && firstStreamStopped === false) {
        return NotificationClass.Danger;
      } else if (firstStreamStarted === false && firstStreamStopped) {
        return NotificationClass.Success;
      } else {
        return null;
      }
    })
  );

  firstStreamStatusText$ = this.issue66Status$.pipe(
    map(({ firstStreamStarted, firstStreamStopped }) => {
      if (firstStreamStarted && firstStreamStopped === false) {
        return NotificationText.Subscribed;
      } else if (firstStreamStarted === false && firstStreamStopped) {
        return NotificationText.Unsubscribed;
      } else {
        return null;
      }
    })
  );

  secondStreamStatusClass$ = this.issue66Status$.pipe(
    map(({ secondStreamStarted, secondStreamStopped }) => {
      if (secondStreamStarted && secondStreamStopped === false) {
        return NotificationClass.Danger;
      } else if (secondStreamStarted === false && secondStreamStopped) {
        return NotificationClass.Success;
      } else {
        return null;
      }
    })
  );

  secondStreamStatusText$ = this.issue66Status$.pipe(
    map(({ secondStreamStarted, secondStreamStopped }) => {
      if (secondStreamStarted && secondStreamStopped === false) {
        return NotificationText.Subscribed;
      } else if (secondStreamStarted === false && secondStreamStopped) {
        return NotificationText.Unsubscribed;
      } else {
        return null;
      }
    })
  );

  constructor(private issue66Service: Issue66Service) {
    issue66Service.setHost(this);
  }

  startFirst(): void {
    this.issue66Service.startFirst();
  }

  stopFirst(): void {
    this.issue66Service.stopFirst();
  }

  startSecond(): void {
    this.issue66Service.startSecond();
  }

  stopSecond(): void {
    this.issue66Service.stopSecond();
  }
}
