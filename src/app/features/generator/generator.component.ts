import {Component, inject, signal} from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PeselOutputComponent } from '../../shared/components/pesel-output/pesel-output.component';
import { SectionComponent } from '../../core/layout/section/section.component';
import { BirthdayInputComponent } from '../../shared/components/birthday-input/birthday-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PeselGeneratorService } from '../../services/pesel-generator.service';

@Component({
  selector: 'app-generator',
  imports: [
    CardComponent,
    FormsModule,
    PeselOutputComponent,
    ReactiveFormsModule,
    SectionComponent,
    BirthdayInputComponent,
    ButtonComponent,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss',
})
export class GeneratorComponent {
  pesels = signal<string[]>(['91062800008', '82090519293', '13302111183']);
  generator = inject(PeselGeneratorService);

  generatePesel(): void {
    console.log('Generate new pesel');
  }

  generateRandomPesel(): void {
    const newPesel = this.generator.generatePesel()
    this.pesels.update((list => ([newPesel, ...list])));
  }

  clearList(): void {
    this.pesels.set([]);
  }
}
