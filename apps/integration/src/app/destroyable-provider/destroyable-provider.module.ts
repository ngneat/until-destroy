import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DestroyableProviderComponent } from './destroyable-provider.component';
import { ConnectionDirective } from './connection/connection.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DestroyableProviderComponent
      }
    ])
  ],
  declarations: [DestroyableProviderComponent, ConnectionDirective]
})
export class DestroyableProviderModule {}
