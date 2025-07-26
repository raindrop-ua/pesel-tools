import { Component } from '@angular/core';
import { CopyButtonComponent } from '../copy-button/copy-button.component';

@Component({
  selector: 'app-pesel-output',
  imports: [CopyButtonComponent],
  templateUrl: './pesel-output.component.html',
  styleUrl: './pesel-output.component.scss',
})
export class PeselOutputComponent {}
