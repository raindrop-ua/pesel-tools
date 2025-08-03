import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PeselGeneratorService } from '@services/pesel-generator.service';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { CopyButtonComponent } from '@components/copy-button/copy-button.component';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-pesel-of-the-moment',
  imports: [CopyButtonComponent],
  templateUrl: './pesel-of-the-moment.component.html',
  styleUrl: './pesel-of-the-moment.component.scss',
  standalone: true,
})
export class PeselOfTheMomentComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly peselGen = inject(PeselGeneratorService);
  private readonly destroyRef = inject(DestroyRef);

  readonly digits = signal<number[]>(Array(11).fill(0));

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.animateTo(this.peselGen.generatePesel());

    interval(5_000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.animateTo(this.peselGen.generatePesel())),
      )
      .subscribe();
  }

  private animateTo(raw: string) {
    const target = /^\d{11}$/.test(raw)
      ? raw.split('').map(ch => +ch)
      : Array(11).fill(0);

    target.forEach((tgtDigit, idx) => {
      const arr = this.digits();
      const current = arr[idx];
      const steps = (tgtDigit - current + 10) % 10;
      if (steps === 0) return;

      interval(50)
        .pipe(
          take(steps + 1),
          map(i => (current + i) % 10),
          tap(val => {
            const newArr = [...this.digits()];
            newArr[idx] = val;
            this.digits.set(newArr);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }
}
