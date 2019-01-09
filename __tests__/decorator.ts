import { EMPTY, Subject } from 'rxjs';

import * as untilDestroyedObj from '../src/take-until-destroy';

import { WithUntilDestroyed } from '../src/decorator';

describe('@WithUntilDestroyed decorator', () => {
  it('should throw when applied on non Observable prop', () => {
    class Test {
      @WithUntilDestroyed()
      notObservable = true;
    }

    expect(() => new Test()).toThrowError();
  });

  it('should call `untilDestroyed()` with target prototype and `destroyMethodName` on setter', () => {
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

    new Test();

    expect(untilDestroyedSpy).toHaveBeenCalledWith(Test.prototype, 'destroy');
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
});
