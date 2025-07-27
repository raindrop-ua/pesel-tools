import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidDate } from '../../services/pesel-utils';

/**
 * Validator for day/month/year group to ensure the date is valid.
 */
export function validDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const day = control.get('day')?.value;
    const month = control.get('month')?.value;
    const year = control.get('year')?.value;

    console.log(day, month, year);

    if (!day || !month || !year) {
      return null; // don't validate if fields are missing
    }

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (!isValidDate(yearNum, monthNum, dayNum)) {
      return { invalidDate: true };
    }

    return null;
  };
}
