import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PeselGeneratorService } from '@services/pesel-generator.service';
import { PeselStoreService } from '@services/pesel-store.service';
import { BirthdayInputComponent } from '../birthday-input/birthday-input.component';
import { ButtonComponent } from '@components/button/button.component';
import { CardComponent } from '@components/card/card.component';
import { PeselOutputComponent } from '@features/generator/components/pesel-output/pesel-output.component';
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
  templateUrl: './simple-generator.component.html',
  styleUrl: './simple-generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleGeneratorComponent {
  private fb = inject(FormBuilder);
  private generator = inject(PeselGeneratorService);
  private peselStoreService = inject(PeselStoreService);
  public peselList = this.peselStoreService.data;

  public form: FormGroup = this.fb.group({
    birthday: this.fb.group(
      {
        day: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
        month: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
        year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
        sex: ['female', Validators.required],
      },
      { validators: [validDateValidator()] },
    ),
  });

  get birthdayGroup(): FormGroup {
    return this.form.get('birthday') as FormGroup;
  }

  public onSubmit() {
    if (this.birthdayGroup.invalid) {
      this.birthdayGroup.markAllAsTouched();
      return;
    }

    const { day, month, year, sex } = this.birthdayGroup.value;
    const pesel = this.generateUniquePesel({
      year,
      month,
      day,
      sex,
    });

    if (pesel) this.peselStoreService.add(pesel);
  }

  private generateUniquePesel(
    opts?: {
      year?: number;
      month?: number;
      day?: number;
      sex?: 'male' | 'female';
    },
    maxAttempts = 500,
  ): string | null {
    const existing = new Set(this.peselList());
    for (let i = 0; i < maxAttempts; i++) {
      const p = this.generator.generatePesel(opts);
      if (!existing.has(p)) return p;
    }
    return null;
  }

  public generateRandomPesel(): void {
    const pesel = this.generateUniquePesel();
    if (pesel) this.peselStoreService.add(pesel);
  }

  public clearList(): void {
    this.peselStoreService.clear();
  }
}
