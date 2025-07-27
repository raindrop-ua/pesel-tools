import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { BehaviorSubject } from "rxjs";

export type Theme = "light" | "dark" | "system";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly THEME_KEY = "theme";
  private readonly DEFAULT_THEME: Theme = "system";
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mediaQueryList: MediaQueryList | null = null;

  private currentThemeSubject = new BehaviorSubject<Theme>(this.DEFAULT_THEME);
  readonly theme$ = this.currentThemeSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
      this.mediaQueryList.addEventListener("change", () => {
        if (this.currentThemeSubject.value === "system") {
          this.applySystemTheme();
        }
      });
    }
  }

  init() {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme, false);
  }

  setTheme(theme: Theme, updateCookie = true) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentThemeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);

    if (updateCookie) {
      this.setThemeCookie(theme);
    }

    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      this.applySystemTheme();
    }
  }

  private applySystemTheme() {
    if (!this.mediaQueryList) return;

    const prefersDark = this.mediaQueryList.matches;
    const systemTheme = prefersDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", systemTheme);
    this.currentThemeSubject.next("system");
  }

  private getSavedTheme(): Theme {
    const storedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
      return storedTheme;
    }
    return this.DEFAULT_THEME;
  }

  private setThemeCookie(theme: Theme) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `theme=${theme}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }
}
