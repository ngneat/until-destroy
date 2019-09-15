import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { IntervalComponent } from './interval/interval.component';
import { DocumentClickComponent } from './document-click/document-click.component';
import { HttpDirective } from './http/http.directive';

@NgModule({
  imports: [BrowserModule, HttpClientModule],
  declarations: [AppComponent, IntervalComponent, DocumentClickComponent, HttpDirective],
  bootstrap: [AppComponent]
})
export class AppModule {}
