export interface ActionResult<T = void> {
  ok: boolean;
  data?: T;
  error?: unknown;
  message?: string;
}

export interface ToolbarAction<T = void> {
  run(): Promise<ActionResult<T>>;
}
