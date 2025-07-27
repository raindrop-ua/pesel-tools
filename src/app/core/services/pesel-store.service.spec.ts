import { TestBed } from '@angular/core/testing';
import { PeselStoreService } from './pesel-store.service';
import { PLATFORM_ID } from '@angular/core';

describe('PeselStoreService (browser platform)', () => {
  let service: PeselStoreService;

  beforeEach(() => {
    const storage: Record<string, string> = {};
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => storage[key] || null,
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        storage[key] = value;
      },
    );

    TestBed.configureTestingModule({
      providers: [
        PeselStoreService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(PeselStoreService);
  });

  it('should start with an empty list', () => {
    expect(service.pesels()).toEqual([]);
    expect(service.hasPesels()).toBeFalse();
  });

  it('should add a pesel', () => {
    service.add('12345678901');
    expect(service.pesels()).toEqual(['12345678901']);
    expect(service.hasPesels()).toBeTrue();
  });

  it('should remove a pesel', () => {
    service.add('123');
    service.add('456');
    service.remove('123');
    expect(service.pesels()).toEqual(['456']);
  });

  it('should clear all pesels', () => {
    service.add('123');
    service.clear();
    expect(service.pesels()).toEqual([]);
    expect(service.hasPesels()).toBeFalse();
  });

  it('should save to localStorage on add', () => {
    service.add('999');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pesel-list',
      JSON.stringify(['999']),
    );
  });

  it('should save to localStorage on remove', () => {
    service.add('123');
    service.remove('123');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pesel-list',
      JSON.stringify([]),
    );
  });

  it('should save to localStorage on clear', () => {
    service.add('456');
    service.clear();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pesel-list',
      JSON.stringify([]),
    );
  });
});

describe('PeselStoreService (non-browser platform)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PeselStoreService,
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
  });

  it('should initialize with empty list and not touch localStorage', () => {
    const service = TestBed.inject(PeselStoreService);
    expect(service.pesels()).toEqual([]);
    service.add('123'); // shouldn't call localStorage
  });
});
