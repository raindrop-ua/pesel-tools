import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-masthead',
  templateUrl: './masthead.component.html',
  styleUrl: './masthead.component.scss',
  standalone: true,
  imports: [NgOptimizedImage],
})
export class MastheadComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('masthead') mastheadRef!: ElementRef;
  @ViewChild('parallaxImg') imgRef!: ElementRef;

  private mouseMoveHandler?: (event: MouseEvent) => void;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || this.isTouchDevice()) return;

    const container = this.mastheadRef.nativeElement;
    const image = this.imgRef.nativeElement;

    this.mouseMoveHandler = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const maxTranslate = 15;
      const translateX = -offsetX * maxTranslate;

      image.style.transform = `translate(${translateX}px)`;
    };

    container.addEventListener('mousemove', this.mouseMoveHandler, {
      passive: true,
    });
  }

  ngOnDestroy(): void {
    if (this.mouseMoveHandler && this.mastheadRef?.nativeElement) {
      this.mastheadRef.nativeElement.removeEventListener(
        'mousemove',
        this.mouseMoveHandler,
      );
    }
  }

  private isTouchDevice(): boolean {
    return navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  }
}
