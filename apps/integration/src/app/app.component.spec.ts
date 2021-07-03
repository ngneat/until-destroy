import {
  ɵivyEnabled as ivyEnabled,
  Component,
  Directive,
  Injectable,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

describe('until-destroy runtime behavior', () => {
  it('ivy has to be enabled', () => {
    // This assertion has to be performed as we have to
    // be sure that we're running these tests with the Ivy engine
    expect(ivyEnabled).toBeTruthy();
  });

  it('should unsubscribe from the component property', () => {
    // Arrange
    @UntilDestroy({ checkProperties: true })
    @Component({ template: '' })
    class MockComponent {
      disposed = false;

      subscription = new Subject()
        .pipe(
          finalize(() => {
            this.disposed = true;
          })
        )
        .subscribe();
    }

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent],
    });

    const fixture = TestBed.createComponent(MockComponent);

    // Assert
    expect(fixture.componentInstance.disposed).toBeFalsy();
    fixture.destroy();
    expect(fixture.componentInstance.disposed).toBeTruthy();
  });

  it('should unsubscribe from the directive property', () => {
    // Arrange
    @Component({
      template: '<div test></div>',
    })
    class MockComponent {}

    @UntilDestroy({ checkProperties: true })
    @Directive({ selector: '[test]' })
    class MockDirective {
      disposed = false;

      subscription = new Subject()
        .pipe(
          finalize(() => {
            this.disposed = true;
          })
        )
        .subscribe();
    }

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent, MockDirective],
    });

    const fixture = TestBed.createComponent(MockComponent);
    fixture.detectChanges();

    const elementWithDirective = fixture.debugElement.query(By.directive(MockDirective));
    const directive = elementWithDirective.injector.get(MockDirective);
    fixture.destroy();

    // Assert
    expect(directive.disposed).toBeTruthy();
  });

  it('should unsubscribe from pipe property', () => {
    // Arrange
    let disposed = false;

    @UntilDestroy({ checkProperties: true })
    @Pipe({ name: 'mock', pure: false })
    class MockPipe implements PipeTransform {
      disposed = false;

      subscription = new Subject().pipe(finalize(() => (disposed = true))).subscribe();

      transform(): string {
        return 'I have been piped';
      }
    }

    @Component({
      template: ` <div>{{ '' | mock }}</div> `,
    })
    class MockComponent {}

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent, MockPipe],
    });

    const fixture = TestBed.createComponent(MockComponent);
    fixture.detectChanges();
    fixture.destroy();

    // Assert
    expect(disposed).toBeTruthy();
  });

  it('should loop an array of subscriptions and unsubscribe', () => {
    // Arrange
    @UntilDestroy({ arrayName: 'subscriptions' })
    @Component({ template: '' })
    class MockComponent {
      disposed = false;

      subscriptions = [
        new Subject()
          .pipe(
            finalize(() => {
              this.disposed = true;
            })
          )
          .subscribe(),
      ];
    }

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent],
    });

    const fixture = TestBed.createComponent(MockComponent);

    // Assert
    expect(fixture.componentInstance.disposed).toBeFalsy();
    fixture.destroy();
    expect(fixture.componentInstance.disposed).toBeTruthy();
  });

  it('should complete the stream using the "untilDestroyed" operator', () => {
    // Arrange
    @UntilDestroy()
    @Component({ template: '' })
    class MockComponent {
      disposed = false;

      constructor() {
        new Subject()
          .pipe(
            untilDestroyed(this),
            finalize(() => {
              this.disposed = true;
            })
          )
          .subscribe();
      }
    }

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent],
    });

    const fixture = TestBed.createComponent(MockComponent);

    // Assert
    expect(fixture.componentInstance.disposed).toBeFalsy();
    fixture.destroy();
    expect(fixture.componentInstance.disposed).toBeTruthy();
  });

  it('should unsubscribe from the provider property', () => {
    // Arrange
    @UntilDestroy({ checkProperties: true })
    @Injectable()
    class MockService {
      disposed = false;

      subscription = new Subject()
        .pipe(
          finalize(() => {
            this.disposed = true;
          })
        )
        .subscribe();
    }

    @Component({
      template: '',
      providers: [MockService],
    })
    class MockComponent {
      constructor(mockService: MockService) {}
    }

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent],
    });

    const fixture = TestBed.createComponent(MockComponent);
    const service = fixture.componentRef.injector.get(MockService);

    // Assert
    expect(service.disposed).toBeFalsy();
    fixture.destroy();
    expect(service.disposed).toBeTruthy();
  });

  it('should complete the stream on provider', () => {
    // Arrange
    @UntilDestroy()
    @Injectable()
    class MockService {
      disposed = false;

      constructor() {
        new Subject()
          .pipe(
            untilDestroyed(this),
            finalize(() => {
              this.disposed = true;
            })
          )
          .subscribe();
      }
    }

    @Component({
      template: '',
      providers: [MockService],
    })
    class MockComponent {
      constructor(mockService: MockService) {}
    }

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent],
    });

    const fixture = TestBed.createComponent(MockComponent);
    const service = fixture.componentRef.injector.get(MockService);

    // Assert
    expect(service.disposed).toBeFalsy();
    fixture.destroy();
    expect(service.disposed).toBeTruthy();
  });

  describe('https://github.com/ngneat/until-destroy/issues/61', () => {
    it('should unsubscribe from streams if component inherits another directive or component', () => {
      // Arrange
      let baseDirectiveSubjectUnsubscribed = false,
        mockComponentSubjectUnsubscribed = false;

      @Directive()
      abstract class BaseDirective {
        constructor() {
          new Subject()
            .pipe(
              untilDestroyed(this),
              finalize(() => (baseDirectiveSubjectUnsubscribed = true))
            )
            .subscribe();
        }
      }

      @UntilDestroy()
      @Component({ template: '' })
      class MockComponent extends BaseDirective {
        constructor() {
          super();

          new Subject()
            .pipe(
              untilDestroyed(this),
              finalize(() => (mockComponentSubjectUnsubscribed = true))
            )
            .subscribe();
        }
      }

      // Act
      TestBed.configureTestingModule({
        declarations: [MockComponent],
      });

      const fixture = TestBed.createComponent(MockComponent);

      // Assert
      expect(baseDirectiveSubjectUnsubscribed).toBeFalsy();
      expect(mockComponentSubjectUnsubscribed).toBeFalsy();
      fixture.destroy();
      expect(baseDirectiveSubjectUnsubscribed).toBeTruthy();
      expect(mockComponentSubjectUnsubscribed).toBeTruthy();
    });
  });

  describe('https://github.com/ngneat/until-destroy/issues/66', () => {
    it('should be able to re-use methods of the singleton service multiple times', () => {
      // Arrange
      let disposedTimes = 0;
      let startCalledTimes = 0;
      let originalStopCalledTimes = 0;

      @Injectable()
      class IssueSixtySixService {
        start(): void {
          startCalledTimes++;

          new Subject()
            .pipe(
              untilDestroyed(this, 'stop'),
              finalize(() => disposedTimes++)
            )
            .subscribe();
        }

        stop(): void {
          originalStopCalledTimes++;
        }
      }

      @Component({ template: '' })
      class IssueSixtySixComponent {
        constructor(private issueSixtySixService: IssueSixtySixService) {}

        start(): void {
          this.issueSixtySixService.start();
        }

        stop(): void {
          this.issueSixtySixService.stop();
        }
      }

      // Act
      TestBed.configureTestingModule({
        declarations: [IssueSixtySixComponent],
        providers: [IssueSixtySixService],
      });

      const fixture = TestBed.createComponent(IssueSixtySixComponent);

      fixture.componentInstance.start();
      fixture.componentInstance.stop();

      fixture.componentInstance.start();
      fixture.componentInstance.stop();

      // Assert
      expect(disposedTimes).toBe(2);
      expect(startCalledTimes).toBe(2);
      expect(originalStopCalledTimes).toBe(2);
    });

    it('should not use the single subject for different streams when `destroyMethodName` is provided', () => {
      // Arrange
      @Injectable()
      class IssueSixtySixService {
        firstSubjectUnsubscribed = false;
        secondSubjectUnsubscribed = false;

        startFirst(): void {
          new Subject()
            .pipe(
              untilDestroyed(this, 'stopFirst'),
              finalize(() => (this.firstSubjectUnsubscribed = true))
            )
            .subscribe();
        }

        stopFirst(): void {}

        startSecond(): void {
          new Subject()
            .pipe(
              untilDestroyed(this, 'stopSecond'),
              finalize(() => (this.secondSubjectUnsubscribed = true))
            )
            .subscribe();
        }

        stopSecond(): void {}
      }

      @Component({ template: '' })
      class IssueSixtySixComponent {
        constructor(private issueSixtySixService: IssueSixtySixService) {}

        startFirst(): void {
          this.issueSixtySixService.startFirst();
        }

        stopFirst(): void {
          this.issueSixtySixService.stopFirst();
        }

        startSecond(): void {
          this.issueSixtySixService.startSecond();
        }

        stopSecond(): void {
          this.issueSixtySixService.stopSecond();
        }
      }

      // Act
      TestBed.configureTestingModule({
        declarations: [IssueSixtySixComponent],
        providers: [IssueSixtySixService],
      });

      const fixture = TestBed.createComponent(IssueSixtySixComponent);
      const issueSixtySixService = TestBed.inject(IssueSixtySixService);

      fixture.componentInstance.startFirst();
      fixture.componentInstance.startSecond();
      fixture.componentInstance.stopFirst();

      // Arrange
      expect(issueSixtySixService.firstSubjectUnsubscribed).toBeTruthy();
      // Ensure that they listen to different subjects and all streams
      // are not completed together.
      expect(issueSixtySixService.secondSubjectUnsubscribed).toBeFalsy();

      fixture.componentInstance.stopSecond();
      expect(issueSixtySixService.secondSubjectUnsubscribed).toBeTruthy();
    });
  });
});
