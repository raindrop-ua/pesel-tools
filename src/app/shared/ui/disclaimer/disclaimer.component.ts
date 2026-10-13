import { Component } from '@angular/core';
import { ExternalLinkDirective } from '@shared/directives/external-link.directive';

@Component({
  selector: 'app-disclaimer',
  imports: [ExternalLinkDirective],
  templateUrl: './disclaimer.component.html',
  host: { class: 'text-base' },
})
export class DisclaimerComponent {}
