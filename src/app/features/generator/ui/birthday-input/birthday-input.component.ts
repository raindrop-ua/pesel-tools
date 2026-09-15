import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { RadioSelectComponent } from '@features/generator/ui/radio-select/radio-select.component';
import { ValueInputComponent } from '@features/generator/ui/value-input/value-input.component';

@Component({
  selector: 'app-birthday-input',
  imports: [RadioSelectComponent, ReactiveFormsModule, ValueInputComponent],
  templateUrl: './birthday-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayInputComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) formGroup!: FormGroup;
  @ViewChild('dayComp') dayComp!: ValueInputComponent;
  @ViewChild('monthComp') monthComp!: ValueInputComponent;
  @ViewChild('yearComp') yearComp!: ValueInputComponent;

  public ngAfterViewInit() {
    this.formGroup
      .get('day')!
      .valueChanges.pipe(
        filter((v: string) => v.length === 2),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.monthComp.focus());

    this.formGroup
      .get('month')!
      .valueChanges.pipe(
        filter((v: string) => v.length === 2),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.yearComp.focus());
  }
}
