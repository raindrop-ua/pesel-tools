/// <reference lib="webworker" />
import { generatePeselBatch } from './pesel-generation';
import type {
  GenerationRequest,
  GenerationResponse,
} from './pesel-worker.protocol';

addEventListener('message', ({ data }: MessageEvent<GenerationRequest>) => {
  let response: GenerationResponse;
  try {
    response = {
      ok: true,
      pesels: generatePeselBatch(data.count, data.options, data.existing),
    };
  } catch (error) {
    response = {
      ok: false,
      message: error instanceof Error ? error.message : 'Generation failed.',
    };
  }
  postMessage(response);
});
