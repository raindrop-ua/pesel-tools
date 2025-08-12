import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  private readonly swUpdate = inject(SwUpdate);

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.subscribe((evt) => {
      if (evt.type === 'VERSION_READY') {
        const ok = confirm('An update is available. Update now?');
        if (ok) location.reload();
      }
    });

    setInterval(() => this.swUpdate.checkForUpdate(), 60_000);
  }
}
