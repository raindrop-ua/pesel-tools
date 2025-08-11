import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { SvgIconComponent } from '@core/components/svg-icon/svg-icon.component';
import { ClipboardService } from '@services/clipboard.service';

@Component({
  selector: 'app-copy-json-button',
  imports: [SvgIconComponent],
  templateUrl: './copy-json-button.component.html',
  styleUrl: './copy-json-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyJsonButtonComponent {
  contentToCopy = input.required<string>();
  copied = signal(false);
  disabled = signal(false);

  private readonly clipboard = inject(ClipboardService);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const onDestroy = () => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    };
    this.destroyRef.onDestroy(onDestroy);
  }

  async onCopy(): Promise<void> {
    const text = this.contentToCopy();
    if (!text || this.disabled()) return;

    const payload = this.contentToCopy().split('\n');
    const json = JSON.stringify(payload, null, 2);
    const ok = await this.clipboard.copy(json);

    if (!ok) return;

    this.copied.set(true);
    this.disabled.set(true);

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.copied.set(false);
      this.disabled.set(false);
      this.timeoutId = null;
    }, 2000);
  }
}
