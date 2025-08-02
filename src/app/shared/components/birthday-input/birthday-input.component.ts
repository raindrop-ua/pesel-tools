import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { RadioSelectComponent } from '../radio-select/radio-select.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ValueInputComponent } from '../value-input/value-input.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-birthday-input',
  imports: [RadioSelectComponent, ReactiveFormsModule, ValueInputComponent],
  templateUrl: './birthday-input.component.html',
  styleUrl: './birthday-input.component.scss',
})
export class BirthdayInputComponent implements AfterViewInit {
  @Input({ required: true }) formGroup!: FormGroup;
  @ViewChild('dayComp') dayComp!: ValueInputComponent;
  @ViewChild('monthComp') monthComp!: ValueInputComponent;
  @ViewChild('yearComp') yearComp!: ValueInputComponent;

  ngAfterViewInit() {
    this.formGroup.get('day')!.valueChanges
      .pipe(filter((v: string) => v.length === 2))
      .subscribe(() => this.monthComp.focus());

    this.formGroup.get('month')!.valueChanges
      .pipe(filter((v: string) => v.length === 2))
      .subscribe(() => this.yearComp.focus());
  }
}
