import { ApplicationRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { BehaviorSubject, Subject } from 'rxjs';
import { vi } from 'vitest';
import { SwUpdateService } from './sw-update.service';

describe('PWA update notice lifecycle', () => {
  let events: Subject<VersionEvent>;
  let stable: BehaviorSubject<boolean>;
  let checkForUpdate: ReturnType<typeof vi.fn<() => Promise<boolean>>>;
  let reload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    events = new Subject();
    stable = new BehaviorSubject(false);
    checkForUpdate = vi.fn<() => Promise<boolean>>().mockResolvedValue(false);
    reload = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SwUpdate,
          useValue: { isEnabled: true, versionUpdates: events, checkForUpdate },
        },
        { provide: ApplicationRef, useValue: { isStable: stable } },
        {
          provide: DOCUMENT,
          useValue: { defaultView: { location: { reload } } },
        },
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  function ready(hash = 'new-version'): void {
    events.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'old-version' },
      latestVersion: { hash },
    });
  }

  it('shows a ready update without a native dialog or automatic reload', () => {
    const service = TestBed.inject(SwUpdateService);
    const confirm = vi.spyOn(window, 'confirm');
    ready();
    expect(service.updateAvailable()).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
    confirm.mockRestore();
  });

  it('waits until the update is fully downloaded', () => {
    const service = TestBed.inject(SwUpdateService);
    events.next({ type: 'VERSION_DETECTED', version: { hash: 'new' } });
    events.next({
      type: 'VERSION_INSTALLATION_FAILED',
      version: { hash: 'new' },
      error: 'offline',
    });
    expect(service.updateAvailable()).toBe(false);
  });

  it('keeps a postponed version hidden and shows a different ready version', () => {
    const service = TestBed.inject(SwUpdateService);
    ready('version-a');
    service.postpone();
    ready('version-a');
    expect(service.updateAvailable()).toBe(false);
    ready('version-b');
    expect(service.updateAvailable()).toBe(true);
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads only after acceptance and ignores double clicks', () => {
    const service = TestBed.inject(SwUpdateService);
    service.reload();
    expect(reload).not.toHaveBeenCalled();
    ready();
    service.reload();
    service.reload();
    service.postpone();
    expect(reload).toHaveBeenCalledOnce();
    expect(service.reloading()).toBe(true);
    expect(service.updateAvailable()).toBe(true);
  });

  it('shows a recoverable error if the browser refuses to reload', () => {
    const service = TestBed.inject(SwUpdateService);
    reload.mockImplementationOnce(() => {
      throw new Error('blocked');
    });
    ready();
    service.reload();
    expect(service.reloading()).toBe(false);
    expect(service.error()).toContain('Please try again');
    service.reload();
    expect(reload).toHaveBeenCalledTimes(2);
    expect(service.error()).toBe('');
  });

  it('does nothing when service workers are disabled, including SSR', async () => {
    TestBed.overrideProvider(SwUpdate, {
      useValue: { isEnabled: false, versionUpdates: events, checkForUpdate },
    });
    const service = TestBed.inject(SwUpdateService);
    ready();
    stable.next(true);
    await vi.advanceTimersByTimeAsync(180_000);
    expect(service.updateAvailable()).toBe(false);
    expect(checkForUpdate).not.toHaveBeenCalled();
  });

  it('waits for application stability before scheduling one polling interval', async () => {
    TestBed.inject(SwUpdateService);
    await vi.advanceTimersByTimeAsync(120_000);
    expect(checkForUpdate).not.toHaveBeenCalled();
    stable.next(true);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(checkForUpdate).toHaveBeenCalledOnce();
    stable.next(false);
    stable.next(true);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(checkForUpdate).toHaveBeenCalledTimes(2);
  });

  it('tolerates offline checks and retries on the next interval', async () => {
    checkForUpdate.mockRejectedValueOnce(new Error('offline'));
    TestBed.inject(SwUpdateService);
    stable.next(true);
    await vi.advanceTimersByTimeAsync(120_000);
    expect(checkForUpdate).toHaveBeenCalledTimes(2);
  });

  it('does not overlap slow update checks', async () => {
    let finish!: (value: boolean) => void;
    checkForUpdate.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    TestBed.inject(SwUpdateService);
    stable.next(true);
    await vi.advanceTimersByTimeAsync(180_000);
    expect(checkForUpdate).toHaveBeenCalledOnce();
    finish(false);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(checkForUpdate).toHaveBeenCalledTimes(2);
  });

  it('releases the polling timer and event subscription on destruction', async () => {
    const service = TestBed.inject(SwUpdateService);
    stable.next(true);
    TestBed.resetTestingModule();
    ready();
    await vi.advanceTimersByTimeAsync(120_000);
    expect(service.updateAvailable()).toBe(false);
    expect(checkForUpdate).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
