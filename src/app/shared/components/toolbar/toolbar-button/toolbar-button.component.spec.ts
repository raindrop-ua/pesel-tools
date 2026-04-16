import { TestBed } from '@angular/core/testing';
import {
  ActionResult,
  ToolbarAction,
} from '@components/toolbar/toolbar-button/toolbar-action';
import { ToolbarButtonComponent } from './toolbar-button.component';
import { vi } from 'vitest';

describe('ToolbarButtonComponent', () => {
  let component: ToolbarButtonComponent;
  beforeEach(() => {
    component = TestBed.runInInjectionContext(() => new ToolbarButtonComponent());
  });

  function setupInputs(
    run: () => Promise<ActionResult<unknown>>,
    inputs?: {
      externalDisabled?: boolean;
      successDuration?: number;
      disableWhileSuccess?: boolean;
    },
  ): void {
    const action: ToolbarAction<unknown> = { run };
    (component as unknown as Record<string, unknown>)['icon'] = () => 'copy';
    (component as unknown as Record<string, unknown>)['activeIcon'] = () => 'check';
    (component as unknown as Record<string, unknown>)['title'] = () => 'Copy';
    (component as unknown as Record<string, unknown>)['activeTitle'] = () => 'Copied';
    (component as unknown as Record<string, unknown>)['srText'] = () => 'Copy';
    (component as unknown as Record<string, unknown>)['srActiveText'] = () =>
      'Copied';
    (component as unknown as Record<string, unknown>)['successDuration'] = () =>
      inputs?.successDuration ?? 2000;
    (component as unknown as Record<string, unknown>)['disableWhileRunning'] = () =>
      true;
    (component as unknown as Record<string, unknown>)['disableWhileSuccess'] = () =>
      inputs?.disableWhileSuccess ?? true;
    (component as unknown as Record<string, unknown>)['externalDisabled'] = () =>
      inputs?.externalDisabled ?? false;
    (component as unknown as Record<string, unknown>)['action'] = () => action;
  }

  it('does not execute action when externally disabled', async () => {
    const run = vi.fn<() => Promise<ActionResult<unknown>>>().mockResolvedValue({
      ok: true,
    });
    const clicked = vi.fn();

    setupInputs(run, { externalDisabled: true });
    component.clicked.subscribe(clicked);

    await component.handleClick();

    expect(run).not.toHaveBeenCalled();
    expect(clicked).not.toHaveBeenCalled();
  });

  it('emits clicked/result/success and clears active state after timeout', async () => {
    vi.useFakeTimers();
    const run = vi.fn<() => Promise<ActionResult<unknown>>>().mockResolvedValue({
      ok: true,
      data: 'done',
    });
    const clicked = vi.fn();
    const success = vi.fn();
    const result = vi.fn();

    setupInputs(run, { successDuration: 100 });
    component.clicked.subscribe(clicked);
    component.success.subscribe(success);
    component.result.subscribe(result);

    await component.handleClick();

    expect(run).toHaveBeenCalledTimes(1);
    expect(clicked).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledTimes(1);
    expect(result).toHaveBeenCalledWith({ ok: true, data: 'done' });
    expect(component.active()).toBe(true);
    expect(component.disabled()).toBe(true);

    vi.advanceTimersByTime(100);

    expect(component.active()).toBe(false);
    expect(component.disabled()).toBe(false);
    vi.useRealTimers();
  });

  it('does not emit success on failed action result', async () => {
    const run = vi.fn<() => Promise<ActionResult<unknown>>>().mockResolvedValue({
      ok: false,
      message: 'failed',
    });
    const success = vi.fn();
    const result = vi.fn();

    setupInputs(run);
    component.success.subscribe(success);
    component.result.subscribe(result);

    await component.handleClick();

    expect(success).not.toHaveBeenCalled();
    expect(result).toHaveBeenCalledWith({ ok: false, message: 'failed' });
    expect(component.active()).toBe(false);
    expect(component.disabled()).toBe(false);
  });

  it('emits failed result when action throws', async () => {
    const error = new Error('boom');
    const run = vi.fn<() => Promise<ActionResult<unknown>>>().mockRejectedValue(
      error,
    );
    const result = vi.fn();
    const success = vi.fn();

    setupInputs(run);
    component.result.subscribe(result);
    component.success.subscribe(success);

    await component.handleClick();

    expect(success).not.toHaveBeenCalled();
    expect(result).toHaveBeenCalledWith({ ok: false, error });
    expect(component.active()).toBe(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
