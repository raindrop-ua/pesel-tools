import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioOption } from '@components/radio-select/model/radio-option.interface';

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

  private onChange: (val: T) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(val: T): void {
    this.value = val;
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onSelect(opt: RadioOption<T>) {
    if (this.disabled) return;
    this.value = opt.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.onTouched();
  }
}
