import {
  ɵComponentDef as ComponentDef,
  ɵɵdefineComponent as defineComponent
} from '@angular/core';
import { interval, Subject } from 'rxjs';

import { UntilDestroy } from '..';
import { callNgOnDestroy } from './utils';

describe('UntilDestroy decorator alone', () => {
  it('should unsubscribe from the subscription property', () => {
    // Arrange
    @UntilDestroy({ checkProperties: true })
    class TestComponent {
      static ɵcmp = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      }) as ComponentDef<TestComponent>;

      subscription = interval(1000).subscribe();

      static ɵfac = () => new TestComponent();
    }

    // Act & assert
    const component = TestComponent.ɵfac();

    expect(component.subscription.closed).toBeFalsy();
    callNgOnDestroy(component);
    expect(component.subscription.closed).toBeTruthy();
  });

  it('should not unsubscribe from the blacklisted subscription', () => {
    // Arrange
    @UntilDestroy({ blackList: ['subjectSubscription'], checkProperties: true })
    class TestComponent {
      static ɵcmp = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      }) as ComponentDef<TestComponent>;

      intervalSubscription = interval(1000).subscribe();
      subjectSubscription = new Subject().subscribe();

      static ɵfac = () => new TestComponent();
    }

    // Act & assert
    const component = TestComponent.ɵfac();

    expect(component.intervalSubscription.closed).toBeFalsy();
    expect(component.subjectSubscription.closed).toBeFalsy();

    callNgOnDestroy(component);

    expect(component.intervalSubscription.closed).toBeTruthy();
    expect(component.subjectSubscription.closed).toBeFalsy();

    component.subjectSubscription.unsubscribe();
  });

  it('should unsubscribe from the array of subscriptions', () => {
    // Arrange
    @UntilDestroy({ arrayName: 'subscriptions' })
    class TestComponent {
      static ɵcmp = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      }) as ComponentDef<TestComponent>;

      subscriptions = [interval(1000).subscribe(), new Subject().subscribe()];

      static ɵfac = () => new TestComponent();
    }

    // Act & assert
    const component = TestComponent.ɵfac();

    component.subscriptions.forEach(subscription => {
      expect(subscription.closed).toBeFalsy();
    });

    callNgOnDestroy(component);

    component.subscriptions.forEach(subscription => {
      expect(subscription.closed).toBeTruthy();
    });
  });
});
