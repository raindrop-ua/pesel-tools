import {
  ApplicationRef,
  DestroyRef,
  Injectable,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import {
  EMPTY,
  catchError,
  exhaustMap,
  filter,
  from,
  interval,
  switchMap,
  take,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly application = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private latestHash: string | null = null;
  private readonly visible = signal(false);
  readonly updateAvailable = this.visible.asReadonly();
  readonly reloading = signal(false);
  readonly error = signal('');

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (
          event.type !== 'VERSION_READY' ||
          event.latestVersion.hash === this.latestHash
        )
          return;
        this.latestHash = event.latestVersion.hash;
        this.error.set('');
        this.visible.set(true);
      });

    // Start polling after hydration; ignore offline failures and overlapping checks.
    this.application.isStable
      .pipe(
        filter(Boolean),
        take(1),
        switchMap(() => interval(60_000)),
        exhaustMap(() =>
          from(this.swUpdate.checkForUpdate()).pipe(catchError(() => EMPTY)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  postpone(): void {
    if (this.reloading()) return;
    this.visible.set(false);
    this.error.set('');
  }

  reload(): void {
    const window = this.document.defaultView;
    if (!this.updateAvailable() || this.reloading() || !window) return;
    this.reloading.set(true);
    this.error.set('');
    try {
      // Reload switches the complete app to the new version, including lazy chunks.
      window.location.reload();
    } catch {
      this.reloading.set(false);
      this.error.set('Could not reload the page. Please try again.');
    }
  }
}
