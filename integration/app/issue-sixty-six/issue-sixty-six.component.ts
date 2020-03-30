import { Component, Injectable } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IssueSixtySixService {
  startFirst(): void {
    interval(1000)
      .pipe(
        untilDestroyed(this, 'stopFirst'),
        finalize(() =>
          console.log(
            'IssueSixtySixService.startFirst() interval stream has been unsubscribed'
          )
        )
      )
      .subscribe(value =>
        console.log(`IssueSixtySixService.startFirst() has emitted value ${value}`)
      );
  }

  stopFirst(): void {}

  startSecond(): void {
    interval(1000)
      .pipe(
        untilDestroyed(this, 'stopSecond'),
        finalize(() =>
          console.log(
            'IssueSixtySixService.startSecond() interval stream has been unsubscribed'
          )
        )
      )
      .subscribe(value =>
        console.log(`IssueSixtySixService.startSecond() has emitted value ${value}`)
      );
  }

  stopSecond(): void {}
}

@Component({
  selector: 'app-issue-sixty-six',
  templateUrl: './issue-sixty-six.component.html'
})
export class IssueSixtySixComponent {
  constructor(private issueSixtySixService: IssueSixtySixService) {}

  startFirst(): void {
    this.issueSixtySixService.startFirst();
  }

  stopFirst(): void {
    this.issueSixtySixService.stopFirst();
  }

  startSecond(): void {
    this.issueSixtySixService.startSecond();
  }

  stopSecond(): void {
    this.issueSixtySixService.stopSecond();
  }
}
