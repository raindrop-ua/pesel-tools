import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';
import { CopyButtonComponent } from '@components/toolbar/copy-button/copy-button.component';
import { SaveButtonComponent } from '@components/toolbar/save-button/save-button.component';
import { CopyJsonButtonComponent } from '@components/toolbar/copy-json-button/copy-json-button.component';
import { PeselItemComponent } from '@features/generator/components/pesel-item/pesel-item.component';

@Component({
  selector: 'app-pesel-output',
  imports: [
    CopyButtonComponent,
    SaveButtonComponent,
    CopyJsonButtonComponent,
    ToolbarComponent,
    PeselItemComponent,
  ],
  templateUrl: './pesel-output.component.html',
  styleUrl: './pesel-output.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselOutputComponent {
  public data = input.required<string[]>();
  public peselList = computed(() => this.data().join('\n'));
}
