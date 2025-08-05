import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [HeaderComponent, LoaderComponent, RouterOutlet, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements AfterViewInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private loadingTimeout: ReturnType<typeof setTimeout> | undefined;
  public loading = signal(false);

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
      this.loading.set(true);
    }, 200);
  }

  private stopLoading(): void {
    clearTimeout(this.loadingTimeout);
    setTimeout(() => {
      this.loading.set(false);
    }, 200);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
