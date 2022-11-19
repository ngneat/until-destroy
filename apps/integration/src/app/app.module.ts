import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarModule } from './navbar/navbar.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        {
          path: 'pipe',
          loadChildren: () => import('./pipe/pipe.module').then(m => m.PipeModule),
        },
        {
          path: 'custom-method',
          loadChildren: () =>
            import('./custom-method/custom-method.module').then(m => m.CustomMethodModule),
        },
        {
          path: 'directive',
          loadChildren: () =>
            import('./directive/directive.module').then(m => m.DirectiveModule),
        },
        {
          path: 'inheritance',
          loadChildren: () =>
            import('./inheritance/inheritance.module').then(m => m.InheritanceModule),
        },
        {
          path: 'destroyable-provider',
          loadChildren: () =>
            import('./destroyable-provider/destroyable-provider.module').then(
              m => m.DestroyableProviderModule
            ),
        },
        {
          path: 'array-of-subscriptions',
          loadChildren: () =>
            import('./array-of-subscriptions/array-of-subscriptions.module').then(
              m => m.ArrayOfSubscriptionsModule
            ),
        },
        {
          path: 'multiple-custom-methods',
          loadChildren: () =>
            import('./multiple-custom-methods/multiple-custom-methods.module').then(
              m => m.MultipleCustoMethodsModule
            ),
        },
      ],
      {}
    ),
    NavbarModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
