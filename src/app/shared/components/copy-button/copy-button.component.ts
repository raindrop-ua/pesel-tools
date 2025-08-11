import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ClipboardService } from '@services/clipboard.service';
import { ToolbarButtonComponent } from '@components/toolbar-button/toolbar-button.component';

@Component({
  selector: 'app-copy-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './copy-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyButtonComponent {
  public readonly contentToCopy = input.required<string>();
  public readonly copied = signal(false);
  public readonly disabled = signal(false);

  private readonly clipboard = inject(ClipboardService);
  private readonly destroyRef = inject(DestroyRef);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  public run = async () => {
    const text = this.contentToCopy();
    if (!text) return false;
    const ok = await this.clipboard.copy(text);
    if (ok) this.copied.set(true);
    return ok;
  };

  public onSuccess() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.disabled.set(true);
    this.timeoutId = setTimeout(() => {
      this.copied.set(false);
      this.disabled.set(false);
      this.timeoutId = null;
    }, 2000);

    this.destroyRef.onDestroy(() => {
      if (this.timeoutId) clearTimeout(this.timeoutId);
    });
  }
}
