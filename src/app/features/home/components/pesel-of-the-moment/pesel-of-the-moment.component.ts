import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PeselGeneratorService } from '../../../../core/services/pesel-generator.service';
import { interval } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {CopyButtonComponent} from '../../../../shared/components/copy-button/copy-button.component';

@Component({
  selector: 'app-pesel-of-the-moment',
  imports: [
    AsyncPipe,
    CopyButtonComponent
  ],
  templateUrl: './pesel-of-the-moment.component.html',
  styleUrl: './pesel-of-the-moment.component.scss'
})
export class PeselOfTheMomentComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly peselGenerator: PeselGeneratorService = inject(PeselGeneratorService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pesel = signal<string>('Generating...');

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.pesel.set(this.peselGenerator.generatePesel());

    interval(10_000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('[PeselOfTheMomentComponent] Generating new PESEL');
        this.pesel.set(this.peselGenerator.generatePesel());
      });
  }
}
