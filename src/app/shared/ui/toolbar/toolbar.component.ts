import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.component.html',
  host: {
    class:
      'absolute top-2.5 right-2.5 z-1 flex flex-col-reverse gap-2 sm:flex-row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {}
