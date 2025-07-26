import { Component, inject, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PeselOutputComponent } from '../../shared/components/pesel-output/pesel-output.component';
import { SectionComponent } from '../../core/layout/section/section.component';
import { BirthdayInputComponent } from '../../shared/components/birthday-input/birthday-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PeselGeneratorService } from '../../services/pesel-generator.service';
import { validDateValidator } from '../../shared/validators/valid-date.validator';

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
  private fb = inject(FormBuilder);
  private generator = inject(PeselGeneratorService);

  peselList = signal<string[]>([]);

  form: FormGroup = this.fb.group({
    birthday: this.fb.group(
      {
        day: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        month: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
        gender: ['female', Validators.required],
      },
      { validators: [validDateValidator()] },
    ),
  });

  get birthdayGroup(): FormGroup {
    return this.form.get('birthday') as FormGroup;
  }

  generatePesel(): void {
    const group = this.form.get('birthday') as FormGroup;
    if (!group || group.invalid) {
      group.markAllAsTouched();
      return;
    }

    const { day, month, year, gender } = group.value;
    const pesel = this.generator.generatePesel({
      year,
      month,
      day,
      sex: gender,
    });
    this.peselList.update((list) => [pesel, ...list]);
  }

  generateRandomPesel(): void {
    const newPesel = this.generator.generatePesel();
    this.peselList.update((list) => [newPesel, ...list]);
  }

  clearList(): void {
    this.peselList.set([]);
  }
}
