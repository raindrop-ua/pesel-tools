import {
  calculateChecksumDigit,
  isValidChecksum,
  isValidDate,
  isValidFormat,
} from '../services/pesel-utils';

export interface PeselGenerationOptions {
  year?: number;
  month?: number;
  day?: number;
  sex?: 'male' | 'female';
  serialMode?: 'random' | 'sequential';
}

export const MAX_BATCH_SIZE = 100_000;
const DAY_MS = 86_400_000;

export class InvalidBirthDateError extends Error {
  constructor() {
    super('Provided birth date is invalid.');
  }
}
export class InvalidDateRangeError extends Error {
  constructor() {
    super('PESEL supports only years between 1800 and 2299.');
  }
}
export class InvalidGenerationOptionsError extends Error {
  constructor(
    message = 'If birth date is provided, year, month, and day must all be specified.',
  ) {
    super(message);
  }
}
export class GenerationCapacityError extends Error {
  constructor(available: number) {
    super(`Only ${available} unique PESEL numbers remain for these options.`);
  }
}

/** Samples without replacement. Existing numbers are excluded before sampling,
 * so even the last available number can be found without collision retries. */
export function generatePeselBatch(
  count: number,
  options: PeselGenerationOptions = {},
  existing: readonly string[] = [],
  today = new Date(),
): string[] {
  if (!Number.isInteger(count) || count < 1 || count > MAX_BATCH_SIZE) {
    throw new InvalidGenerationOptionsError(
      `Choose a whole number between 1 and ${MAX_BATCH_SIZE}.`,
    );
  }
  if (
    options.sex !== undefined &&
    options.sex !== 'male' &&
    options.sex !== 'female'
  ) {
    throw new InvalidGenerationOptionsError('Sex must be male or female.');
  }
  if (
    options.serialMode !== undefined &&
    options.serialMode !== 'random' &&
    options.serialMode !== 'sequential'
  ) {
    throw new InvalidGenerationOptionsError(
      'Serial mode must be random or sequential.',
    );
  }
  const parts = [options.year, options.month, options.day];
  const specified = parts.filter((part) => part !== undefined).length;
  if (specified !== 0 && specified !== 3)
    throw new InvalidGenerationOptionsError();
  if (options.serialMode === 'sequential' && specified !== 3) {
    throw new InvalidGenerationOptionsError(
      'Sequential serial numbers require a birthdate.',
    );
  }
  let firstDay: number;
  let lastDay: number;
  if (specified === 3) {
    const { year, month, day } = options as Required<PeselGenerationOptions>;
    if (!isValidDate(year, month, day)) throw new InvalidBirthDateError();
    if (year < 1800 || year > 2299) throw new InvalidDateRangeError();
    firstDay = lastDay = Date.UTC(year, month - 1, day) / DAY_MS;
  } else {
    firstDay =
      Date.UTC(Math.max(1800, today.getFullYear() - 100), 0, 1) / DAY_MS;
    lastDay =
      Math.min(
        Date.UTC(2299, 11, 31),
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
      ) / DAY_MS;
    if (firstDay > lastDay) throw new InvalidDateRangeError();
  }
  const serialCount = options.sex === undefined ? 10_000 : 5_000;
  const parity = options.sex === 'male' ? 1 : 0;
  const total = (lastDay - firstDay + 1) * serialCount;
  const excluded = new Set<number>();
  for (const pesel of existing) {
    if (!isValidFormat(pesel) || !isValidChecksum(pesel)) continue;
    const encodedMonth = Number(pesel.slice(2, 4));
    const century = [1900, 2000, 2100, 2200, 1800][
      Math.floor(encodedMonth / 20)
    ];
    const year = century + Number(pesel.slice(0, 2));
    const month = encodedMonth % 20;
    const day = Number(pesel.slice(4, 6));
    if (!isValidDate(year, month, day)) continue;
    const dateIndex = Date.UTC(year, month - 1, day) / DAY_MS - firstDay;
    const serial = Number(pesel.slice(6, 10));
    if (dateIndex < 0 || dateIndex > lastDay - firstDay) continue;
    if (options.sex !== undefined && serial % 2 !== parity) continue;
    excluded.add(
      dateIndex * serialCount +
        (options.sex === undefined ? serial : Math.floor(serial / 2)),
    );
  }
  const blocked = [...excluded].sort((a, b) => a - b);
  const available = total - blocked.length;
  if (count > available) throw new GenerationCapacityError(available);

  // Sparse Fisher–Yates uses O(count) memory, without allocating the whole domain.
  const swaps = new Map<number, number>();
  const result: string[] = [];
  for (let remaining = available; result.length < count; remaining--) {
    let rank = result.length;
    if (options.serialMode !== 'sequential') {
      const position = Math.floor(Math.random() * remaining);
      rank = swaps.get(position) ?? position;
      swaps.set(position, swaps.get(remaining - 1) ?? remaining - 1);
      swaps.delete(remaining - 1);
    }
    // Convert the available rank into its original index, skipping exclusions.
    let low = 0;
    let high = blocked.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (blocked[mid] - mid <= rank) low = mid + 1;
      else high = mid;
    }
    const index = rank + low;
    const date = new Date(
      (firstDay + Math.floor(index / serialCount)) * DAY_MS,
    );
    const year = date.getUTCFullYear();
    const monthOffset = [80, 0, 20, 40, 60][Math.floor(year / 100) - 18];
    const serialIndex = index % serialCount;
    const serial =
      options.sex === undefined ? serialIndex : serialIndex * 2 + parity;
    const body =
      String(year % 100).padStart(2, '0') +
      String(date.getUTCMonth() + 1 + monthOffset).padStart(2, '0') +
      String(date.getUTCDate()).padStart(2, '0') +
      String(serial).padStart(4, '0');
    result.push(body + calculateChecksumDigit(body));
  }
  return result;
}
