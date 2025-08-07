import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => {
        const seo = data['seo'];
        if (!seo) return;
        this.update(seo);
      });
  }

  update(seo: { title?: string; description?: string; keywords?: string }) {
    if (seo.title) this.title.setTitle(seo.title);
    if (seo.description) {
      this.meta.updateTag({ name: 'description', content: seo.description });
    }
    if (seo.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seo.keywords });
    }
  }
}
