import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { SvgIconComponent } from '@core/components/svg-icon/svg-icon.component';
import {
  ActionResult,
  ToolbarAction,
} from '@components/toolbar/toolbar-button/toolbar-action';

@Component({
  selector: 'app-toolbar-button',
  imports: [SvgIconComponent],
  templateUrl: './toolbar-button.component.html',
  styleUrl: './toolbar-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarButtonComponent {
  public readonly icon = input.required<string>();
  public readonly activeIcon = input<string>('check');

  public readonly title = input.required<string>();
  public readonly activeTitle = input<string>('Done!');
  public readonly srText = input<string>('Action');
  public readonly srActiveText = input<string>('Done!');

  public readonly successDuration = input<number>(2000);
  public readonly disableWhileRunning = input<boolean>(true);
  public readonly disableWhileSuccess = input<boolean>(true);
  public readonly externalDisabled = input<boolean>(false);

  public readonly action = input.required<ToolbarAction<unknown>>();

  public readonly active = signal(false);
  public readonly isDisabled = signal(false);
  private readonly running = signal(false);
  private readonly computedDisabled = computed(() => {
    return this.externalDisabled() || this.isDisabled() || this.running();
  });

  public readonly result = output<ActionResult<unknown>>();
  public readonly success = output<void>();
  public readonly clicked = output<void>();

  private successTimer: ReturnType<typeof setTimeout> | null = null;

  public async handleClick() {
    if (this.computedDisabled()) return;

    this.clicked.emit();

    try {
      if (this.disableWhileRunning()) this.isDisabled.set(true);
      this.running.set(true);

      const res = await this.action().run();
      this.result.emit(res);

      if (res.ok) {
        this.active.set(true);
        this.success.emit();

        this.running.set(false);
        if (!this.disableWhileSuccess()) this.isDisabled.set(false);

        if (this.successTimer) clearTimeout(this.successTimer);
        this.successTimer = setTimeout(() => {
          this.active.set(false);
          if (this.disableWhileSuccess()) this.isDisabled.set(false);
          this.successTimer = null;
        }, this.successDuration());
      } else {
        this.running.set(false);
        this.isDisabled.set(false);
      }
    } catch (e) {
      const fail: ActionResult = { ok: false, error: e };
      this.result.emit(fail);
      this.running.set(false);
      this.isDisabled.set(false);
    }
  }
}
