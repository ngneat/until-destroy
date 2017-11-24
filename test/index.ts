import * as test from 'tape';
import { TakeUntilDestroy } from '../src';
import { Subject } from 'rxjs/Subject';

test('with multiple component instances', textContext1 => {
  @TakeUntilDestroy
  class Test {
    componentDestroyed$: Subject<boolean>;

    ngOnDestroy() {
    }
  }

  const component1: Test = new Test();
  const component2: Test = new Test();

  textContext1.test('when a component is destroyed', textContext2 => {
    textContext2.test('it should not destroy other instances', textContext3 => {
      textContext3.plan(1);
      component2.componentDestroyed$.subscribe(() => {
        textContext3.fail('Other instances should not be destroyed');
      });
      component1.ngOnDestroy();
      textContext3.pass();
    });
  });
});

test('with multiple componentDestroy calls', textContext1 => {
  @TakeUntilDestroy
  class Test {
    componentDestroyed$: Subject<boolean>;

    ngOnDestroy() {
    }
  }

  const component: Test = new Test();

  textContext1.test('when a component is destroyed', textContext2 => {
    textContext2.test('it should destroy all subscriptions', textContext3 => {
      textContext3.plan(3);
      component.componentDestroyed$.subscribe(() => textContext3.pass());
      component.componentDestroyed$.subscribe(() => textContext3.pass());
      component.ngOnDestroy();
      textContext3.pass();
    });
  });
});
