import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Storage {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, data: T): void;
  removeItem(key: string): void;
  clear(): void;
}

@Injectable({ providedIn: 'root' })
export class StorageService implements Storage {
  private platformId = inject(PLATFORM_ID);
  private isBrowser() {
    return typeof window !== 'undefined' && isPlatformBrowser(this.platformId);
  }

  public getItem<T>(key: string): T | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (e) {
      console.error('Failed to load data:', e);
      return null;
    }
  }

  public setItem<T>(key: string, data: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  public removeItem(key: string): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove data:', e);
    }
  }

  public clear(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear data:', e);
    }
  }
}
