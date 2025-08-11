import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { DownloadService } from '@services/download.service';
import { ToolbarButtonComponent } from '@components/toolbar-button/toolbar-button.component';

@Component({
  selector: 'app-save-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './save-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveButtonComponent {
  public readonly contentToSave = input.required<string>();
  public readonly saved = signal(false);

  private readonly download = inject(DownloadService);
  private readonly destroyRef = inject(DestroyRef);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  public run = async () => {
    const raw = this.contentToSave();
    if (!raw) return false;
    const payload = raw.split('\n');
    const date = new Date().toISOString().slice(0, 10);
    this.download.downloadJson(payload, `pesels-${date}.json`, 2);
    this.saved.set(true);
    return true;
  };

  public onSuccess() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.saved.set(false);
      this.timeoutId = null;
    }, 2000);

    this.destroyRef.onDestroy(() => {
      if (this.timeoutId) clearTimeout(this.timeoutId);
    });
  }
}
