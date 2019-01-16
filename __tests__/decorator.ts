import { EMPTY, Observable, Subject } from 'rxjs';

import { WithUntilDestroyed } from '../src/decorator';
import * as untilDestroyedObj from '../src/take-until-destroy';

describe('@WithUntilDestroyed decorator', () => {
  it('should throw when applied on non Observable prop', () => {
    class Test {
      @WithUntilDestroyed()
      notObservable = true;
    }

    expect(() => new Test()).toThrowError();
  });

  it('should call `untilDestroyed()` with instance and `destroyMethodName` on setter', () => {
    const untilDestroyedSpy = spyOn(
      untilDestroyedObj,
      'untilDestroyed',
    ).and.callThrough();

    class Test {
      @WithUntilDestroyed('destroy')
      stream$ = EMPTY;

      destroy() {}
    }

    expect(untilDestroyedSpy).not.toHaveBeenCalled();

    const test = new Test();

    expect(untilDestroyedSpy).toHaveBeenCalledWith(test, 'destroy');
  });

  it('should unsubscribe when `destroyMethodName` was called', () => {
    const callback = jest.fn();

    class Test {
      subject = new Subject<any>();

      @WithUntilDestroyed('destroy')
      stream$ = this.subject.asObservable();

      destroy() {}
    }

    const test = new Test();
    test.stream$.subscribe(callback);

    test.subject.next('event');

    expect(callback).toHaveBeenCalledWith('event');

    callback.mockReset();
    test.destroy();
    test.subject.next('event');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not share value between instances', () => {
    class Test {
      @WithUntilDestroyed()
      stream$ = new Observable();

      ngOnDestroy() {}
    }

    const t1 = new Test();
    const t2 = new Test();

    expect(t1.stream$).not.toBe(t2.stream$);
  });
});
