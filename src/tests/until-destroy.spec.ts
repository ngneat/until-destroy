import {
  ɵComponentDef as ComponentDef,
  ɵɵdefineComponent as defineComponent
} from '@angular/core';
import { interval, Subject } from 'rxjs';

import { UntilDestroy } from '..';

describe('UntilDestroy decorator alone', () => {
  it('should unsubscribe from the subscription property', () => {
    @UntilDestroy()
    class TestComponent {
      static ngComponentDef: ComponentDef<TestComponent> = defineComponent({
        vars: 0,
        consts: 0,
        type: TestComponent,
        selectors: [[]],
        factory: () => new TestComponent(),
        template: () => {}
      });

      subscription = interval(1000).subscribe();
    }

    const component = TestComponent.ngComponentDef.factory();

    expect(component.subscription.closed).toBeFalsy();

    TestComponent.ngComponentDef.onDestroy!.call(component);

    expect(component.subscription.closed).toBeTruthy();
  });

  it('should not unsubscribe from the blacklisted subscription', () => {
    @UntilDestroy({ blackList: ['subjectSubscription'] })
    class TestComponent {
      static ngComponentDef: ComponentDef<TestComponent> = defineComponent({
        vars: 0,
        consts: 0,
        type: TestComponent,
        selectors: [[]],
        factory: () => new TestComponent(),
        template: () => {}
      });

      intervalSubscription = interval(1000).subscribe();
      subjectSubscription = new Subject().subscribe();
    }

    const component = TestComponent.ngComponentDef.factory();

    expect(component.intervalSubscription.closed).toBeFalsy();
    expect(component.subjectSubscription.closed).toBeFalsy();

    TestComponent.ngComponentDef.onDestroy!.call(component);

    expect(component.intervalSubscription.closed).toBeTruthy();
    expect(component.subjectSubscription.closed).toBeFalsy();

    component.subjectSubscription.unsubscribe();
  });

  it('should unsubscribe from the array of subscriptions', () => {
    @UntilDestroy({ arrayName: 'subscriptions' })
    class TestComponent {
      static ngComponentDef: ComponentDef<TestComponent> = defineComponent({
        vars: 0,
        consts: 0,
        type: TestComponent,
        selectors: [[]],
        factory: () => new TestComponent(),
        template: () => {}
      });

      subscriptions = [interval(1000).subscribe(), new Subject().subscribe()];
    }

    const component = TestComponent.ngComponentDef.factory();

    component.subscriptions.forEach(subscription => {
      expect(subscription.closed).toBeFalsy();
    });

    TestComponent.ngComponentDef.onDestroy!.call(component);

    component.subscriptions.forEach(subscription => {
      expect(subscription.closed).toBeTruthy();
    });
  });
});
