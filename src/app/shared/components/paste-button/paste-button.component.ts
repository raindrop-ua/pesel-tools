import {Component, output, signal} from '@angular/core';

@Component({
  selector: 'app-paste-button',
  imports: [],
  templateUrl: './paste-button.component.html',
  styleUrl: './paste-button.component.scss'
})
export class PasteButtonComponent {
  pasted = signal(false);

  pastedValue = output<string>();

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (/^\d{11}$/.test(trimmed)) {
        this.pasted.set(true);
        this.pastedValue.emit(trimmed);
        setTimeout(() => this.pasted.set(false), 1500);
      }
    } catch (err) {
      console.error('Clipboard access denied:', err);
    }
  }
}
