import { TestBed } from '@angular/core/testing';
import { GeneratorStateService } from './generator-state.service';
import { PeselGeneratorService } from '@services/pesel-generator.service';
import { StorageService } from '@services/storage.service';

describe('GeneratorStateService', () => {
  const generator = { generateBatch: vi.fn() };
  const storage = { removeItem: vi.fn(), setItem: vi.fn(), getItem: vi.fn() };
  let state: GeneratorStateService;
  beforeEach(() => {
    vi.resetAllMocks();
    TestBed.configureTestingModule({
      providers: [
        GeneratorStateService,
        { provide: PeselGeneratorService, useValue: generator },
        { provide: StorageService, useValue: storage },
      ],
    });
    state = TestBed.inject(GeneratorStateService);
  });
  afterEach(() => TestBed.resetTestingModule());

  it('removes legacy storage without reading or persisting results', async () => {
    expect(storage.removeItem).toHaveBeenCalledExactlyOnceWith('pesel-list:v1');
    generator.generateBatch.mockResolvedValue(['a']);
    await state.generate(1);
    expect(state.pesels()).toEqual(['a']);
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('clears the old batch immediately and generates without previous exclusions', async () => {
    generator.generateBatch.mockResolvedValueOnce(['old']);
    await state.generate(1);
    let complete!: (value: string[]) => void;
    generator.generateBatch.mockReturnValue(
      new Promise<string[]>((resolve) => {
        complete = resolve;
      }),
    );
    const request = state.generate(2);
    expect(state.pesels()).toEqual([]);
    expect(state.busy()).toBe(true);
    await state.generate(2);
    expect(generator.generateBatch).toHaveBeenCalledTimes(2);
    expect(generator.generateBatch).toHaveBeenLastCalledWith(
      2,
      undefined,
      [],
      expect.any(AbortSignal),
    );
    complete(['a', 'b']);
    await request;
    expect(state.pesels()).toEqual(['a', 'b']);
    expect(state.busy()).toBe(false);
  });

  it('ignores late results after clearing or cancellation', async () => {
    let complete!: (value: string[]) => void;
    generator.generateBatch.mockReturnValue(
      new Promise<string[]>((resolve) => {
        complete = resolve;
      }),
    );
    const request = state.generate(1);
    state.clear();
    complete(['stale']);
    await request;
    expect(state.pesels()).toEqual([]);
  });

  it('keeps the result empty on failure and allows retry', async () => {
    generator.generateBatch
      .mockResolvedValueOnce(['old'])
      .mockRejectedValueOnce(new Error('Exhausted'))
      .mockResolvedValueOnce(['ok']);
    await state.generate(1);
    await state.generate(1);
    expect(state.error()).toBe('Exhausted');
    expect(state.pesels()).toEqual([]);
    await state.generate(1);
    expect(state.error()).toBeNull();
    expect(state.pesels()).toEqual(['ok']);
  });
});
