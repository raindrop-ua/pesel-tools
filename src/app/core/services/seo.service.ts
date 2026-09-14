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

const DEFAULT_OG_IMAGE = 'https://pesel.dev/og-image.png';
const DEFAULT_OG_IMAGE_ALT = 'Ultimate PESEL Tools';

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
    const title = seo.ogTitle ?? seo.title;
    const description = seo.ogDescription ?? seo.description;
    const image = seo.ogImage ?? DEFAULT_OG_IMAGE;

    if (seo.title) this.titleSrv.setTitle(seo.title);

    if (seo.description) {
      this.meta.updateTag({ name: 'description', content: seo.description });
    }

    if (seo.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seo.keywords });
    }

    if (title) {
      this.meta.updateTag({
        property: 'og:title',
        content: title,
      });
      this.meta.updateTag({ name: 'twitter:title', content: title });
    }

    if (description) {
      this.meta.updateTag({
        property: 'og:description',
        content: description,
      });
      this.meta.updateTag({
        name: 'twitter:description',
        content: description,
      });
    }

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({
      property: 'og:site_name',
      content: 'Ultimate PESEL Tools',
    });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:secure_url', content: image });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: DEFAULT_OG_IMAGE_ALT,
    });
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: DEFAULT_OG_IMAGE_ALT,
    });
  }
}
