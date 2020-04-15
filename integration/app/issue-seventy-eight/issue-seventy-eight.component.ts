import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { of } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-issue-seventy-eight',
  template: `
    {{ number$ | async }}
  `
})
export class IssueSeventyEightComponent {
  number$ = of(100);
}
