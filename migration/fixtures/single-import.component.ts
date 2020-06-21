import { of } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { OnDestroy } from '@angular/core';

@Component({ template: '' })
export class SingleImportComponent extends BaseComponent implements OnDestroy {
  create() {
    console.log('create');
  }

  public ngOnDestroy() {}
}
