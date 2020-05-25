import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { I18nPipe } from './i18n/i18n.pipe';
import { HttpDirective } from './http/http.directive';
import { IntervalComponent } from './interval/interval.component';
import { ConnectionDirective } from './connection/connection.directive';
import { DocumentClickComponent } from './document-click/document-click.component';
import { IssueSixtyOneComponent } from './issue-sixty-one/issue-sixty-one.component';
import { IssueSixtySixComponent } from './issue-sixty-six/issue-sixty-six.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'issue-78',
        loadChildren: () =>
          import('./issue-seventy-eight/issue-seventy-eight.module').then(
            m => m.IssueSeventyEight
          )
      }
    ])
  ],
  declarations: [
    AppComponent,
    I18nPipe,
    HttpDirective,
    IntervalComponent,
    ConnectionDirective,
    DocumentClickComponent,
    IssueSixtyOneComponent,
    IssueSixtySixComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
