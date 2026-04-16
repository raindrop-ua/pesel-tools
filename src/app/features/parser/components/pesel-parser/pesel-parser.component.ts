import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PeselInfo, PeselParserService } from '@services/pesel-parser.service';
import { PeselInputComponent } from '@features/parser/components/pesel-input/pesel-input.component';
import { ResultOutputComponent } from '@features/parser/components/result-output/result-output.component';
import { peselValidator } from '@shared/validators/pesel.validator';

@Component({
  selector: 'app-pesel-parser',
  imports: [PeselInputComponent, ReactiveFormsModule, ResultOutputComponent],
  templateUrl: './pesel-parser.component.html',
  styleUrl: './pesel-parser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselParserComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly peselParser = inject(PeselParserService);
  public readonly parsedData = signal<Omit<PeselInfo, 'message'> | null>(null);
  public readonly form = this.fb.group({
    pesel: ['', [Validators.required, peselValidator(this.peselParser)]],
  });

  get peselControl() {
    return this.form.get('pesel');
  }

  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const pesel = params.get('pesel');

        if (!pesel) return;

        this.form.patchValue({ pesel });
        this.updateParsedData(pesel);
      });

    this.peselControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.updateParsedData(value);
      });
  }

  public onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text')?.trim() ?? '';
    if (/^\d{11}$/.test(pasted)) {
      this.form.patchValue({ pesel: pasted });
    }
  }

  private updateParsedData(value: string | null | undefined): void {
    if (this.peselControl?.valid && value) {
      this.parsedData.set(this.peselParser.parsePesel(value));
      return;
    }

    this.parsedData.set(null);
  }
}
