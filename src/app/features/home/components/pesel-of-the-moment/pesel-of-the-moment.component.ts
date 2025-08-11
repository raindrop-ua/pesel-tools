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
import { CopyButtonComponent } from '@components/copy-button/copy-button.component';

@Component({
  selector: 'app-pesel-of-the-moment',
  imports: [CopyButtonComponent],
  templateUrl: './pesel-of-the-moment.component.html',
  styleUrl: './pesel-of-the-moment.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselOfTheMomentComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly peselGen = inject(PeselGeneratorService);
  private readonly destroyRef = inject(DestroyRef);

  readonly digits = signal<number[]>(Array(11).fill(0));
  readonly peselToCopy = signal<string>('');

  public ngOnInit() {
    this.initGeneration();
  }

  private initGeneration() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.generateAndApply();

    interval(5_000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.generateAndApply();
        }),
      )
      .subscribe();
  }

  private generateAndApply() {
    const pesel = this.peselGen.generatePesel();
    this.peselToCopy.set(pesel);
    this.animateTo(pesel);
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
