import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-section',
  imports: [],
  templateUrl: './section.component.html',
  host: { class: 'mx-auto block max-w-5xl overflow-x-clip p-6' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {}
