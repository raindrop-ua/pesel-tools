import { Component } from '@angular/core';
import { SectionComponent } from '../../core/layout/section/section.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { PeselInputComponent } from '../../shared/components/pesel-input/pesel-input.component';
import { PeselOutputComponent } from '../../shared/components/pesel-output/pesel-output.component';

@Component({
  selector: 'app-validator',
  imports: [
    SectionComponent,
    CardComponent,
    PeselInputComponent,
    PeselOutputComponent,
  ],
  templateUrl: './validator.component.html',
  styleUrl: './validator.component.scss',
})
export class ValidatorComponent {}
