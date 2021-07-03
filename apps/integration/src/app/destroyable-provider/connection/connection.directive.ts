import { Directive } from '@angular/core';

import { ConnectionService } from './connection.service';

@Directive({
  selector: '[connection]',
  providers: [ConnectionService]
})
export class ConnectionDirective {
  constructor(connectionService: ConnectionService) {}
}
