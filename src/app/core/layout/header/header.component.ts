import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DestroyRef,
  HostListener,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NAVIGATION_TOKEN } from '@core/config/navigation.config';
import { ThemeSwitcherComponent } from '@core/components/theme-switcher/theme-switcher.component';
import { AppRouteEnum } from '@core/enums/app-route.enum';
import { filter} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ThemeSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  public navigation = inject(NAVIGATION_TOKEN);
  public menuOpen = signal(false);

  ngOnInit() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

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
  public onResize(): void {
    this.menuOpen.set(false);
  }

  protected readonly AppRouteEnum = AppRouteEnum;
}
