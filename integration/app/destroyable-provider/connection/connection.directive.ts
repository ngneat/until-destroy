import { Directive, ɵɵdirectiveInject } from '@angular/core';

import { ConnectionService } from './connection.service';

@Directive({
  selector: '[connection]',
  providers: [ConnectionService]
})
export class ConnectionDirective {
  constructor() {
    ɵɵdirectiveInject(ConnectionService);
  }
}
