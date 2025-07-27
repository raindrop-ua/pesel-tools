import { Component } from '@angular/core';
import {SectionComponent} from '../../core/layout/section/section.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-not-found',
  imports: [SectionComponent, CardComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
