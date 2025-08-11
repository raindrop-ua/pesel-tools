import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ToolbarButtonComponent } from '@components/toolbar/toolbar-button/toolbar-button.component';
import {
  ActionResult,
  ToolbarAction,
} from '@components/toolbar/toolbar-button/toolbar-action';

@Component({
  selector: 'app-paste-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './paste-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasteButtonComponent implements ToolbarAction<string> {
  public readonly result = output<ActionResult<string>>();

  async run(): Promise<ActionResult<string>> {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (/^\d{11}$/.test(text)) {
        return { ok: true, data: text };
      }
      return { ok: false, message: 'Invalid format' };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  emitResult(res: ActionResult<unknown>) {
    this.result.emit(res as ActionResult<string>);
  }
}
