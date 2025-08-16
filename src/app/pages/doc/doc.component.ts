import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionComponent } from '@core/layout/section/section.component';
import { CardComponent } from '@components/card/card.component';
import { WhatIsPeselComponent } from '@components/what-is-pesel/what-is-pesel.component';

@Component({
  selector: 'app-doc',
  imports: [SectionComponent, CardComponent, WhatIsPeselComponent],
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocComponent {}
