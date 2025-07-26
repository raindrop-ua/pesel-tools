import {Component, input} from '@angular/core';
import { CopyButtonComponent } from '../copy-button/copy-button.component';
import {AsyncPipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-pesel-output',
  imports: [CopyButtonComponent, AsyncPipe, JsonPipe],
  templateUrl: './pesel-output.component.html',
  styleUrl: './pesel-output.component.scss',
})
export class PeselOutputComponent {
  data = input.required<string[]>();
}
