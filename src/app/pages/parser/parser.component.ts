import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionComponent } from '@core/layout/section/section.component';
import { CardComponent } from '@components/card/card.component';
import { DisclaimerComponent } from '@components/disclaimer/disclaimer.component';
import { PeselGeneratorComponent } from '@features/parser/components/pesel-generator/pesel-generator.component';

@Component({
  selector: 'app-parser',
  imports: [
    CardComponent,
    SectionComponent,
    DisclaimerComponent,
    PeselGeneratorComponent,
  ],
  templateUrl: './parser.component.html',
  styleUrl: './parser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParserComponent {}
