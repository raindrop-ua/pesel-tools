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
  icon = input.required<string>();
  activeIcon = input<string>('check');
  title = input.required<string>();
  activeTitle = input<string>('Done!');
  srText = input<string>('Action');
  srActiveText = input<string>('Done!');

  successDuration = input<number>(2000);
  disableWhileRunning = input<boolean>(true);
  disableWhileSuccess = input<boolean>(true);
  absolute = input<boolean>(false);

  active = signal(false);
  running = signal(false);
  externalDisabled = input<boolean>(false);
  isDisabled = signal(false);

  run = input.required<() => Promise<boolean>>();

  success = output<void>();
  clicked = output<void>();

  private successTimer: ReturnType<typeof setTimeout> | null = null;

  async handleClick() {
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
