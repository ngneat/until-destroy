import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MultipleCustoMethodsComponent } from './multiple-custom-methods.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MultipleCustoMethodsComponent
      }
    ])
  ],
  declarations: [MultipleCustoMethodsComponent]
})
export class MultipleCustoMethodsModule {}
