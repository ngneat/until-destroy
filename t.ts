import { UntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs';

@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html'
})
export class InboxComponent {
  subscriptions: Subscription[] = [];

  constructor() {
    const subscription = interval(1000)
      .pipe(untilDestroyed(this))
      .subscribe(val => console.log(val));

    this.subscriptions.push(subscription);
  }
}
