import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { SvgIconComponent } from '@core/components/svg-icon/svg-icon.component';

@Component({
  selector: 'app-paste-button',
  imports: [SvgIconComponent],
  templateUrl: './paste-button.component.html',
  styleUrl: './paste-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasteButtonComponent {
  public pasted = signal(false);
  public pastedValue = output<string>();

  public async onPaste(): Promise<void> {
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
