import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterOutlet,
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [HeaderComponent, LoaderComponent, RouterOutlet, FooterComponent],
})
export class LayoutComponent implements AfterViewInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private loadingTimeout: ReturnType<typeof setTimeout> | undefined;
  public loading = false;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.startLoading();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.stopLoading();
      }
    });
  }

  private startLoading(): void {
    this.loadingTimeout = setTimeout(() => {
      this.loading = true;
      this.blockBodyScroll(true);
    }, 200);
  }

  private stopLoading(): void {
    clearTimeout(this.loadingTimeout);
    setTimeout(() => {
      this.loading = false;
      this.blockBodyScroll(false);
    }, 200);
  }

  private blockBodyScroll(block: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    if (block) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
