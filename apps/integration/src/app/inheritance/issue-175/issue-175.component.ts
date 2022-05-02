import { Directive, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive()
export abstract class Issue175Directive {}

@Component({
  selector: 'app-issue-175',
  template: '',
})
export class Issue175Component extends Issue175Directive implements OnDestroy {
  constructor() {
    super();

    new Subject().pipe(untilDestroyed(this)).subscribe();
  }

  ngOnDestroy(): void {}
}
