import {
  Injectable,
  Inject,
  PLATFORM_ID,
  computed,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PeselStoreService {
  private readonly STORAGE_KEY = 'pesel-list';

  private readonly _pesels: WritableSignal<string[]>;

  readonly pesels: Signal<string[]>;
  readonly hasPesels: Signal<boolean>;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    const initial = this.isBrowser() ? this.load() : [];
    this._pesels = signal(initial);
    this.pesels = computed(() => this._pesels());
    this.hasPesels = computed(() => this._pesels().length > 0);
  }

  add(pesel: string) {
    const updated = [pesel, ...this._pesels()];
    this._pesels.set(updated);
    if (this.isBrowser()) {
      this.save(updated);
    }
  }

  remove(pesel: string) {
    const updated = this._pesels().filter((p) => p !== pesel);
    this._pesels.set(updated);
    if (this.isBrowser()) {
      this.save(updated);
    }
  }

  clear() {
    this._pesels.set([]);
    if (this.isBrowser()) {
      this.save([]);
    }
  }

  private load(): string[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load pesel list:', e);
      return [];
    }
  }

  private save(pesels: string[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pesels));
    } catch (e) {
      console.error('Failed to save pesel list:', e);
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && isPlatformBrowser(this.platformId);
  }
}
