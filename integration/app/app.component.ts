import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  intervalComponentShown = false;

  documentClickComponentShown = false;

  httpDirectiveShown = false;

  connectionDirectiveShown = false;

  issueSixtyOneComponentShown = false;

  issueSixtySixComponentShown = false;

  buttons = [
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
    }
  ];
}
