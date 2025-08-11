import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { SvgIconComponent } from '@core/components/svg-icon/svg-icon.component';

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

  public readonly active = signal(false);
  public readonly running = signal(false);
  public readonly externalDisabled = input<boolean>(false);
  public readonly isDisabled = signal(false);

  public readonly run = input.required<() => Promise<boolean>>();

  public readonly success = output<void>();
  public readonly clicked = output<void>();

  private successTimer: ReturnType<typeof setTimeout> | null = null;

  public async handleClick() {
    if (this.computeDisabled()) return;
    this.clicked.emit();

    try {
      if (this.disableWhileRunning()) this.setDisabled(true);
      this.running.set(true);

      const ok = await this.run()();

      if (ok) {
        this.active.set(true);
        this.success.emit();

        this.running.set(false);
        if (!this.disableWhileSuccess()) this.setDisabled(false);

        if (this.successTimer) clearTimeout(this.successTimer);
        this.successTimer = setTimeout(() => {
          this.active.set(false);
          if (this.disableWhileSuccess()) this.setDisabled(false);
          this.successTimer = null;
        }, this.successDuration());
      } else {
        this.running.set(false);
        this.setDisabled(false);
      }
    } catch {
      this.running.set(false);
      this.setDisabled(false);
    }
  }

  private computeDisabled(): boolean {
    return this.externalDisabled() || this.isDisabled() || this.running();
  }

  private setDisabled(v: boolean) {
    this.isDisabled.set(v);
  }
}
