import { Injectable } from '@angular/core';
import type { PeselGenerationOptions } from '../generation/pesel-generation';
import type {
  GenerationRequest,
  GenerationResponse,
} from '../generation/pesel-worker.protocol';

/** Each job owns a worker, so cancellation cannot interrupt another consumer. */
@Injectable({ providedIn: 'root' })
export class PeselGeneratorService {
  public generateBatch(
    count = 1,
    options?: PeselGenerationOptions,
    existing: string[] = [],
    signal?: AbortSignal,
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Generation cancelled.', 'AbortError'));
        return;
      }
      if (typeof Worker === 'undefined') {
        reject(
          new Error('Generation requires a browser with Web Worker support.'),
        );
        return;
      }
      const worker = new Worker(
        new URL('../generation/pesel.worker', import.meta.url),
        { type: 'module' },
      );
      const cleanup = () => {
        clearTimeout(timeout);
        signal?.removeEventListener('abort', abort);
        worker.terminate();
      };
      const fail = (error: Error) => {
        cleanup();
        reject(error);
      };
      const abort = () =>
        fail(new DOMException('Generation cancelled.', 'AbortError'));
      const timeout = setTimeout(
        () =>
          fail(new Error('Generation timed out. Please try a smaller batch.')),
        60_000,
      );
      signal?.addEventListener('abort', abort, { once: true });
      worker.onmessage = ({ data }: MessageEvent<GenerationResponse>) => {
        cleanup();
        if (data.ok) resolve(data.pesels);
        else reject(new Error(data.message));
      };
      worker.onerror = () =>
        fail(new Error('Could not run the generator. Please try again.'));
      worker.onmessageerror = () =>
        fail(new Error('Could not read the generated numbers.'));
      try {
        worker.postMessage({
          count,
          options,
          existing,
        } satisfies GenerationRequest);
      } catch (error) {
        fail(
          error instanceof Error
            ? error
            : new Error('Could not start generation.'),
        );
      }
    });
  }
}
