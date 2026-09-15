import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionComponent } from '../../../layout/section/section.component';
import { CardComponent } from '@shared/ui/card/card.component';
import { DisclaimerComponent } from '@shared/ui/disclaimer/disclaimer.component';
import { MastheadComponent } from '@features/home/ui/masthead/masthead.component';
import { WhatIsPeselComponent } from '@shared/ui/what-is-pesel/what-is-pesel.component';
import { PeselOfTheMomentComponent } from '@features/home/ui/pesel-of-the-moment/pesel-of-the-moment.component';

@Component({
  selector: 'app-home',
  imports: [
    SectionComponent,
    CardComponent,
    DisclaimerComponent,
    MastheadComponent,
    PeselOfTheMomentComponent,
    WhatIsPeselComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
