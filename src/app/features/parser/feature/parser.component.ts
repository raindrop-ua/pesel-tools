import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionComponent } from '../../../layout/section/section.component';
import { CardComponent } from '@shared/ui/card/card.component';
import { DisclaimerComponent } from '@shared/ui/disclaimer/disclaimer.component';
import { PeselParserComponent } from '@features/parser/ui/pesel-parser/pesel-parser.component';

@Component({
  selector: 'app-parser',
  imports: [
    CardComponent,
    SectionComponent,
    DisclaimerComponent,
    PeselParserComponent,
  ],
  templateUrl: './parser.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParserComponent {}
