import { Component } from '@angular/core';
import { SectionComponent } from '../../core/layout/section/section.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-home',
  imports: [SectionComponent, CardComponent, DisclaimerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
