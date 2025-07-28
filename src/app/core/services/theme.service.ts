import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';

/**
 * A service to manage theme switching, including support for "light", "dark", and "system" themes.
 * Persists the theme in localStorage and sets a cookie for SSR compatibility.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private readonly DEFAULT_THEME: Theme = 'system';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mediaQueryList: MediaQueryList | null = null;

  private currentThemeSubject = new BehaviorSubject<Theme>(this.DEFAULT_THEME);

  /** Observable that emits the current theme whenever it changes. */
  readonly theme$ = this.currentThemeSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQueryList.addEventListener('change', () => {
        if (this.currentThemeSubject.value === 'system') {
          this.applySystemTheme();
        }
      });
    }
  }

  /**
   * Initializes the theme from localStorage or defaults to "system".
   * Should be called from the root component on app startup.
   */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme, false);
  }

  /**
   * Sets the theme and optionally updates the cookie for SSR use.
   * @param theme The theme to apply.
   * @param updateCookie Whether to update the theme cookie. Defaults to true.
   */
  setTheme(theme: Theme, updateCookie = true): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentThemeSubject.next(theme);

    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch {
      // localStorage might be unavailable in private mode or due to security settings
    }

    if (updateCookie) {
      this.setThemeCookie(theme);
    }

    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      this.applySystemTheme();
    }
  }

  /**
   * Applies the system theme based on the user's OS preference.
   */
  private applySystemTheme(): void {
    if (!this.mediaQueryList) return;

    const prefersDark = this.mediaQueryList.matches;
    const systemTheme = prefersDark ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', systemTheme);
    this.currentThemeSubject.next('system');
  }

  /**
   * Retrieves the saved theme from localStorage.
   * Defaults to "system" if not found or invalid.
   * @returns The saved theme.
   */
  private getSavedTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return this.DEFAULT_THEME;

    try {
      const stored = localStorage.getItem(this.THEME_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // Ignore storage access errors
    }

    return this.DEFAULT_THEME;
  }

  /**
   * Stores the theme in a cookie (for SSR or future page loads).
   * @param theme The theme to store.
   */
  private setThemeCookie(theme: Theme): void {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    document.cookie = `theme=${theme}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }
}
