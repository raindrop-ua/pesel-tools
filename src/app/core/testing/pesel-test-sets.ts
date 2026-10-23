import { calculateChecksumDigit } from '@services/pesel-utils';
import { csvCell } from '@core/validation/pesel-batch';
import { PeselIssue } from '@core/validation/pesel-inspection';

export interface PeselTestCase {
  scenario: string;
  pesel: string;
  expectedValid: boolean;
  expectedIssues: PeselIssue[];
}

function dateCase(
  scenario: string,
  year: number,
  month: number,
  day: number,
  serial: string,
  valid = true,
): PeselTestCase {
  const offset = [80, 0, 20, 40, 60][Math.floor(year / 100) - 18];
  const body =
    String(year % 100).padStart(2, '0') +
    String(month + offset).padStart(2, '0') +
    String(day).padStart(2, '0') +
    serial;
  return {
    scenario,
    pesel: body + calculateChecksumDigit(body),
    expectedValid: valid,
    expectedIssues: valid ? [] : ['date'],
  };
}

const boundaries: PeselTestCase[] = [
  dateCase('Earliest supported date · female', 1800, 1, 1, '0000'),
  dateCase('End of the 1800s · male', 1899, 12, 31, '0001'),
  dateCase('Start of the 1900s', 1900, 1, 1, '0000'),
  dateCase('End of the 1900s', 1999, 12, 31, '9999'),
  dateCase('Start of the 2000s', 2000, 1, 1, '0000'),
  dateCase('Leap day in 2000 · male', 2000, 2, 29, '0001'),
  dateCase('End of the 2000s', 2099, 12, 31, '9998'),
  dateCase('Start of the 2100s', 2100, 1, 1, '0001'),
  dateCase('End of the 2100s', 2199, 12, 31, '0000'),
  dateCase('Start of the 2200s', 2200, 1, 1, '0001'),
  dateCase('Latest supported date', 2299, 12, 31, '9999'),
  dateCase(
    '1900 is not a leap year · correct checksum',
    1900,
    2,
    29,
    '0000',
    false,
  ),
  dateCase(
    '2100 is not a leap year · correct checksum',
    2100,
    2,
    29,
    '0001',
    false,
  ),
  dateCase(
    'April has no 31st day · correct checksum',
    2000,
    4,
    31,
    '0000',
    false,
  ),
  dateCase('Month 00 · correct checksum', 1982, 0, 5, '0001', false),
  dateCase('Month 13 · correct checksum', 1982, 13, 5, '0001', false),
];

const control = dateCase('Valid zero control digit', 1982, 9, 5, '0000');
const checksums: PeselTestCase[] = [
  control,
  ...[control, boundaries[0], boundaries[5]].map((item) => ({
    scenario: `Wrong control digit · ${item.scenario.toLowerCase()}`,
    pesel: item.pesel.slice(0, 10) + ((Number(item.pesel[10]) + 1) % 10),
    expectedValid: false,
    expectedIssues: ['checksum'] as PeselIssue[],
  })),
];

const formats: PeselTestCase[] = [
  ['Too short · 10 digits', '8209050001'],
  ['Too long · 12 digits', '820905000170'],
  ['Letter instead of a digit', '8209050001A'],
  ['Space inside the number', '820905 00017'],
  ['Full-width Unicode digits', '８２０９０５０００１７'],
  ['Empty field', ''],
].map(([scenario, pesel]) => ({
  scenario,
  pesel,
  expectedValid: false,
  expectedIssues: ['format'],
}));

export const PESEL_TEST_SETS = [
  {
    id: 'boundaries',
    label: 'Dates & centuries',
    description:
      'All five century encodings, range endpoints, leap years and impossible dates.',
    cases: boundaries,
  },
  {
    id: 'checksum',
    label: 'Checksum',
    description:
      'A valid zero control digit and deliberately changed control digits.',
    cases: checksums,
  },
  {
    id: 'format',
    label: 'Invalid formats',
    description:
      'Wrong lengths, letters, an internal space, Unicode digits and an empty field.',
    cases: formats,
  },
  {
    id: 'mixed',
    label: 'Mixed & duplicates',
    description:
      'Valid and invalid values plus a repeated number for testing duplicate detection.',
    cases: [
      boundaries[0],
      boundaries[5],
      checksums[1],
      boundaries[11],
      formats[0],
      { ...boundaries[0], scenario: 'Duplicate of the first row' },
    ],
  },
] as const;

export function testCasesCsv(cases: readonly PeselTestCase[]): string {
  return [
    ['scenario', 'pesel', 'expected_valid', 'expected_issues'],
    ...cases.map((item) => [
      item.scenario,
      item.pesel,
      item.expectedValid,
      item.expectedIssues.join('; '),
    ]),
  ]
    .map((row) => row.map(csvCell).join(','))
    .join('\r\n');
}
