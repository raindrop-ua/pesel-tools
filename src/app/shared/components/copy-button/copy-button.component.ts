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
  selector: 'app-copy-button',
  imports: [SvgIconComponent],
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyButtonComponent {
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

    const ok = await this.clipboard.copy(text);
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
