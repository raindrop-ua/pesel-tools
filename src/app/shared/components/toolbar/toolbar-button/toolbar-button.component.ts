import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
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
  private readonly running = signal(false);
  public readonly disabled = computed(() => {
    return (
      this.externalDisabled() ||
      (this.disableWhileRunning() && this.running()) ||
      (this.disableWhileSuccess() && this.active())
    );
  });
  public readonly iconToShow = computed(() =>
    this.active() ? this.activeIcon() : this.icon(),
  );
  public readonly titleToShow = computed(() =>
    this.active() ? this.activeTitle() : this.title(),
  );
  public readonly srTextToShow = computed(() =>
    this.active() ? this.srActiveText() : this.srText(),
  );

  public readonly result = output<ActionResult<unknown>>();
  public readonly success = output<void>();
  public readonly clicked = output<void>();

  private readonly destroyRef = inject(DestroyRef);
  private destroyed = false;

  private successTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.clearSuccessTimer();
    });
  }

  public async handleClick() {
    if (this.disabled()) return;

    this.clicked.emit();
    this.running.set(true);

    const res = await this.runAction();
    if (this.destroyed) return;

    this.running.set(false);
    this.result.emit(res);

    if (res.ok) {
      this.showSuccess();
      this.success.emit();
    }
  }

  private async runAction(): Promise<ActionResult<unknown>> {
    try {
      return await this.action().run();
    } catch (error) {
      return { ok: false, error };
    }
  }

  private showSuccess(): void {
    this.active.set(true);
    this.clearSuccessTimer();

    this.successTimer = setTimeout(() => {
      if (this.destroyed) return;
      this.active.set(false);
      this.successTimer = null;
    }, this.successDuration());
  }

  private clearSuccessTimer(): void {
    if (this.successTimer) {
      clearTimeout(this.successTimer);
      this.successTimer = null;
    }
  }
}
