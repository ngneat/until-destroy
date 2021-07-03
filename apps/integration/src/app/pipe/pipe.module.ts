import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nPipe } from './i18n.pipe';
import { PipeComponent } from './pipe.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PipeComponent
      }
    ])
  ],
  declarations: [I18nPipe, PipeComponent]
})
export class PipeModule {}
