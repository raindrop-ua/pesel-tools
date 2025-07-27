import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PeselStoreService {
  private readonly STORAGE_KEY = 'pesel-list';
  private readonly _pesels = signal<string[]>(this.load());

  readonly pesels = computed(() => this._pesels());
  readonly hasPesels = computed(() => this._pesels().length > 0);

  add(pesel: string) {
    const updated = [...this._pesels(), pesel];
    this._pesels.set(updated);
    this.save(updated);
  }

  remove(pesel: string) {
    const updated = this._pesels().filter((p) => p !== pesel);
    this._pesels.set(updated);
    this.save(updated);
  }

  clear() {
    this._pesels.set([]);
    this.save([]);
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
}
