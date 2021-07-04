import { untilDestroyed } from 'ngx-take-until-destroy';
import { OnDestroy } from '@angular/core';

export class FilledOnDestroyService implements OnDestroy {
  ngOnDestroy() {
    throw new Error('Method not implemented.');
  }
}
