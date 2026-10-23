import { Component, computed, input, linkedSignal } from '@angular/core';
import { inspectPesel } from '@core/validation/pesel-inspection';

type DigitGroup = 'year' | 'month' | 'day' | 'serial' | 'sex' | 'checksum';

@Component({
  selector: 'app-pesel-breakdown',
  templateUrl: './pesel-breakdown.component.html',
  styleUrl: './pesel-breakdown.component.css',
})
export class PeselBreakdownComponent {
  readonly pesel = input.required<string>();
  readonly inspection = computed(() => inspectPesel(this.pesel()));
  readonly selected = linkedSignal(() => {
    this.pesel();
    return 'year' as DigitGroup;
  });
  readonly groups = computed(() => {
    const value = this.pesel();
    const info = this.inspection();
    return [
      {
        id: 'year',
        label: 'Year',
        positions: '1–2',
        value: value.slice(0, 2),
        title: 'Birth year',
        detail: info.date
          ? `${value.slice(0, 2)} is the year within the ${info.date.century}s. The month code identifies the century: ${info.date.year}.`
          : 'The century cannot be decoded because the month code is invalid.',
      },
      {
        id: 'month',
        label: 'Month',
        positions: '3–4',
        value: value.slice(2, 4),
        title: 'Month & century',
        detail: info.date
          ? `${value.slice(2, 4)} − ${info.date.offset} = ${info.date.month}. The century offset is ${info.date.offset} for ${info.date.century}–${info.date.century + 99}.`
          : 'This month code is outside every supported range: 01–12, 21–32, 41–52, 61–72 or 81–92.',
      },
      {
        id: 'day',
        label: 'Day',
        positions: '5–6',
        value: value.slice(4, 6),
        title: 'Day of birth',
        detail: info.birthDate
          ? `Day ${Number(value.slice(4, 6))}. The complete encoded date is ${info.birthDate}.`
          : `Day code ${value.slice(4, 6)} does not form a valid calendar date with this year and month.`,
      },
      {
        id: 'serial',
        label: 'Sequence',
        positions: '7–9',
        value: value.slice(6, 9),
        title: 'Serial number',
        detail: `These three digits and the sex digit form the four-digit serial number: ${value.slice(6, 10)}. Leading zeros are part of the number.`,
      },
      {
        id: 'sex',
        label: 'Sex',
        positions: '10',
        value: value.slice(9, 10),
        title: 'Encoded sex',
        detail: `${value[9]} is ${info.sex === 'female' ? 'even' : 'odd'}: ${info.sex}. Even digits (including 0) encode female; odd digits encode male. This digit is also part of the serial number.`,
      },
      {
        id: 'checksum',
        label: 'Check',
        positions: '11',
        value: value.slice(10),
        title: 'Control digit',
        detail: info.checksum
          ? `The calculated control digit is ${info.checksum.expected}. The supplied digit is ${info.checksum.actual}: ${info.checksum.actual === info.checksum.expected ? 'they match' : 'they do not match'}.`
          : '',
      },
    ] satisfies {
      id: DigitGroup;
      label: string;
      positions: string;
      value: string;
      title: string;
      detail: string;
    }[];
  });
  readonly activeGroup = computed(
    () => this.groups().find((group) => group.id === this.selected())!,
  );
}
