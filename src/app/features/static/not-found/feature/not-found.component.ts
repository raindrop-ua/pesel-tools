import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionComponent } from '@layout/section/section.component';
import { CardComponent } from '@shared/ui/card/card.component';

@Component({
  selector: 'app-not-found',
  imports: [SectionComponent, CardComponent],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
