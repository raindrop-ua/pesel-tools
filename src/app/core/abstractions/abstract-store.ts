import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { Storage } from '@services/storage.service';

export abstract class AbstractStore<T> {
  protected readonly _data: WritableSignal<T[]>;
  readonly data: Signal<T[]>;
  readonly hasData: Signal<boolean>;

  protected constructor(
    protected storage: Storage,
    protected readonly storageKey: string,
  ) {
    const initial = this.storage.getItem<T[]>(storageKey) ?? [];
    this._data = signal(initial);
    this.data = computed(() => this._data());
    this.hasData = computed(() => this._data().length > 0);
  }

  add(item: T) {
    const updated = [item, ...this._data()];
    this._update(updated);
  }

  remove(item: T) {
    const updated = this._data().filter((i) => !this.equals(i, item));
    this._update(updated);
  }

  clear() {
    this._update([]);
  }

  protected abstract equals(a: T, b: T): boolean;

  private _update(updated: T[]) {
    this._data.set(updated);
    this.storage.setItem(this.storageKey, updated);
  }
}
