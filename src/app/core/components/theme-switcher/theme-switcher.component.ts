import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Theme, ThemeService } from '@services/theme.service';
import { SvgIconComponent } from '@core/components/svg-icon/svg-icon.component';

const themes = [
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
  { id: 'system', label: 'System', icon: 'laptop' },
] as const;

@Component({
  selector: 'app-theme-switcher',
  imports: [SvgIconComponent],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);
  readonly currentTheme = signal<Theme>('system');

  constructor() {
    this.themeService.theme$.subscribe((theme) => this.currentTheme.set(theme));
    this.themeService.init();
  }

  public setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  public readonly themes = themes;
}
