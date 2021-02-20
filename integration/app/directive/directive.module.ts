import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HttpDirective } from './http.directive';
import { DirectiveComponent } from './directive.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DirectiveComponent
      }
    ])
  ],
  declarations: [HttpDirective, DirectiveComponent]
})
export class DirectiveModule {}
