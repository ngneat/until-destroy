import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IntervalComponent } from './interval/interval.component';
import { DocumentClickComponent } from './document-click/document-click.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, IntervalComponent, DocumentClickComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
