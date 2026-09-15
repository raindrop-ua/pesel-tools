import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { PeselGeneratorService } from '@services/pesel-generator.service';
import { StorageService } from '@services/storage.service';
import type { PeselGenerationOptions } from '@core/generation/pesel-generation';

@Injectable()
export class GeneratorStateService {
  private readonly generator = inject(PeselGeneratorService);
  private readonly result = signal<string[]>([]);
  private readonly pending = signal(false);
  private readonly failure = signal<string | null>(null);
  private controller?: AbortController;
  readonly pesels = this.result.asReadonly();
  readonly busy = this.pending.asReadonly();
  readonly error = this.failure.asReadonly();

  constructor() {
    // Remove results persisted by older versions; new batches live only in memory.
    inject(StorageService).removeItem('pesel-list:v1');
    inject(DestroyRef).onDestroy(() => this.cancel());
  }

  async generate(
    count: number,
    options?: PeselGenerationOptions,
  ): Promise<void> {
    if (this.pending()) return;
    this.failure.set(null);
    this.result.set([]);
    const controller = new AbortController();
    this.controller = controller;
    this.pending.set(true);
    try {
      const batch = await this.generator.generateBatch(
        count,
        options,
        [],
        controller.signal,
      );
      if (!controller.signal.aborted) this.result.set(batch);
    } catch (error) {
      if (!controller.signal.aborted) {
        this.failure.set(
          error instanceof Error
            ? error.message
            : 'Generation failed. Please try again.',
        );
      }
    } finally {
      if (this.controller === controller) {
        this.controller = undefined;
        this.pending.set(false);
      }
    }
  }

  cancel(): void {
    this.controller?.abort();
    this.controller = undefined;
    this.pending.set(false);
  }

  clear(): void {
    this.cancel();
    this.failure.set(null);
    this.result.set([]);
  }
}
