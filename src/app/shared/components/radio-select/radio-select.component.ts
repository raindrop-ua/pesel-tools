import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-select',
  imports: [],
  templateUrl: './radio-select.component.html',
  styleUrl: './radio-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioSelectComponent),
      multi: true,
    },
  ],
})
export class RadioSelectComponent implements ControlValueAccessor {
  public value: 'male' | 'female' = 'female';
  public disabled = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: 'male' | 'female') => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  selectGender(gender: 'male' | 'female') {
    this.value = gender;
    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(value: 'male' | 'female'): void {
    this.value = value ?? 'female';
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
