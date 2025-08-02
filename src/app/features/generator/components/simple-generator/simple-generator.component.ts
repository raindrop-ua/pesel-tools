import { Component, inject } from '@angular/core';
import { BirthdayInputComponent } from "@components/birthday-input/birthday-input.component";
import { ButtonComponent } from "@components/button/button.component";
import { CardComponent } from "@components/card/card.component";
import { PeselOutputComponent } from "@components/pesel-output/pesel-output.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeselGeneratorService } from '@services/pesel-generator.service';
import { PeselStoreService } from '@services/pesel-store.service';
import { validDateValidator } from '@shared/validators/valid-date.validator';

@Component({
  selector: 'app-simple-generator',
    imports: [
        BirthdayInputComponent,
        ButtonComponent,
        CardComponent,
        PeselOutputComponent
    ],
  templateUrl: './simple-generator.component.html',
  styleUrl: './simple-generator.component.scss'
})
export class SimpleGeneratorComponent {
  private fb = inject(FormBuilder);
  private generator = inject(PeselGeneratorService);
  private peselStoreService = inject(PeselStoreService);
  public peselList = this.peselStoreService.pesels;

  form: FormGroup = this.fb.group({
    birthday: this.fb.group(
      {
        day: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
        month: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
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

    this.peselStoreService.add(pesel);
  }

  generateRandomPesel(): void {
    const pesel = this.generator.generatePesel();
    this.peselStoreService.add(pesel);
  }

  clearList(): void {
    this.peselStoreService.clear();
  }
}
