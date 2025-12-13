import { Injectable, inject, ApplicationRef } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, race, timer } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

function appStableOnce(): Observable<void> {
  const appRef = inject(ApplicationRef);
  return appRef.isStable.pipe(
    filter(Boolean),
    first(),
    map(() => void 0),
  );
}

function afterFirstPaint(): Observable<void> {
  const fcp$ =
    typeof PerformanceObserver !== 'undefined'
      ? new Observable<void>((sub) => {
          try {
            const obs = new PerformanceObserver((list) => {
              const entry = list
                .getEntries()
                .find((e) => e.name === 'first-contentful-paint');
              if (entry) {
                obs.disconnect();
                sub.next();
                sub.complete();
              }
            });
            obs.observe({ type: 'paint', buffered: true });
          } catch {
            sub.next();
            sub.complete();
          }
        })
      : of(void 0);

  return race(fcp$, timer(2000).pipe(map(() => void 0)));
}

function inIdle<T>(work: () => Promise<T> | T): Promise<T> {
  return new Promise((resolve) => {
    const run = async () => resolve(await work());

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 0);
    }
  });
}

function canPreloadNow(): boolean {
  const nav = navigator as NavigatorWithConnection;
  if (nav?.connection?.saveData) return false;

  const type = nav?.connection?.effectiveType as string | undefined;
  return !(type && ['slow-2g', '2g'].includes(type));
}

@Injectable({ providedIn: 'root' })
export class AfterFirstPaintPreloadingStrategy implements PreloadingStrategy {
  private ready$ = race(appStableOnce(), afterFirstPaint()).pipe(first());

  public preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const mode = (route.data?.['preload'] ?? 'idle') as
      | 'eager'
      | 'idle'
      | false;

    if (mode === false) return of(null);

    return this.ready$.pipe(
      switchMap(() => {
        if (!canPreloadNow()) return of(null);
        if (mode === 'eager') return load();

        return new Observable((sub) => {
          inIdle(() => {
            const s = load().subscribe({
              next: (v) => sub.next(v),
              error: (e) => sub.error(e),
              complete: () => sub.complete(),
            });
            return () => s.unsubscribe();
          });
        });
      }),
    );
  }
}
