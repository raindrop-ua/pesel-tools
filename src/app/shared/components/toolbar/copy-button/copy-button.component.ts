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
  selector: 'app-copy-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './copy-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyButtonComponent implements ToolbarAction<void> {
  public readonly contentToCopy = input.required<string>();
  public readonly copied = signal(false);
  public readonly disabled = signal(false);

  private readonly clipboard = inject(ClipboardService);

  public async run(): Promise<ActionResult> {
    const text = this.contentToCopy();
    if (!text) return { ok: false, message: 'Empty content' };

    const ok = await this.clipboard.copy(text);
    if (ok) this.copied.set(true);

    return { ok };
  }
}
