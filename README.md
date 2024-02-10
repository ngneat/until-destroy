# 🦁 Unsubscribe For Pros

> A neat way to unsubscribe from observables when the component destroyed

[![@ngneat/until-destroy](https://github.com/ngneat/until-destroy/workflows/@ngneat/until-destroy/badge.svg)](https://github.com/ngneat/until-destroy/actions/workflows/until-destroy.yml)
[![npm](https://img.shields.io/npm/dm/@ngneat/until-destroy?style=plastic)](https://www.npmjs.com/package/@ngneat/until-destroy)

## Sponsoring ngneat

[Sponsorships](https://github.com/sponsors/ngneat) aid in the continued development and maintenance of ngneat libraries. Consider asking your company to sponsor ngneat as its core to their business and application development.

### Gold Sponsors

Elevate your support by becoming a Gold Sponsor and have your logo prominently featured on our README in the top 5 repositories.

### Silver Sponsors

Boost your backing by becoming a Gold Sponsor and enjoy the spotlight with your logo prominently showcased in the top 3 repositories on our README.

### Bronze Sponsors

<a href="https://houseofangular.io" target="_blank">
  <img src="https://github.com/ngrx/platform/blob/main/projects/ngrx.io/src/assets/images/sponsors/house-of-angular.png" width="50px" height="50px" alt="House of Angular" />
</a>

Become a bronze sponsor and get your logo on our README on GitHub.

## Compatibility with Angular Versions

<table>
  <thead>
    <tr>
      <th>@ngneat/until-destroy</th>
      <th>Angular</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        8.x
      </td>
      <td>
        >= 10.0.5 < 13
      </td>
    </tr>
    <tr>
      <td>
        9.x
      </td>
      <td>
        >= 13
      </td>
    </tr>
  </tbody>
</table>

## Table of contents

- [Use with Ivy](#use-with-ivy)
  - [Use with Non-Singleton Services](#use-with-non-singleton-services)
- [Use with View Engine (Pre Ivy)](#use-with-view-engine-pre-ivy)
  - [Use with Any Class](#use-with-any-class)
- [Migration from View Engine to Ivy](#migration-from-view-engine-to-ivy)
- [Potential Pitfalls](#potential-pitfalls)
- [Contributors](#contributors-✨)

## Use with Ivy

```bash
npm install @ngneat/until-destroy
# Or if you use yarn
yarn add @ngneat/until-destroy
```

```ts
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({})
export class InboxComponent {
  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }
}
```

You can set the `checkProperties` option to `true` if you want to unsubscribe from subscriptions properties automatically:

```ts
@UntilDestroy({ checkProperties: true })
@Component({})
export class HomeComponent {
  // We'll dispose it on destroy
  subscription = fromEvent(document, 'mousemove').subscribe();
}
```

You can set the `arrayName` property if you want to unsubscribe from each subscription in the specified array.

```ts
@UntilDestroy({ arrayName: 'subscriptions' })
@Component({})
export class HomeComponent {
  subscriptions = [
    fromEvent(document, 'click').subscribe(),
    fromEvent(document, 'mousemove').subscribe(),
  ];

  // You can still use the operator
  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this));
  }
}
```

You can set the `blackList` property if you **don't** want to unsubscribe from one or more subscriptions.

```ts
@UntilDestroy({ checkProperties: true, blackList: ['subscription1'] })
@Component({})
export class HomeComponent {
  // subscription1 will not be unsubscribed upon component destruction
  subscription1: Subscription;
  // subscription2 will be unsubscribed upon component destruction
  subscription2: Subscription;

  constructor() {
    this.subscription1 = new Subject().subscribe();
    this.subscription2 = new Subject().subscribe();
  }
}
```

### Use with Non-Singleton Services

```ts
@UntilDestroy()
@Injectable()
export class InboxService {
  constructor() {
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }
}

@Component({
  providers: [InboxService],
})
export class InboxComponent {
  constructor(inboxService: InboxService) {}
}
```

All options, described above, are also applicable to providers.

## Use with View Engine (Pre Ivy)

```bash
npm install ngx-take-until-destroy
# Or if you use yarn
yarn add ngx-take-until-destroy
```

```ts
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({})
export class InboxComponent implements OnDestroy {
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

### Use with Any Class

```ts
import { untilDestroyed } from 'ngx-take-until-destroy';

export class Widget {
  constructor() {
    interval(1000).pipe(untilDestroyed(this, 'destroy')).subscribe(console.log);
  }

  // The name needs to be the same as the second parameter
  destroy() {}
}
```

## Migration from View Engine to Ivy

To make it easier for you to migrate, we've built a script that will update the imports path and add the decorator for you. The script is shipped as a separate package. Run the following command to install it:

```sh
npm i --save-dev @ngneat/until-destroy-migration
# Or if you use yarn
yarn add -D @ngneat/until-destroy-migration
```

Then run the following command:

```shell script
npx @ngneat/until-destroy-migration --base my/path
```

`base` defaults to `./src/app`.

You can use the `--removeOnDestroy` flag for empty `OnDestroy` methods removing.

```shell script
npx @ngneat/until-destroy-migration --removeOnDestroy
```

You can remove the package once the migration is done.

## Potential Pitfalls

- The order of decorators is important, make sure to put `@UntilDestroy()` before the `@Component()` decorator.
- When using [`overrideComponent`](https://angular.io/api/core/testing/TestBed#overrideComponent) in unit tests remember that it overrides metadata and component definition. Invoke `UntilDestroy()(YourComponent);` to reapply the decorator. See [here](https://github.com/ngneat/until-destroy/issues/91#issuecomment-626470446) for an example.

## ESLint Rules

- [prefer-takeuntil](https://github.com/cartant/eslint-plugin-rxjs-angular/blob/main/docs/rules/prefer-takeuntil.md#options)
- [no-unsafe-takeuntil](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-takeuntil.md#options)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/ngneat/until-destroy/commits?author=NetanelBasal" title="Code">💻</a> <a href="https://github.com/ngneat/until-destroy/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://medium.com/@overthesanity"><img src="https://avatars1.githubusercontent.com/u/7337691?v=4" width="100px;" alt=""/><br /><sub><b>Artur Androsovych</b></sub></a><br /><a href="https://github.com/ngneat/until-destroy/commits?author=arturovt" title="Code">💻</a> <a href="#example-arturovt" title="Examples">💡</a> <a href="#ideas-arturovt" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-arturovt" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/KrzysztofKarol"><img src="https://avatars3.githubusercontent.com/u/12470911?v=4" width="100px;" alt=""/><br /><sub><b>Krzysztof Karol</b></sub></a><br /><a href="#content-KrzysztofKarol" title="Content">🖋</a></td>
    <td align="center"><a href="https://github.com/gund"><img src="https://avatars0.githubusercontent.com/u/3644678?v=4" width="100px;" alt=""/><br /><sub><b>Alex Malkevich</b></sub></a><br /><a href="https://github.com/ngneat/until-destroy/commits?author=gund" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/webdevius"><img src="https://avatars0.githubusercontent.com/u/2960769?v=4" width="100px;" alt=""/><br /><sub><b>Khaled Shaaban</b></sub></a><br /><a href="https://github.com/ngneat/until-destroy/commits?author=webdevius" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kmathy"><img src="https://avatars3.githubusercontent.com/u/15690980?v=4" width="100px;" alt=""/><br /><sub><b>kmathy</b></sub></a><br /><a href="https://github.com/ngneat/until-destroy/commits?author=kmathy" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/FFKL"><img src="https://avatars1.githubusercontent.com/u/11336491?v=4" width="100px;" alt=""/><br /><sub><b>Dmitrii Korostelev</b></sub></a><br /><a href="https://github.com/ngneat/until-destroy/commits?author=FFKL" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
