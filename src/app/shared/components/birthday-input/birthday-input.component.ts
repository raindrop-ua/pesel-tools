import { Component, Input } from '@angular/core';
import { PeselInputComponent } from '../pesel-input/pesel-input.component';
import { RadioSelectComponent } from '../radio-select/radio-select.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-birthday-input',
  imports: [PeselInputComponent, RadioSelectComponent, ReactiveFormsModule],
  templateUrl: './birthday-input.component.html',
  styleUrl: './birthday-input.component.scss',
})
export class BirthdayInputComponent {
  @Input({ required: true }) formGroup!: FormGroup;
}
