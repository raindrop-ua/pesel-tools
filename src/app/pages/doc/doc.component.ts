import { Component } from '@angular/core';
import { SectionComponent } from '@core/layout/section/section.component';
import { CardComponent } from '@components/card/card.component';

@Component({
  selector: 'app-doc',
  imports: [SectionComponent, CardComponent],
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.scss',
})
export class DocComponent {}
