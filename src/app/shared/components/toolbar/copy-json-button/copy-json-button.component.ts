import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { ClipboardService } from '@services/clipboard.service';
import { ToolbarButtonComponent } from '@components/toolbar/toolbar-button/toolbar-button.component';
import {
  ActionResult,
  ToolbarAction,
} from '@components/toolbar/toolbar-button/toolbar-action';

@Component({
  selector: 'app-copy-json-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './copy-json-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyJsonButtonComponent implements ToolbarAction<void> {
  public readonly contentToCopy = input.required<string>();
  public readonly copied = signal(false);
  public readonly disabled = signal(false);

  private readonly clipboard = inject(ClipboardService);

  async run(): Promise<ActionResult> {
    const raw = this.contentToCopy();
    if (!raw) return { ok: false, message: 'Empty content' };
    const json = JSON.stringify(raw.split('\n'), null, 2);
    const ok = await this.clipboard.copy(json);
    if (ok) this.copied.set(true);
    return { ok };
  }
}
