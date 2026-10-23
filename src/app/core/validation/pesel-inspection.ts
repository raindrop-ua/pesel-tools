import {
  calculateChecksumDigit,
  decodePeselDate,
  isValidDate,
  isValidFormat,
  PESEL_CHECKSUM_WEIGHTS,
} from '@services/pesel-utils';

export type PeselIssue = 'format' | 'date' | 'checksum';

export const PESEL_ISSUE_LABELS: Record<PeselIssue, string> = {
  format: 'Must contain exactly 11 digits',
  date: 'Invalid encoded birthdate',
  checksum: 'Incorrect checksum',
};

export function inspectPesel(pesel: string) {
  const issues: PeselIssue[] = [];
  if (!isValidFormat(pesel)) {
    return {
      pesel,
      valid: false,
      issues: ['format'] as PeselIssue[],
      birthDate: null,
      date: null,
      sex: null,
      serial: null,
      checksum: null,
    };
  }
  const date = decodePeselDate(pesel.slice(0, 6));
  const dateValid =
    date !== null && isValidDate(date.year, date.month, date.day);
  const birthDate = dateValid
    ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
    : null;
  if (!dateValid) issues.push('date');
  const terms = PESEL_CHECKSUM_WEIGHTS.map((weight, index) => ({
    position: index + 1,
    digit: Number(pesel[index]),
    weight,
    product: Number(pesel[index]) * weight,
  }));
  const sum = terms.reduce((total, term) => total + term.product, 0);
  const expected = calculateChecksumDigit(pesel.slice(0, 10));
  const actual = Number(pesel[10]);
  if (expected !== actual) issues.push('checksum');
  return {
    pesel,
    valid: issues.length === 0,
    issues,
    birthDate,
    date,
    sex: Number(pesel[9]) % 2 === 0 ? ('female' as const) : ('male' as const),
    serial: pesel.slice(6, 10),
    checksum: { terms, sum, expected, actual },
  };
}

export type PeselInspection = ReturnType<typeof inspectPesel>;
