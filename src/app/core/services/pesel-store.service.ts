import { Injectable, inject } from '@angular/core';
import { AbstractStore } from '../abstractions/abstract-store';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PeselStoreService extends AbstractStore<string> {
  constructor() {
    super(inject(StorageService), 'pesel-list:v1');
  }

  protected equals(a: string, b: string): boolean {
    return a === b;
  }

  public has(pesel: string): boolean {
    return this.data().includes(pesel);
  }

  public addIfAbsent(pesel: string): void {
    if (!this.has(pesel)) this.add(pesel);
  }
}
