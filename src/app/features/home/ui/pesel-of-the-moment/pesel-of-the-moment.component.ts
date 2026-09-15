import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PLATFORM_ID } from '@angular/core';
import { PeselGeneratorService } from '@services/pesel-generator.service';
import { CopyButtonComponent } from '@shared/ui/toolbar/copy-button/copy-button.component';
import { ToolbarComponent } from '@shared/ui/toolbar/toolbar.component';

@Component({
  selector: 'app-pesel-of-the-moment',
  imports: [CopyButtonComponent, ToolbarComponent],
  templateUrl: './pesel-of-the-moment.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselOfTheMomentComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly peselGen = inject(PeselGeneratorService);
  private readonly destroyRef = inject(DestroyRef);

  private generating = false;
  private readonly controller = new AbortController();
  readonly generationError = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.controller.abort());
  }

  readonly digits = signal<number[]>(Array(11).fill(0));
  readonly peselToCopy = signal<string>('');

  public ngOnInit() {
    this.initGeneration();
  }

  private initGeneration() {
    if (!isPlatformBrowser(this.platformId)) return;

    void this.generateAndApply();

    interval(5_000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          void this.generateAndApply();
        }),
      )
      .subscribe();
  }

  private async generateAndApply(): Promise<void> {
    if (this.generating || this.controller.signal.aborted) return;
    this.generating = true;
    try {
      const [pesel] = await this.peselGen.generateBatch(
        1,
        undefined,
        [],
        this.controller.signal,
      );
      if (this.controller.signal.aborted) return;
      this.generationError.set(false);
      this.peselToCopy.set(pesel);
      this.animateTo(pesel);
    } catch {
      if (!this.controller.signal.aborted) this.generationError.set(true);
    } finally {
      this.generating = false;
    }
  }

  private animateTo(raw: string) {
    const target = /^\d{11}$/.test(raw)
      ? raw.split('').map((ch) => +ch)
      : Array(11).fill(0);

    target.forEach((targetDigit, index) => {
      const arr = this.digits();
      const current = arr[index];
      const steps = (targetDigit - current + 10) % 10;

      if (steps === 0) return;

      interval(50)
        .pipe(
          take(steps + 1),
          map((i) => (current + i) % 10),
          tap((val) => {
            const newArr = [...this.digits()];
            newArr[index] = val;
            this.digits.set(newArr);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }
}
