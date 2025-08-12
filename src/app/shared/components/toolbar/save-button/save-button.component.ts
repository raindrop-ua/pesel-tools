import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DownloadService } from '@services/download.service';
import { ToolbarButtonComponent } from '@components/toolbar/toolbar-button/toolbar-button.component';
import {
  ActionResult,
  ToolbarAction,
} from '@components/toolbar/toolbar-button/toolbar-action';

@Component({
  selector: 'app-save-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './save-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveButtonComponent implements ToolbarAction<void> {
  public readonly contentToSave = input.required<string | undefined>();

  private readonly download = inject(DownloadService);

  async run(): Promise<ActionResult> {
    const raw = this.contentToSave();
    if (!raw) return { ok: false, message: 'Empty content' };

    const payload = raw.split('\n');
    const date = Date.now();

    this.download.downloadJson(payload, `pesels-${date}.json`, 2);

    return { ok: true };
  }
}
