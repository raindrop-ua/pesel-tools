import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidDate } from '../../services/pesel-utils';

/**
 * Validator for day/month/year group to ensure the date is valid.
 */
export function validDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!group.get) return null;

    const day = Number(group.get('day')?.value);
    const month = Number(group.get('month')?.value);
    const year = Number(group.get('year')?.value);

    if (!day || !month || !year) {
      return null; // don't validate if fields are missing
    }

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      month < 1 ||
      month > 12 ||
      year < 1800 ||
      year > 2299
    ) {
      return { invalidDate: true };
    }

    if (!isValidDate(year, month, day)) {
      return { invalidDate: true };
    }

    return null;
  };
}
