[![npm](https://img.shields.io/npm/dt/ngx-take-until-destroy.svg)]()
[![Build Status](https://semaphoreci.com/api/v1/netanel7799/ngx-take-until-destroy/branches/master/badge.svg)](https://semaphoreci.com/netanel7799/ngx-take-until-destroy)
[![npm](https://img.shields.io/npm/l/ngx-take-until-destroy.svg)]()
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)

# 🤓 Angular - Unsubscribe For Pros 💪

##### Declarative way to unsubscribe from observables when the component destroyed

## Installation

`npm install ngx-take-until-destroy --save`

## Usage

```ts
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
})
export class InboxComponent implements OnInit, OnDestroy {
  ngOnInit() {
    interval(1000)
      .pipe(untilDestroyed(this))
      .subscribe(val => console.log(val));
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
```


### Use with any class

```ts
import { untilDestroyed } from 'ngx-take-until-destroy';

export class Widget {
  constructor() {
    interval(1000)
      .pipe(untilDestroyed(this, 'destroy'))
      .subscribe(console.log);
  }

  // The name needs to be the same as the second parameter
  destroy() {}
}
```

[Live example](https://stackblitz.com/edit/ngx-take-until-demo)

### Usage with Ivy renderer

#### `untilDestroyed` operator

Given the following code:

```ts
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
})
export class InboxComponent implements OnInit {
  ngOnInit() {
    interval(1000)
      .pipe(untilDestroyed(this))
      .subscribe(val => console.log(val));
  }
}
```

You don't have to declare the `ngOnDestroy` method anymore if `enableIvy` compiler option is truthy. But you still have to declare custom methods when `untilDestroyed` is used with non-directive/component classes.

#### `UntilDestroy` decorator

`ngx-take-until-destroy` exposes the `UntilDestroy` decorator that provides the ability to store subscriptions in class properties. Let's look at the example below:

```ts
import { UntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';

// NOTE: `UntilDestroy` decorator has to be before `Component` in JIT mode!
@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html'
})
export class InboxComponent {
  subscription = interval(1000)
    .pipe(untilDestroyed(this))
    .subscribe(val => console.log(val));
}
```

`subscription` will be unsubscribed automatically when the component gets destroyed. We can also store subscriptions in array:

```ts
import { UntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs';

@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html'
})
export class InboxComponent {
  subscriptions: Subscription[] = [];

  constructor() {
    const subscription = interval(1000)
      .pipe(untilDestroyed(this))
      .subscribe(val => console.log(val));

    this.subscriptions.push(subscription);
  }
}
```
