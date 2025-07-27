import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  InvalidPeselChecksumError,
  InvalidPeselDateError,
  InvalidPeselFormatError,
  PeselParserService,
} from '../../core/services/pesel-parser.service';

export function peselValidatorFactory(parser: PeselParserService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    try {
      parser.parsePesel(value);
      return null;
    } catch (error) {
      if (error instanceof InvalidPeselFormatError) {
        return { peselInvalidFormat: true };
      }

      if (error instanceof InvalidPeselChecksumError) {
        return { peselInvalidChecksum: true };
      }

      if (error instanceof InvalidPeselDateError) {
        return { peselInvalidDate: true };
      }

      return { peselUnknownError: true };
    }
  };
}
