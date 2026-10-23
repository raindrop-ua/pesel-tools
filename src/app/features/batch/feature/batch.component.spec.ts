import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DownloadService } from '@services/download.service';
import { BatchInputService } from '@services/batch-input.service';
import { BatchComponent } from './batch.component';

describe('BatchComponent job lifecycle', () => {
  let component: BatchComponent;
  const downloadJson = vi.fn();

  beforeEach(() => {
    downloadJson.mockClear();
    TestBed.configureTestingModule({
      providers: [
        BatchInputService,
        { provide: DownloadService, useValue: { downloadJson } },
      ],
    });
    component = TestBed.runInInjectionContext(() => new BatchComponent());
  });

  afterEach(() => TestBed.resetTestingModule());

  it('does not overwrite a newer check with cancelled results', async () => {
    component.setText(Array(1000).fill('82090500017').join('\n'));
    const oldJob = component.validate();
    component.cancel();
    component.setText('123');
    const newJob = component.validate();
    await Promise.all([oldJob, newJob]);
    expect(component.busy()).toBe(false);
    expect(component.results()).toHaveLength(1);
    expect(component.results()[0].pesel).toBe('123');
    expect(component.status()).toBe('Checked 1 row. 0 valid.');
  });

  it('clears pending work without later restoring the results', async () => {
    component.setText(Array(1000).fill('82090500017').join('\n'));
    const job = component.validate();
    component.clear();
    await job;
    expect(component.results()).toEqual([]);
    expect(component.text()).toBe('');
    expect(component.busy()).toBe(false);
    expect(component.status()).toBe('');
  });

  it('resets pagination when filters change and exports every matching row', async () => {
    component.setText(Array(121).fill('00222900009').join('\n'));
    await component.validate();
    component.page.set(2);
    expect(component.visible()).toHaveLength(21);
    component.exportJson();
    expect(downloadJson.mock.calls[0][0]).toHaveLength(121);
    component.filter.set('duplicates');
    expect(component.page()).toBe(0);
    expect(component.visible()[0].row).toBe(2);
    component.filter.set('invalid');
    expect(component.visible()).toEqual([]);
  });

  it('does not restore a slow file read after Clear', async () => {
    let resolveRead!: (text: string) => void;
    const text = new Promise<string>((resolve) => {
      resolveRead = resolve;
    });
    const input = {
      files: [{ name: 'slow.csv', size: 10, text: () => text }],
      value: 'file',
    };
    const read = component.readFile({ target: input } as unknown as Event);
    expect(component.reading()).toBe(true);
    component.clear();
    resolveRead('pesel\n82090500017');
    await read;
    expect(component.text()).toBe('');
    expect(component.fileName()).toBe('');
    expect(component.reading()).toBe(false);
  });

  it('reads a transferred dataset once without persistence', () => {
    const service = TestBed.inject(BatchInputService);
    service.set({ text: 'pesel\n00222900009', format: 'csv' });
    const transferred = TestBed.runInInjectionContext(
      () => new BatchComponent(),
    );
    expect(transferred.text()).toBe('pesel\n00222900009');
    expect(transferred.format()).toBe('csv');
    expect(service.take()).toBeNull();
  });

  it('keeps large inputs complete while bounding the editable preview', () => {
    const text = Array(10000).fill('00222900009').join('\n');
    component.setText(text);
    expect(component.largeInput()).toBe(true);
    expect(component.inputPreview()).toBe(text.slice(0, 5000));
    expect(component.text()).toBe(text);
    component.clear();
    expect(component.largeInput()).toBe(false);
  });

  it('intercepts a large paste and preserves the selected-range replacement', () => {
    const pasted = Array(2000).fill('00222900009').join('\n');
    const preventDefault = vi.fn();
    const event = {
      clipboardData: { getData: () => pasted },
      preventDefault,
      target: {
        value: 'before OLD after',
        selectionStart: 7,
        selectionEnd: 10,
      },
    } as unknown as ClipboardEvent;
    component.onPaste(event);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(component.text()).toBe('before ' + pasted + ' after');
    expect(component.inputPreview()).toHaveLength(5000);
  });
});
