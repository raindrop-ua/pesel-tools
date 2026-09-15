import { PeselGeneratorService } from './pesel-generator.service';

class WorkerMock {
  static instances: WorkerMock[] = [];
  onmessage?: (event: { data: unknown }) => void;
  onerror?: () => void;
  onmessageerror?: () => void;
  postMessage = vi.fn();
  terminate = vi.fn();
  constructor() {
    WorkerMock.instances.push(this);
  }
}

describe('PeselGeneratorService worker lifecycle', () => {
  let service: PeselGeneratorService;
  beforeEach(() => {
    WorkerMock.instances = [];
    vi.stubGlobal('Worker', WorkerMock);
    service = new PeselGeneratorService();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('passes the batch to a worker and releases it after success', async () => {
    const result = service.generateBatch(2, { sex: 'male' }, ['existing']);
    const worker = WorkerMock.instances[0];
    expect(worker.postMessage).toHaveBeenCalledWith({
      count: 2,
      options: { sex: 'male' },
      existing: ['existing'],
    });
    worker.onmessage!({ data: { ok: true, pesels: ['a', 'b'] } });
    await expect(result).resolves.toEqual(['a', 'b']);
    expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it('isolates concurrent jobs and cancellation', async () => {
    const controller = new AbortController();
    const first = service.generateBatch(1, undefined, [], controller.signal);
    const rejection = expect(first).rejects.toMatchObject({
      name: 'AbortError',
    });
    const second = service.generateBatch();
    controller.abort();
    WorkerMock.instances[1].onmessage!({ data: { ok: true, pesels: ['b'] } });
    await rejection;
    await expect(second).resolves.toEqual(['b']);
    expect(WorkerMock.instances[0].terminate).toHaveBeenCalledOnce();
  });

  it('does not start a cancelled job', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      service.generateBatch(1, undefined, [], controller.signal),
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(WorkerMock.instances).toHaveLength(0);
  });

  it('reports domain errors and worker failures', async () => {
    const domain = service.generateBatch();
    WorkerMock.instances[0].onmessage!({
      data: { ok: false, message: 'No numbers remain' },
    });
    await expect(domain).rejects.toThrow('No numbers remain');
    for (const event of ['onerror', 'onmessageerror'] as const) {
      const result = service.generateBatch();
      const worker = WorkerMock.instances.at(-1)!;
      worker[event]!();
      await expect(result).rejects.toThrow();
      expect(worker.terminate).toHaveBeenCalledOnce();
    }
  });

  it('times out and releases stalled workers', async () => {
    vi.useFakeTimers();
    const result = service.generateBatch();
    const rejection = expect(result).rejects.toThrow('timed out');
    vi.advanceTimersByTime(60_000);
    await rejection;
    expect(WorkerMock.instances[0].terminate).toHaveBeenCalledOnce();
  });

  it('handles unavailable workers during SSR without starting synchronous generation', async () => {
    vi.stubGlobal('Worker', undefined);
    await expect(service.generateBatch()).rejects.toThrow('Web Worker support');
  });
});
