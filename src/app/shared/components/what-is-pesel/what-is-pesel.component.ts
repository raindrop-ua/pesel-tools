import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExternalLinkDirective } from '@shared/directives/external-link.directive';
import { CardComponent } from '@components/card/card.component';
import { SectionComponent } from '@core/layout/section/section.component';

@Component({
  selector: 'app-what-is-pesel',
  imports: [ExternalLinkDirective, CardComponent, SectionComponent],
  templateUrl: './what-is-pesel.component.html',
  styleUrl: './what-is-pesel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatIsPeselComponent {}
