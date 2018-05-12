import { Subject } from 'rxjs/Subject';
import { TakeUntilDestroy, untilDestroyed } from '../src/take-until-destroy';

const mockObserver = {
  next: jest.fn(),
  error: jest.fn(),
  complete: jest.fn()
}

const mockObserver2 = {
  next: jest.fn(),
  error: jest.fn(),
  complete: jest.fn()
}

describe('@TakeUntilDestroy', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should warn when not implement on destroy', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    @TakeUntilDestroy()
    class Test {

    }

    new Test()['ngOnDestroy']();
    expect(consoleSpy).toHaveBeenCalled();
  });


  it('should emit when calling on destroy', () => {
    @TakeUntilDestroy()
    class Test {
      destroyed$: Subject<boolean>;

      ngOnDestroy() {
      }
    }

    const component1: Test = new Test();

    component1.destroyed$.subscribe(mockObserver);
    component1.ngOnDestroy();
    expect(mockObserver.next).toHaveBeenCalledTimes(1);
    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
  });

  it('should not destroy other instances', () => {
    @TakeUntilDestroy()
    class Test {
      destroyed$: Subject<boolean>;

      ngOnDestroy() {
      }
    }

    const component1: Test = new Test();
    const component2: Test = new Test();

    component1.destroyed$.subscribe(mockObserver);
    component2.destroyed$.subscribe(mockObserver2);
    component1.ngOnDestroy();
    expect(mockObserver.next).toHaveBeenCalledTimes(1);
    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
    expect(mockObserver2.next).not.toHaveBeenCalledTimes(1);
    expect(mockObserver2.complete).not.toHaveBeenCalledTimes(1);
  });

  it('should work with classes that are not components', () => {
    @TakeUntilDestroy('destroy')
    class Test {
      destroyed$: Subject<boolean>;
      testProp = 'TakeUntilDestroy';

      destroy() {
        this.testProp = null;
      }
    }

    const instance: Test = new Test();

    instance.destroyed$.subscribe(mockObserver);
    expect(instance.testProp).toBe('TakeUntilDestroy');
    instance.destroy();
    expect(mockObserver.next).toHaveBeenCalledTimes(1);
    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
    expect(instance.testProp).toBe(null);
  });


  it('should work with super classes', () => {

    class Parent {
      prop;
      constructor(protected prop) {
         this.prop = prop;
      }
    }

    @TakeUntilDestroy('destroy')
    class Test extends  Parent{
      destroyed$: Subject<boolean>;
      testProp = 'TakeUntilDestroy';

      constructor() {
        super('prop');
      }

      destroy() {
        this.testProp = null;
        this.prop = null;
      }
    }

    const instance: Test = new Test();

    instance.destroyed$.subscribe(mockObserver);
    expect(instance.prop).toBe('prop');
    expect(instance.testProp).toBe('TakeUntilDestroy');
    instance.destroy();
    expect(mockObserver.next).toHaveBeenCalledTimes(1);
    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
    expect(instance.testProp).toBe(null);
    expect(instance.prop).toBe(null);
  });


});


describe('untilDestroyed operator', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should warn when class is not decorated', () => {
    const consoleSpy = jest.spyOn(console, 'warn');

    class Test {
      obs = new Subject();
      obs$ = this.obs.asObservable();
    };

    const instance = new Test();

    instance.obs$
      .pipe(untilDestroyed(instance))
      .subscribe();

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should unsubscribe when destroyed$', () => {
    @TakeUntilDestroy()
    class Test {
      obs = new Subject();
      obs$ = this.obs.asObservable();

      ngOnInit() {
        this.obs$
          .pipe(untilDestroyed(this))
          .subscribe(mockObserver);
      }

      ngOnDestroy() {}
    };

    const instance = new Test();
    instance.ngOnInit();
    instance.ngOnDestroy();

    expect(mockObserver.complete).toHaveBeenCalledTimes(1);
  });
});
