import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-inheritance',
  templateUrl: './inheritance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InheritanceComponent {
  issue61Shown = true;
  issue97Shown = true;

  issue61Status$ = new BehaviorSubject({
    directiveUnsubscribed: false,
    componentUnsubscribed: false
  });

  issue97Status$ = new BehaviorSubject({
    componentUnsubscribed: false
  });

  toggleIssue61(): void {
    this.issue61Shown = !this.issue61Shown;
  }

  toggleIssue97(): void {
    this.issue97Shown = !this.issue97Shown;
  }
}
