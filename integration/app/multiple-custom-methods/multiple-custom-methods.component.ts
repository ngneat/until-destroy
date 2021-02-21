import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
