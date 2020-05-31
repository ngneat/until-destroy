import { Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Pipe({ name: 'i18n', pure: false })
export class I18nPipe implements PipeTransform {
  constructor() {
    new Subject()
      .pipe(
        untilDestroyed(this),
        finalize(() => console.log('I18nPipe subject has been unsubscribed'))
      )
      .subscribe();
  }

  transform(): string {
    return 'I have been piped';
  }
}
