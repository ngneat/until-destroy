import { Component, Injectable } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IssueSixtySixService {
  start(): void {
    interval(1000)
      .pipe(
        untilDestroyed(this, 'stop'),
        finalize(() => console.log('IssueSixtySixService interval stream has completed'))
      )
      .subscribe(value => console.log(`IssueSixtySixService has emitted value ${value}`));
  }

  stop(): void {}
}

@Component({
  selector: 'app-issue-sixty-six',
  templateUrl: './issue-sixty-six.component.html'
})
export class IssueSixtySixComponent {
  constructor(private issueSixtySixService: IssueSixtySixService) {}

  start(): void {
    this.issueSixtySixService.start();
  }

  stop(): void {
    this.issueSixtySixService.stop();
  }
}
