import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { ToolbarButtonComponent } from '@components/toolbar-button/toolbar-button.component';

@Component({
  selector: 'app-paste-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './paste-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasteButtonComponent {
  pasted = signal(false);
  pastedValue = output<string>();

  run = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (/^\d{11}$/.test(trimmed)) {
        this.pastedValue.emit(trimmed);
        this.pasted.set(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Clipboard access denied:', e);
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSuccess() {}
}
