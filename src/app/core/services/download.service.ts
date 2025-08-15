import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  public downloadBlob(blob: Blob, fileName: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = URL.createObjectURL(blob);

    try {
      const a = this.doc.createElement('a');
      a.href = url;
      a.download = fileName;
      a.rel = 'noopener';
      a.style.display = 'none';
      this.doc.body.appendChild(a);
      a.click();
      this.doc.body.removeChild(a);
    } finally {
      setTimeout(() => URL.revokeObjectURL(url));
    }
  }

  public downloadJson<T>(
    data: T,
    fileName = 'data.json',
    pretty: number | boolean = 0,
    withBom = false,
  ): void {
    const space = typeof pretty === 'boolean' ? (pretty ? 2 : 0) : pretty;
    const json = JSON.stringify(data, null, space || undefined);
    const parts = withBom ? ['\ufeff', json] : [json];
    const blob = new Blob(parts, { type: 'application/json;charset=utf-8' });

    this.downloadBlob(blob, fileName);
  }

  public downloadText(
    text: string,
    fileName = 'file.txt',
    mime = 'text/plain;charset=utf-8',
    withBom = false,
  ): void {
    const parts = withBom ? ['\ufeff', text] : [text];
    const blob = new Blob(parts, { type: mime });
    this.downloadBlob(blob, fileName);
  }

  public downloadFrom$<T>(
    source$: Observable<T>,
    fileName: string,
    mapToText?: (v: T) => string,
  ): Observable<void> {
    return source$.pipe(
      take(1),
      tap((v) => {
        if (mapToText) {
          this.downloadText(mapToText(v), fileName);
        } else {
          this.downloadJson(v, fileName);
        }
      }),
      map(() => undefined),
    );
  }
}
