import {
  Injectable,
  computed,
  signal,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PeselStoreService {
  private readonly STORAGE_KEY = 'pesel-list';
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _pesels = signal<string[]>(
    isPlatformBrowser(this.platformId) ? this.load() : [],
  );

  readonly pesels = computed(() => this._pesels());
  readonly hasPesels = computed(() => this._pesels().length > 0);

  add(pesel: string) {
    const updated = [pesel, ...this._pesels()];
    this._pesels.set(updated);
    if (isPlatformBrowser(this.platformId)) {
      this.save(updated);
    }
  }

  remove(pesel: string) {
    const updated = this._pesels().filter((p) => p !== pesel);
    this._pesels.set(updated);
    if (isPlatformBrowser(this.platformId)) {
      this.save(updated);
    }
  }

  clear() {
    this._pesels.set([]);
    if (isPlatformBrowser(this.platformId)) {
      this.save([]);
    }
  }

  private load(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Failed to load pesel list:', e);
        return [];
      }
    }
    return [];
  }

  private save(pesels: string[]) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pesels));
      } catch (e) {
        console.error('Failed to save pesel list:', e);
      }
    }
  }
}
