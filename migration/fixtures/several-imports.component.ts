import { of } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { OnDestroy, OnChanges, Component } from '@angular/core';

@Component({ template: '' })
export class SeveralImportsComponent extends BaseComponent implements OnDestroy, OnChanges {
  ngOnChanges() {
    console.log('OnChanges');
  }

  ngOnDestroy() {}
}
