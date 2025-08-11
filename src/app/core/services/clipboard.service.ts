import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  async copy(text: string): Promise<boolean> {
    if (!text) return false;
    if (!isPlatformBrowser(this.platformId)) return false;

    try {
      if (
        navigator &&
        'clipboard' in navigator &&
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* empty */
    }

    try {
      const textarea = this.doc.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      this.doc.body.appendChild(textarea);
      textarea.select();
      const ok = this.doc.execCommand?.('copy') ?? false;
      this.doc.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }

  copy$(text: string): Observable<boolean> {
    return from(this.copy(text));
  }
}
