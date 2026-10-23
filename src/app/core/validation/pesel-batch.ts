import {
  inspectPesel,
  PESEL_ISSUE_LABELS,
  PeselInspection,
} from './pesel-inspection';

export const MAX_VALIDATION_ROWS = 100_000;
export const MAX_VALIDATION_CHARS = 5_000_000;
export type BatchFormat = 'list' | 'csv';
export type BatchRow = Pick<
  PeselInspection,
  'pesel' | 'valid' | 'issues' | 'birthDate' | 'sex' | 'serial'
> & { row: number; duplicateOf: number | null };

/** RFC-style quoted fields, escaped quotes and embedded newlines. */
function readCsv(text: string): string[][] {
  const firstLine = text.split(/\r?\n/, 1)[0];
  let quoted = false;
  const counts = new Map([
    [',', 0],
    [';', 0],
    ['\t', 0],
  ]);
  for (let index = 0; index < firstLine.length; index++) {
    const char = firstLine[index];
    if (char === '"') {
      if (quoted && firstLine[index + 1] === '"') index++;
      else quoted = !quoted;
    } else if (!quoted && counts.has(char))
      counts.set(char, counts.get(char)! + 1);
  }
  const delimiter = [...counts].sort((a, b) => b[1] - a[1])[0][0];
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let closedQuote = false;
  let rowUsed = false;
  quoted = false;
  const pushRow = () => {
    row.push(field.trim());
    if (rowUsed || row.some((value) => value !== '')) rows.push(row);
    if (rows.length > MAX_VALIDATION_ROWS + 1)
      throw new Error(
        `Use at most ${MAX_VALIDATION_ROWS.toLocaleString('en-US')} rows.`,
      );
    row = [];
    field = '';
    closedQuote = false;
    rowUsed = false;
  };
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (char !== '"') field += char;
      else if (text[index + 1] === '"') {
        field += '"';
        index++;
      } else {
        quoted = false;
        closedQuote = true;
      }
    } else if (char === delimiter) {
      rowUsed = true;
      row.push(field.trim());
      field = '';
      closedQuote = false;
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[index + 1] === '\n') index++;
      pushRow();
    } else if (char === '"' && !field.trim() && !closedQuote) {
      rowUsed = true;
      field = '';
      quoted = true;
    } else {
      if (char === '"' || (closedQuote && char.trim()))
        throw new Error('Malformed CSV. Check quotes and delimiters.');
      if (!closedQuote) field += char;
    }
  }
  if (quoted) throw new Error('Malformed CSV: a quoted field is not closed.');
  if (field || row.length || closedQuote) pushRow();
  return rows;
}

export function parseBatchInput(raw: string, format: BatchFormat): string[] {
  if (raw.length > MAX_VALIDATION_CHARS)
    throw new Error('Input is too large. Use at most 5 million characters.');
  const text = raw.replace(/^\uFEFF/, '').trim();
  if (!text) throw new Error('Add at least one PESEL to check.');
  let values: string[];
  if (format === 'list') {
    values = text.split(/[\s,;]+/).filter(Boolean);
  } else {
    const rows = readCsv(text);
    if (!rows.length) throw new Error('The CSV contains no data.');
    const columns = rows[0].map((value) => value.toLowerCase());
    const column = columns.indexOf('pesel');
    if (column >= 0) {
      if (columns.lastIndexOf('pesel') !== column)
        throw new Error('The CSV must have only one PESEL column.');
      values = rows.slice(1).map((row) => row[column] ?? '');
    } else {
      if (rows.some((row) => row.length !== 1))
        throw new Error('For multi-column CSV, add a header named PESEL.');
      values = rows.map((row) => row[0]);
    }
  }
  if (!values.length) throw new Error('Add at least one PESEL to check.');
  if (values.length > MAX_VALIDATION_ROWS)
    throw new Error(
      `Use at most ${MAX_VALIDATION_ROWS.toLocaleString('en-US')} rows.`,
    );
  return values;
}

export async function validatePeselBatch(
  values: readonly string[],
  signal: AbortSignal,
  onProgress: (processed: number) => void = () => {},
): Promise<BatchRow[]> {
  const seen = new Map<string, number>();
  const results: BatchRow[] = [];
  for (let index = 0; index < values.length; index++) {
    if (signal.aborted)
      throw new DOMException('Validation cancelled', 'AbortError');
    const pesel = values[index];
    const row = index + 1;
    const duplicateOf = seen.get(pesel) ?? null;
    if (duplicateOf === null) seen.set(pesel, row);
    const { valid, issues, birthDate, sex, serial } = inspectPesel(pesel);
    results.push({
      pesel,
      valid,
      issues,
      birthDate,
      sex,
      serial,
      row,
      duplicateOf,
    });
    if (row % 250 === 0 || row === values.length) {
      onProgress(row);
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
  }
  if (signal.aborted)
    throw new DOMException('Validation cancelled', 'AbortError');
  return results;
}

/** Preserve identifiers as strings and neutralize spreadsheet formulas. */
export function csvCell(value: unknown): string {
  const text = String(value ?? '');
  const safe = /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function batchResultsCsv(rows: readonly BatchRow[]): string {
  return [
    [
      'row',
      'pesel',
      'valid',
      'issues',
      'birthdate',
      'sex',
      'serial',
      'duplicate_of',
    ],
    ...rows.map((row) => [
      row.row,
      row.pesel,
      row.valid,
      row.issues.map((issue) => PESEL_ISSUE_LABELS[issue]).join('; '),
      row.birthDate,
      row.sex,
      row.serial,
      row.duplicateOf,
    ]),
  ]
    .map((row) => row.map(csvCell).join(','))
    .join('\r\n');
}
