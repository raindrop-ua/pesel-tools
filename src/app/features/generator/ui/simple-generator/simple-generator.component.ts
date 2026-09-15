import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneratorStateService } from '../../services/generator-state.service';
import { MAX_BATCH_SIZE } from '@core/generation/pesel-generation';
import { BirthdayInputComponent } from '../birthday-input/birthday-input.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { CardComponent } from '@shared/ui/card/card.component';
import { PeselOutputComponent } from '@features/generator/ui/pesel-output/pesel-output.component';
import { validDateValidator } from '@shared/validators/valid-date.validator';

@Component({
  selector: 'app-simple-generator',
  imports: [
    BirthdayInputComponent,
    ButtonComponent,
    CardComponent,
    PeselOutputComponent,
    ReactiveFormsModule,
  ],
  providers: [GeneratorStateService],
  templateUrl: './simple-generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleGeneratorComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  public readonly state = inject(GeneratorStateService);
  public readonly peselList = this.state.pesels;
  public readonly maxBatchSize = MAX_BATCH_SIZE;

  public readonly form = this.fb.group({
    sequential: [false],
    count: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(MAX_BATCH_SIZE),
        Validators.pattern(/^\d+$/),
      ],
    ],
    birthday: this.fb.group(
      {
        day: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
        month: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
        year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
        sex: this.fb.control<'male' | 'female' | 'random'>(
          'female',
          Validators.required,
        ),
      },
      { validators: [validDateValidator()] },
    ),
  });

  get birthdayGroup() {
    return this.form.controls.birthday;
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { day, month, year, sex } = this.birthdayGroup.getRawValue();
    void this.state.generate(this.form.controls.count.value, {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      sex: sex === 'random' ? undefined : sex,
      serialMode: this.form.controls.sequential.value ? 'sequential' : 'random',
    });
  }

  public generateRandomPesel(): void {
    if (this.form.controls.sequential.value) return;
    if (this.form.controls.count.invalid) {
      this.form.controls.count.markAsTouched();
      return;
    }
    void this.state.generate(this.form.controls.count.value);
  }

  public clearList(): void {
    this.state.clear();
  }
}
