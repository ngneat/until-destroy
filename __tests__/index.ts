import { Subject } from 'rxjs';
import { untilDestroyed } from '../src/take-until-destroy';

function createObserver() {
  return {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn()
  };
}

describe('untilDestroyed', () => {
  it('should not destroy other instances', () => {
    const spy = createObserver();
    const spy2 = createObserver();

    class Test {
      obs;
      ngOnDestroy() {}
      subscribe(spy) {
        this.obs = new Subject().pipe(untilDestroyed(this)).subscribe(spy);
      }
    }

    const component1 = new Test();
    const component2 = new Test();
    component1.subscribe(spy);
    component2.subscribe(spy2);
    component1.ngOnDestroy();
    expect(spy.complete).toHaveBeenCalledTimes(1);
    expect(spy2.complete).not.toHaveBeenCalled();
    component2.ngOnDestroy();
    expect(spy2.complete).toHaveBeenCalledTimes(1);
  });

  it('should work with multiple observables', () => {
    const spy = createObserver();
    const spy2 = createObserver();
    const spy3 = createObserver();
    class Test {
      obs = new Subject().pipe(untilDestroyed(this)).subscribe(spy);
      obs2 = new Subject().pipe(untilDestroyed(this)).subscribe(spy2);
      obs3 = new Subject().pipe(untilDestroyed(this)).subscribe(spy3);
      ngOnDestroy() {}
    }

    const instance = new Test();
    instance.ngOnDestroy();
    expect(spy.complete).toHaveBeenCalledTimes(1);
    expect(spy2.complete).toHaveBeenCalledTimes(1);
    expect(spy3.complete).toHaveBeenCalledTimes(1);
  });

  it('should work with classes that are not components', () => {
    const spy = createObserver();
    class Test {
      obs = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy);
      destroy() {
        console.log('called');
      }
    }
    const instance = new Test();
    instance.destroy();
    expect(spy.complete).toHaveBeenCalledTimes(1);
  });
});

describe('it should work anywhere', () => {
  const spy = createObserver();
  const spy2 = createObserver();
  const spy3 = createObserver();
  class LoginComponent {
    dummy = new Subject().pipe(untilDestroyed(this)).subscribe(spy);

    constructor() {
      new Subject().pipe(untilDestroyed(this)).subscribe(spy2);
    }

    ngOnInit() {
      new Subject().pipe(untilDestroyed(this)).subscribe(spy3);
    }

    ngOnDestroy() {}
  }

  it('should unsubscribe', () => {
    const instance = new LoginComponent();
    instance.ngOnInit();
    instance.ngOnDestroy();
    expect(spy.complete).toHaveBeenCalledTimes(1);
    expect(spy2.complete).toHaveBeenCalledTimes(1);
    expect(spy3.complete).toHaveBeenCalledTimes(1);
  });
});

describe('it should throw', () => {
  const spy = createObserver();

  class LoginComponent {
    dummy = new Subject().pipe(untilDestroyed(this)).subscribe(spy);
  }

  it('should throw when destroy method doesnt exist', () => {
    expect(function() {
      new LoginComponent();
    }).toThrow(
      `LoginComponent is using untilDestroyed but doesn't implement ngOnDestroy`
    );
  });

  it.only('should work with super', () => {
    class A {
      ngOnDestroy() {}
    }

    class B extends A {
      dummy = new Subject().pipe(untilDestroyed(this)).subscribe(spy);
    }

    expect(function() {
      new B();
    }).not.toThrow(
      `B is using untilDestroyed but doesn't implement ngOnDestroy`
    );
  });
});
