import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  i18nPipeShown = false;

  intervalComponentShown = false;

  documentClickComponentShown = false;

  httpDirectiveShown = false;

  connectionDirectiveShown = false;

  issueSixtyOneComponentShown = false;

  issueSixtySixComponentShown = false;

  constructor(private router: Router) {}

  buttons = [
    {
      label: 'Toggle ng-container with i18n pipe inside',
      action: () => (this.i18nPipeShown = !this.i18nPipeShown)
    },
    {
      label: 'Toggle app-interval component',
      action: () => (this.intervalComponentShown = !this.intervalComponentShown)
    },
    {
      label: 'Toggle app-document-click component',
      action: () => (this.documentClickComponentShown = !this.documentClickComponentShown)
    },
    {
      label: 'Toggle [http] directive',
      action: () => (this.httpDirectiveShown = !this.httpDirectiveShown)
    },
    {
      label: 'Toggle [connection] directive',
      action: () => (this.connectionDirectiveShown = !this.connectionDirectiveShown)
    },
    {
      label: 'Toggle app-issue-sixty-one component',
      action: () => (this.issueSixtyOneComponentShown = !this.issueSixtyOneComponentShown)
    },
    {
      label: 'Toggle app-issue-sixty-six component',
      action: () => (this.issueSixtySixComponentShown = !this.issueSixtySixComponentShown)
    },
    {
      label: 'Go to /issue-78',
      action: () => this.router.navigateByUrl('/issue-78')
    }
  ];
}
