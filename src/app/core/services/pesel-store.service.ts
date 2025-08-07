import { Injectable, inject } from '@angular/core';
import { AbstractStore } from '../abstractions/abstract-store';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PeselStoreService extends AbstractStore<string> {
  constructor() {
    super(inject(StorageService), 'pesel-list');
  }

  protected equals(a: string, b: string): boolean {
    return a === b;
  }
}
