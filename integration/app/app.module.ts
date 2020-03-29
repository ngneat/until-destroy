import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HttpDirective } from './http/http.directive';
import { IntervalComponent } from './interval/interval.component';
import { ConnectionDirective } from './connection/connection.directive';
import { DocumentClickComponent } from './document-click/document-click.component';
import { IssueSixtyOneComponent } from './issue-sixty-one/issue-sixty-one.component';
import { IssueSixtySixComponent } from './issue-sixty-six/issue-sixty-six.component';

@NgModule({
  imports: [BrowserModule, HttpClientModule],
  declarations: [
    AppComponent,
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
