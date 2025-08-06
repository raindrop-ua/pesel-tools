import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CardComponent } from '@components/card/card.component';

@Component({
  selector: 'app-advanced-generator',
  imports: [CardComponent],
  templateUrl: './advanced-generator.component.html',
  styleUrl: './advanced-generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedGeneratorComponent {}
