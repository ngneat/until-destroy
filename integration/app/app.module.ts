import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IntervalComponent } from './interval/interval.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, IntervalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
