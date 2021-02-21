import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ArrayOfSubscriptionsComponent } from './array-of-subscriptions.component';
import { DocumentClickComponent } from './document-click/document-click.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ArrayOfSubscriptionsComponent
      }
    ])
  ],
  declarations: [DocumentClickComponent, ArrayOfSubscriptionsComponent]
})
export class ArrayOfSubscriptionsModule {}
