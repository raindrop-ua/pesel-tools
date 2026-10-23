import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PeselGeneratorService } from '@services/pesel-generator.service';
import { PeselOfTheMomentComponent } from './pesel-of-the-moment.component';

describe('PESEL of the moment motion preferences', () => {
  const pesel = '82090500017';
  const target = [...pesel].map(Number);
  let generateBatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    generateBatch = vi.fn().mockResolvedValue([pesel]);
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: PeselGeneratorService, useValue: { generateBatch } },
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('shows the final digits immediately when reduced motion is requested', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const component = TestBed.runInInjectionContext(
      () => new PeselOfTheMomentComponent(),
    );

    component.ngOnInit();
    await vi.advanceTimersByTimeAsync(0);

    expect(component.digits()).toEqual(target);
    expect(component.peselToCopy()).toBe(pesel);
  });

  it('finishes rolling on the generated PESEL when motion is allowed', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
    const component = TestBed.runInInjectionContext(
      () => new PeselOfTheMomentComponent(),
    );

    component.ngOnInit();
    await vi.advanceTimersByTimeAsync(0);
    expect(component.digits()).toEqual(Array(11).fill(0));

    await vi.advanceTimersByTimeAsync(550);
    expect(component.digits()).toEqual(target);
    expect(component.peselToCopy()).toBe(pesel);
  });

  it('does not generate or read browser motion preferences during SSR', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const matchMedia = vi.fn();
    vi.stubGlobal('matchMedia', matchMedia);
    const component = TestBed.runInInjectionContext(
      () => new PeselOfTheMomentComponent(),
    );

    component.ngOnInit();

    expect(generateBatch).not.toHaveBeenCalled();
    expect(matchMedia).not.toHaveBeenCalled();
  });
});
