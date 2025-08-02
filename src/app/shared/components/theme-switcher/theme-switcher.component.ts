import { Component, inject, signal } from '@angular/core';
import { Theme, ThemeService } from '@services/theme.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

const themes = [
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
  { id: 'system', label: 'System', icon: 'laptop' },
] as const;

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
  imports: [SvgIconComponent],
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);
  readonly currentTheme = signal<Theme>('system');

  constructor() {
    this.themeService.theme$.subscribe((theme) => this.currentTheme.set(theme));
    this.themeService.init();
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  readonly themes = themes;
}
