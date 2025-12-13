import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionComponent } from '@core/layout/section/section.component';
import { CardComponent } from '@components/card/card.component';
import { DisclaimerComponent } from '@components/disclaimer/disclaimer.component';
import { PeselParserComponent } from '@features/parser/components/pesel-parser/pesel-parser.component';

@Component({
  selector: 'app-parser',
  imports: [
    CardComponent,
    SectionComponent,
    DisclaimerComponent,
    PeselParserComponent,
  ],
  templateUrl: './parser.component.html',
  styleUrl: './parser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParserComponent {}
