import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  host: {
    class:
      'fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 transition-opacity duration-300 motion-reduce:transition-none',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
