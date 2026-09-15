import type { PeselGenerationOptions } from './pesel-generation';

export interface GenerationRequest {
  count: number;
  options?: PeselGenerationOptions;
  existing: string[];
}
export type GenerationResponse =
  | { ok: true; pesels: string[] }
  | { ok: false; message: string };
