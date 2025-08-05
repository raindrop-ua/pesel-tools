import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NAVIGATION_TOKEN } from '@config/navigation.config';
import { ThemeSwitcherComponent } from '@core/components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ThemeSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  public navigation = inject(NAVIGATION_TOKEN);
  public menuOpen = signal(false);

  public isLinkActive(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });
  }

  public onMenuToggle() {
    this.menuOpen.update((value) => !value);
  }

  public onMenuClose() {
    this.menuOpen.set(false);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: UIEvent): void {
    const width = (event.target as Window).innerWidth;
    if (width > 767 && this.menuOpen) {
      this.menuOpen.set(false);
    }
  }
}
