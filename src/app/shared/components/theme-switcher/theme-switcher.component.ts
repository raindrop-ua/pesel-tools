import { Component, inject, signal } from '@angular/core';
import { Theme, ThemeService } from '../../../core/services/theme.service';

const themes = [
  { id: 'light', label: 'Light', icon: '🌞' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'system', label: 'System', icon: '💻' },
] as const;

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
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
