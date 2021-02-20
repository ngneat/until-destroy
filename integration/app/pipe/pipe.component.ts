import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pipe',
  templateUrl: './pipe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipeComponent {
  shown = true;

  pipeUnsubscribed$ = new BehaviorSubject<boolean>(false);

  toggle(): void {
    this.shown = !this.shown;
  }
}
