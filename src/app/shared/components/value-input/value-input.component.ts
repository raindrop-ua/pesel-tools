import {
  Component,
  ElementRef,
  forwardRef,
  input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-value-input',
  imports: [],
  templateUrl: './value-input.component.html',
  styleUrl: './value-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValueInputComponent),
      multi: true,
    },
  ],
})
export class ValueInputComponent implements ControlValueAccessor {
  @ViewChild('nativeInput', { static: true })
  nativeInput!: ElementRef<HTMLInputElement>;
  public placeholder = input<string>('');

  public value = '';
  public disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
  }

  handleBlur(): void {
    this.onTouched();
  }

  focus(): void {
    this.nativeInput.nativeElement.focus();
  }
}
