import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionComponent } from '@core/layout/section/section.component';
import { CardComponent } from '@components/card/card.component';

@Component({
  selector: 'app-not-found',
  imports: [SectionComponent, CardComponent],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
