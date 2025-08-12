import { Injectable, DestroyRef, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleSrv = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
        map((data) => data['seo'] as SeoData | undefined),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((seo) => {
        if (seo) this.update(seo);
      });
  }

  public update(seo: SeoData): void {
    if (seo.title) this.titleSrv.setTitle(seo.title);

    if (seo.description) {
      this.meta.updateTag({ name: 'description', content: seo.description });
    }

    if (seo.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seo.keywords });
    }

    if (seo.ogTitle ?? seo.title) {
      this.meta.updateTag({
        property: 'og:title',
        content: seo.ogTitle ?? seo.title!,
      });
    }

    if (seo.ogDescription ?? seo.description) {
      this.meta.updateTag({
        property: 'og:description',
        content: seo.ogDescription ?? seo.description!,
      });
    }

    if (seo.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: seo.ogImage });
    }
  }
}
