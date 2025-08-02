import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PeselGeneratorService } from '../../../../core/services/pesel-generator.service';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { CopyButtonComponent } from '../../../../shared/components/copy-button/copy-button.component';

@Component({
  selector: 'app-pesel-of-the-moment',
  imports: [CopyButtonComponent],
  templateUrl: './pesel-of-the-moment.component.html',
  styleUrl: './pesel-of-the-moment.component.scss'
})
export class PeselOfTheMomentComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly peselGenerator: PeselGeneratorService = inject(PeselGeneratorService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pesel = signal<string>('Generating...');
  readonly animated = signal(false);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.pesel.set(this.peselGenerator.generatePesel());

    interval(10_000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updatePesel()
      });
  }

  private updatePesel() {
    this.animated.set(true);

    requestAnimationFrame(() => {
      this.pesel.set(this.peselGenerator.generatePesel());

      setTimeout(() => {
        this.animated.set(false);
      }, 500);
    });
  }

}
