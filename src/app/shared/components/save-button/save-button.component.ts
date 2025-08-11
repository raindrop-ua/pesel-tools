import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { DownloadService } from '@services/download.service';
import { ToolbarButtonComponent } from '@components/toolbar-button/toolbar-button.component';
import {
  ActionResult,
  ToolbarAction,
} from '@components/toolbar-button/toolbar-action';

@Component({
  selector: 'app-save-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './save-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveButtonComponent implements ToolbarAction<void> {
  public readonly contentToSave = input.required<string>();
  public readonly saved = signal(false);

  private readonly download = inject(DownloadService);

  async run(): Promise<ActionResult> {
    const raw = this.contentToSave();
    if (!raw) return { ok: false, message: 'Empty content' };

    const payload = raw.split('\n');
    const date = new Date().toISOString().slice(0, 10);

    this.download.downloadJson(payload, `pesels-${date}.json`, 2);
    this.saved.set(true);

    return { ok: true };
  }
}
