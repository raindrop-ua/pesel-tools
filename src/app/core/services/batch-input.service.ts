import { Injectable } from '@angular/core';
import { BatchFormat } from '@core/validation/pesel-batch';

/** One-time, in-memory hand-off from test data to the batch checker. */
@Injectable({ providedIn: 'root' })
export class BatchInputService {
  private pending: { text: string; format: BatchFormat } | null = null;

  set(value: { text: string; format: BatchFormat }): void {
    this.pending = value;
  }
  take(): { text: string; format: BatchFormat } | null {
    const value = this.pending;
    this.pending = null;
    return value;
  }
}
