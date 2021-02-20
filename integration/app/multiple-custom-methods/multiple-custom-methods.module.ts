import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Issue66Component } from './issue-66/issue-66.component';
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
  declarations: [Issue66Component, MultipleCustoMethodsComponent]
})
export class MultipleCustoMethodsModule {}
