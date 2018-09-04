import { Subject } from 'rxjs';

import { untilDestroyed, TakeUntilDestroy } from '../src/take-until-destroy';

const mockObserver = {
  next: jest.fn(),
  error: jest.fn(),
  complete: jest.fn()
};

const mockObserver2 = {
  next: jest.fn(),
  error: jest.fn(),
  complete: jest.fn()
};

describe('@TakeUntilDestroy', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should emit when calling on destroy', () => {
    @TakeUntilDestroy()
    class Test {
      obs = new Subject();
      obs$ = this.obs.asObservable();
      ngOnDestroy() {
      }
    }

    const component1: Test = new Test();
    component1.obs$.pipe(untilDestroyed(component1)).subscribe();
    component1['__takeUntilDestroy'].subscribe(mockObserver);
    component1.ngOnDestroy();
    expect(mockObserver.next).toHaveBeenCalledTimes(1);
    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
  });

  it('should not destroy other instances', () => {
    class Test {
      obs = new Subject();
      obs$ = this.obs.asObservable();
      ngOnDestroy() {}
    }

    const component1: Test = new Test();
    const component2: Test = new Test();
    component1.obs$.pipe(untilDestroyed(component1)).subscribe();
    component1['__takeUntilDestroy'].subscribe(mockObserver);
    component2.obs$.pipe(untilDestroyed(component2)).subscribe();
    component2['__takeUntilDestroy'].subscribe(mockObserver2);
    component1.ngOnDestroy();
    expect(mockObserver.next).toHaveBeenCalledTimes(1);
    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
    expect(mockObserver2.next).not.toHaveBeenCalledTimes(1);
    expect(mockObserver2.complete).not.toHaveBeenCalledTimes(1);
  });

  it('should work with multiple observables', () => {
    class Test {
      obs = new Subject();
      obs$ = this.obs.asObservable();
      obs2 = new Subject();
      obs2$ = this.obs.asObservable();
      ngOnDestroy() {}
    }

    const component1: Test = new Test();
    const complete = jest.fn();
    const complete2 = jest.fn();
    component1.obs$.pipe(untilDestroyed(component1)).subscribe(null, null, complete);
    component1.obs2$.pipe(untilDestroyed(component1)).subscribe(null, null, complete2);
    component1.ngOnDestroy();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('should work with classes that are not components', () => {
    class Test {
      testProp = 'TakeUntilDestroy';
      obs = new Subject();
      obs$ = this.obs.asObservable();
      destroy() {
        this.testProp = null;
      }
    }

    const instance: Test = new Test();

    instance.obs$.pipe(untilDestroyed(instance, 'destroy')).subscribe();
    instance['__takeUntilDestroy'].subscribe(mockObserver);
    expect(instance.testProp).toBe('TakeUntilDestroy');
    instance.destroy();
    expect(mockObserver.next).toHaveBeenCalledTimes(1);
    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
    expect(instance.testProp).toBe(null);
  });


describe('untilDestroyed operator', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should unsubscribe when destroyed$', () => {

    class Test {
      obs = new Subject();
      obs$ = this.obs.asObservable();

      ngOnInit() {
        this.obs$.pipe(untilDestroyed(this)).subscribe(mockObserver);
      }

      ngOnDestroy() {}
    }

    const instance = new Test();
    instance.ngOnInit();
    instance.ngOnDestroy();

    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
  });
});
