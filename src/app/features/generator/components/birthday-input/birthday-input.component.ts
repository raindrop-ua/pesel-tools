import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { RadioSelectComponent } from '@features/generator/components/radio-select/radio-select.component';
import { ValueInputComponent } from '@features/generator/components/value-input/value-input.component';

@Component({
  selector: 'app-birthday-input',
  imports: [RadioSelectComponent, ReactiveFormsModule, ValueInputComponent],
  templateUrl: './birthday-input.component.html',
  styleUrl: './birthday-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayInputComponent implements AfterViewInit {
  @Input({ required: true }) formGroup!: FormGroup;
  @ViewChild('dayComp') dayComp!: ValueInputComponent;
  @ViewChild('monthComp') monthComp!: ValueInputComponent;
  @ViewChild('yearComp') yearComp!: ValueInputComponent;

  public ngAfterViewInit() {
    this.formGroup
      .get('day')!
      .valueChanges.pipe(filter((v: string) => v.length === 2))
      .subscribe(() => this.monthComp.focus());

    this.formGroup
      .get('month')!
      .valueChanges.pipe(filter((v: string) => v.length === 2))
      .subscribe(() => this.yearComp.focus());
  }
}
