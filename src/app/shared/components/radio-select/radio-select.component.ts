import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioOption<T> {
  label: string;
  name: string;
  value: T;
}

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioSelectComponent<T = string> implements ControlValueAccessor {
  @Input() options: RadioOption<T>[] = [];
  @Input() value!: T;
  @Output() valueChange = new EventEmitter<T>();
  public disabled = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (val: T) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  selectOption(opt: RadioOption<T>) {
    if (this.disabled) return;
    this.value = opt.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.onTouched();
  }

  writeValue(val: T): void {
    this.value = val;
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
