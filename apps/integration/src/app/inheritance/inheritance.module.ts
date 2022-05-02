import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InheritanceComponent } from './inheritance.component';

import { Issue61Component } from './issue-61/issue-61.component';
import { Issue97Component } from './issue-97/issue-97.component';
import { Issue175Component } from './issue-175/issue-175.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: InheritanceComponent,
      },
    ]),
  ],
  declarations: [InheritanceComponent, Issue61Component, Issue97Component, Issue175Component],
})
export class InheritanceModule {}
