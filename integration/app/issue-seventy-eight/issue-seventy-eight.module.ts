import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IssueSeventyEightComponent } from './issue-seventy-eight.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: IssueSeventyEightComponent
      }
    ])
  ],
  declarations: [IssueSeventyEightComponent]
})
export class IssueSeventyEight {}
