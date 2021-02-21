import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  links = [
    {
      title: 'Pipe example',
      url: '/pipe'
    },
    {
      title: 'Custom method example',
      url: '/custom-method'
    },
    {
      title: 'Directive example',
      url: '/directive'
    },
    {
      title: 'Inheritance example',
      url: '/inheritance'
    },
    {
      title: 'Destroyable provider example',
      url: '/destroyable-provider'
    },
    {
      title: 'Array of subscriptions example',
      url: '/array-of-subscriptions'
    },
    {
      title: 'Multiple custom methods example',
      url: '/multiple-custom-methods'
    }
  ];
}
