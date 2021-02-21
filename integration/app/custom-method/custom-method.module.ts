import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomMethodComponent } from './custom-method.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomMethodComponent
      }
    ])
  ],
  declarations: [CustomMethodComponent]
})
export class CustomMethodModule {}
