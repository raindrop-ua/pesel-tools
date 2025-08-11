import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PasteButtonComponent } from '@components/paste-button/paste-button.component';
import { ActionResult } from '@components/toolbar-button/toolbar-action';

@Component({
  selector: 'app-pesel-input',
  standalone: true,
  imports: [PasteButtonComponent],
  templateUrl: './pesel-input.component.html',
  styleUrls: ['./pesel-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PeselInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselInputComponent implements ControlValueAccessor {
  public readonly placeholder = input<string>('');

  public value = '';
  public disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(value: string): void {
    this.value = value ?? '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
  }

  public onPasteResult(res: ActionResult<string>): void {
    if (res.ok && res.data) {
      this.value = res.data;
      this.onChange(res.data);
    }
  }

  public onBlur(): void {
    this.onTouched();
  }
}
