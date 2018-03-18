[![npm](https://img.shields.io/npm/dt/ngx-take-until-destroy.svg)]()
[![Build Status](https://semaphoreci.com/api/v1/netanel7799/ngx-take-until-destroy/branches/master/badge.svg)](https://semaphoreci.com/netanel7799/ngx-take-until-destroy)
[![npm](https://img.shields.io/npm/l/ngx-take-until-destroy.svg)]()
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)
# 🤓 Angular - Unsubscribe For Pros 💪

##### Declarative way to unsubscribe from observables when the component destroyed

## Installation
`npm install ngx-take-until-destroy --save`

## Usage

### Rxjs 5.5+ (pipeable operators)
```ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { interval } from 'rxjs/Observable/interval';

@TakeUntilDestroy()
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html'
})
export class InboxComponent implements OnInit, OnDestroy {
  ngOnInit( ) {
    interval(1000)
      .pipe(untilDestroyed(this))
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

### Pre rxjs@5.5 (or if you're still patching the observable prototype)
```ts
import { Component, OnInit } from '@angular/core';
import { TakeUntilDestroy, OnDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operators/takeUntil';

@TakeUntilDestroy()
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html'
})
export class InboxComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  ngOnInit( ) {
    Observable.interval(1000)
      .takeUntil(this.destroyed$)
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

### Use with any class

#### Rxjs 5.5+ (pipeable operators)
```ts
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { interval } from 'rxjs/Observable/interval';

@TakeUntilDestroy('destroy')
export class Widget {
  constructor( ) {
    interval(1000)
      .pipe(untilDestroyed(this))
      .subscribe(console.log)
  }

  // The name needs to be the same as the decorator parameter
  destroy() {
  }

}
```

#### Before rxjs@5.5 (or if you're still patching the observable prototype)
```ts
import { TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operators/takeUntil';

@TakeUntilDestroy('destroy')
export class Widget {
  readonly destroyed$: Observable<boolean>;

  constructor( ) {
    Observable.interval(1000)
      .takeUntil(this.destroyed$)
      .subscribe(console.log)
  }

  // The name needs to be the same as the decorator parameter
  destroy() {
  }

}
```

