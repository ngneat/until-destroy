import {
  ɵComponentDef as ComponentDef,
  ɵɵdefineComponent as defineComponent
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { UntilDestroy, untilDestroyed } from '..';

function createObserver() {
  return {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn()
  };
}

describe('untilDestroyed operator with non-directive/component classes', () => {
  it('should not destroy other instances', () => {
    const spy = createObserver();
    const spy2 = createObserver();

    class Test {
      subscription!: Subscription;

      destroy() {}

      subscribe(spy: ReturnType<typeof createObserver>) {
        this.subscription = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy);
      }
    }

    const component1 = new Test();
    const component2 = new Test();
    component1.subscribe(spy);
    component2.subscribe(spy2);
    component1.destroy();
    expect(spy.complete).toHaveBeenCalledTimes(1);
    expect(spy2.complete).not.toHaveBeenCalled();
    component2.destroy();
    expect(spy2.complete).toHaveBeenCalledTimes(1);
  });

  it('should work with multiple observables', () => {
    const spy = createObserver();
    const spy2 = createObserver();
    const spy3 = createObserver();

    class Test {
      obs = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy);
      obs2 = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy2);
      obs3 = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy3);

      destroy() {}
    }

    const instance = new Test();
    instance.destroy();
    expect(spy.complete).toHaveBeenCalledTimes(1);
    expect(spy2.complete).toHaveBeenCalledTimes(1);
    expect(spy3.complete).toHaveBeenCalledTimes(1);
  });

  describe('it should work anywhere', () => {
    const spy = createObserver();
    const spy2 = createObserver();
    const spy3 = createObserver();

    class LoginComponent {
      dummy = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy);

      constructor() {
        new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy2);
      }

      ngOnInit() {
        new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy3);
      }

      destroy() {}
    }

    it('should unsubscribe', () => {
      const instance = new LoginComponent();
      instance.ngOnInit();
      instance.destroy();
      expect(spy.complete).toHaveBeenCalledTimes(1);
      expect(spy2.complete).toHaveBeenCalledTimes(1);
      expect(spy3.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('it should throw on non-directive/component classes', () => {
    it('should throw when destroy method doesnt exist', () => {
      const spy = createObserver();

      class Test {
        dummy = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy);
      }

      expect(() => {
        new Test();
      }).toThrow(`Test is using untilDestroyed but doesn't implement destroy`);
    });

    it('should work with super', () => {
      const spy = createObserver();

      class A {
        destroy() {}
      }

      class B extends A {
        dummy = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy);
      }

      expect(() => {
        new B();
      }).not.toThrow(`B is using untilDestroyed but doesn't implement destroy`);
    });
  });

  describe('inheritance', () => {
    it('should work with subclass', () => {
      const spy = createObserver();

      class Parent {
        destroy() {}
      }

      class Child extends Parent {
        constructor() {
          super();
        }
        obs = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy);
      }

      const instance = new Child();
      instance.destroy();
      expect(spy.complete).toHaveBeenCalledTimes(1);
    });
  });
});

describe('UntilDestroy decorator and untilDestroyed operator', () => {
  it('operator should unsubscribe on component destroy', () => {
    const spy = createObserver();

    @UntilDestroy()
    class TestComponent {
      static ngFactoryDef = () => new TestComponent();

      static ngComponentDef: ComponentDef<TestComponent> = defineComponent({
        vars: 0,
        consts: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      });

      constructor() {
        new Subject().pipe(untilDestroyed(this)).subscribe(spy);
      }
    }

    const component = TestComponent.ngFactoryDef();
    TestComponent.ngComponentDef.onDestroy!.call(component);

    expect(spy.complete).toHaveBeenCalledTimes(1);
  });
});
