import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExternalLinkDirective } from '@shared/directives/external-link.directive';

@Component({
  selector: 'app-disclaimer',
  imports: [
    ExternalLinkDirective
  ],
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisclaimerComponent {}
