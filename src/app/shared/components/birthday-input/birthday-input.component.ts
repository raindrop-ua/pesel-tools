import { Component } from '@angular/core';
import { PeselInputComponent } from '../pesel-input/pesel-input.component';

@Component({
  selector: 'app-birthday-input',
  imports: [PeselInputComponent],
  templateUrl: './birthday-input.component.html',
  styleUrl: './birthday-input.component.scss',
})
export class BirthdayInputComponent {}
