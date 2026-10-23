import {
  Component,
  computed,
  DestroyRef,
  inject,
  linkedSignal,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SectionComponent } from '@layout/section/section.component';
import { CardComponent } from '@shared/ui/card/card.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { CopyButtonComponent } from '@shared/ui/toolbar/copy-button/copy-button.component';
import { BatchInputService } from '@services/batch-input.service';
import { DownloadService } from '@services/download.service';
import {
  BatchFormat,
  BatchRow,
  batchResultsCsv,
  parseBatchInput,
  validatePeselBatch,
} from '@core/validation/pesel-batch';
import { PESEL_ISSUE_LABELS } from '@core/validation/pesel-inspection';

type ResultFilter = 'all' | 'valid' | 'invalid' | 'duplicates';

@Component({
  selector: 'app-batch',
  imports: [
    SectionComponent,
    CardComponent,
    ButtonComponent,
    CopyButtonComponent,
    DecimalPipe,
  ],
  templateUrl: './batch.component.html',
  styleUrl: './batch.component.css',
})
export class BatchComponent implements OnInit {
  private readonly download = inject(DownloadService);
  private readonly transferred = inject(BatchInputService).take();
  private readonly destroyRef = inject(DestroyRef);
  private controller: AbortController | null = null;
  private fileVersion = 0;
  readonly text = signal(this.transferred?.text ?? '');
  readonly largeInput = computed(() => this.text().length > 20_000);
  readonly inputPreview = computed(() =>
    this.largeInput() ? this.text().slice(0, 5_000) : this.text(),
  );
  readonly format = signal<BatchFormat>(this.transferred?.format ?? 'list');
  readonly results = signal<BatchRow[]>([]);
  readonly busy = signal(false);
  readonly reading = signal(false);
  readonly working = computed(() => this.busy() || this.reading());
  readonly processed = signal(0);
  readonly total = signal(0);
  readonly error = signal('');
  readonly status = signal('');
  readonly fileName = signal('');
  readonly filter = signal<ResultFilter>('all');
  readonly filters = [
    { id: 'all', label: 'All' },
    { id: 'valid', label: 'Valid' },
    { id: 'invalid', label: 'Invalid' },
    { id: 'duplicates', label: 'Duplicates' },
  ] as const;
  readonly labels = PESEL_ISSUE_LABELS;
  readonly summary = computed(() =>
    this.results().reduce(
      (summary, row) => {
        if (row.valid) summary.valid++;
        else summary.invalid++;
        if (row.duplicateOf !== null) summary.duplicates++;
        return summary;
      },
      { valid: 0, invalid: 0, duplicates: 0 },
    ),
  );
  readonly filtered = computed(() =>
    this.results().filter((row) => {
      switch (this.filter()) {
        case 'valid':
          return row.valid;
        case 'invalid':
          return !row.valid;
        case 'duplicates':
          return row.duplicateOf !== null;
        default:
          return true;
      }
    }),
  );
  readonly page = linkedSignal(() => {
    this.filtered();
    return 0;
  });
  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / 50)),
  );
  readonly visible = computed(() =>
    this.filtered().slice(this.page() * 50, (this.page() + 1) * 50),
  );
  readonly textToCopy = computed(() =>
    this.filtered()
      .map((row) => row.pesel)
      .join('\n'),
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.controller?.abort();
      this.fileVersion++;
    });
  }

  ngOnInit(): void {
    if (this.transferred) void this.validate();
  }

  setText(value: string): void {
    this.text.set(value);
    this.fileName.set('');
    this.results.set([]);
    this.error.set('');
    this.status.set('');
  }

  onPaste(event: ClipboardEvent): void {
    if (this.working() || this.largeInput()) return;
    const pasted = event.clipboardData?.getData('text/plain');
    if (!pasted) return;
    const input = event.target as HTMLTextAreaElement;
    const next =
      input.value.slice(0, input.selectionStart) +
      pasted +
      input.value.slice(input.selectionEnd);
    if (next.length > 20_000) {
      event.preventDefault();
      this.setText(next);
    }
  }

  setFormat(value: string): void {
    this.format.set(value === 'csv' ? 'csv' : 'list');
    this.results.set([]);
    this.error.set('');
    this.status.set('');
  }

  async readFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.setText('');
    this.fileName.set('');
    if (file.size > 5_000_000) {
      this.error.set('Choose a file up to 5 MB.');
      return;
    }
    const version = ++this.fileVersion;
    this.reading.set(true);
    try {
      const value = await file.text();
      if (version !== this.fileVersion || this.destroyRef.destroyed) return;
      this.setText(value);
      this.format.set(
        file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'list',
      );
      this.fileName.set(file.name);
    } catch {
      if (version === this.fileVersion)
        this.error.set(
          'This file could not be read. Try a UTF-8 CSV or text file.',
        );
    } finally {
      if (version === this.fileVersion) this.reading.set(false);
    }
  }

  async validate(): Promise<void> {
    if (this.working()) return;
    this.results.set([]);
    this.error.set('');
    this.status.set('');
    let values: string[];
    try {
      values = parseBatchInput(this.text(), this.format());
    } catch (error) {
      this.error.set(
        error instanceof Error ? error.message : 'Could not read the input.',
      );
      return;
    }
    const controller = new AbortController();
    this.controller = controller;
    this.busy.set(true);
    this.processed.set(0);
    this.total.set(values.length);
    try {
      const results = await validatePeselBatch(
        values,
        controller.signal,
        (count) => this.processed.set(count),
      );
      if (!controller.signal.aborted) {
        this.results.set(results);
        this.filter.set('all');
        this.status.set(
          `Checked ${results.length.toLocaleString('en-US')} ${results.length === 1 ? 'row' : 'rows'}. ${results.filter((row) => row.valid).length.toLocaleString('en-US')} valid.`,
        );
      }
    } catch (error) {
      if (!controller.signal.aborted)
        this.error.set(
          error instanceof Error ? error.message : 'Validation failed.',
        );
    } finally {
      if (this.controller === controller) {
        this.busy.set(false);
        this.controller = null;
      }
    }
  }

  cancel(): void {
    this.controller?.abort();
    this.controller = null;
    this.busy.set(false);
    this.status.set('Validation cancelled. No partial results were kept.');
  }

  clear(): void {
    this.cancel();
    this.fileVersion++;
    this.reading.set(false);
    this.setText('');
    this.fileName.set('');
  }

  sample(): void {
    this.format.set('csv');
    this.fileName.set('');
    this.setText(
      'label,pesel\nValid,82090500017\nWrong checksum,82090500001\nDuplicate,82090500017\nInvalid date,82023000005\nWrong format,123',
    );
    void this.validate();
  }

  exportCsv(): void {
    this.download.downloadText(
      batchResultsCsv(this.filtered()),
      'pesel-validation.csv',
      'text/csv;charset=utf-8',
      true,
    );
  }
  exportJson(): void {
    this.download.downloadJson(
      this.filtered().map(
        ({
          row,
          pesel,
          valid,
          issues,
          birthDate,
          sex,
          serial,
          duplicateOf,
        }) => ({
          row,
          pesel,
          valid,
          issues,
          birthDate,
          sex,
          serial,
          duplicateOf,
        }),
      ),
      'pesel-validation.json',
      2,
    );
  }
}
