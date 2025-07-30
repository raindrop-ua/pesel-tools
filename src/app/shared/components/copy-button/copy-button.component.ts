import { Component, input, signal } from '@angular/core';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-copy-button',
  imports: [
    SvgIconComponent
  ],
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.scss',
})
export class CopyButtonComponent {
  contentToCopy = input.required<string>();
  copied = signal(false);

  copyToClipboard(): void {
    if (!this.contentToCopy()) return;

    navigator.clipboard.writeText(this.contentToCopy()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 3000);
    });
  }
}
