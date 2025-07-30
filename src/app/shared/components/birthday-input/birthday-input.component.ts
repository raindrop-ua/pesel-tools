import { Component, Input } from '@angular/core';
import { RadioSelectComponent } from '../radio-select/radio-select.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ValueInputComponent } from '../value-input/value-input.component';

@Component({
  selector: 'app-birthday-input',
  imports: [RadioSelectComponent, ReactiveFormsModule, ValueInputComponent],
  templateUrl: './birthday-input.component.html',
  styleUrl: './birthday-input.component.scss',
})
export class BirthdayInputComponent {
  @Input({ required: true }) formGroup!: FormGroup;
}
