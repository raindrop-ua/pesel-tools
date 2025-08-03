import { Component } from '@angular/core';
import { SectionComponent } from '@core/layout/section/section.component';
import { CardComponent } from '@components/card/card.component';
import { DisclaimerComponent } from '@components/disclaimer/disclaimer.component';
import { MastheadComponent } from './components/masthead/masthead.component';
import { PeselOfTheMomentComponent } from './components/pesel-of-the-moment/pesel-of-the-moment.component';

@Component({
  selector: 'app-home',
  imports: [
    SectionComponent,
    CardComponent,
    DisclaimerComponent,
    MastheadComponent,
    PeselOfTheMomentComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
