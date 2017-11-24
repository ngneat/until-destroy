[![Build Status](https://semaphoreci.com/api/v1/netanel7799/ngx-take-until-destroy/branches/master/badge.svg)](https://semaphoreci.com/netanel7799/ngx-take-until-destroy)
[![npm](https://img.shields.io/npm/l/ngx-take-until-destroy.svg)]()
# Angular - Unsubscribe For Pros

##### Declarative way to unsubscribe from observables when the component destroyed

## Installation
`npm install ngx-take-until-destroy --save`

## Usage
```ts
import { TakeUntilDestroy } from "ngx-take-until-destroy";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html'
})
@TakeUntilDestroy
export class InboxComponent implements OnDestroy {
  componentDestroyed$: Subject<boolean>;

  ngOnInit( ) {
    Observable.interval(1000)
      .takeUntil(this.componentDestroyed$)
      .subscribe(val => console.log(val))
  }

  // If you work with AOT this method must be present, even if empty! 
  // Otherwise 'ng build --prod' will optimize away any calls to ngOnDestroy, 
  // even if the method is added by the @TakeUntilDestroy decorator
  ngOnDestroy() {
    // You can also do whatever you need here
  }

}
```

