import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ToolbarComponent } from '@shared/ui/toolbar/toolbar.component';
import { CopyButtonComponent } from '@shared/ui/toolbar/copy-button/copy-button.component';
import { SaveButtonComponent } from '@shared/ui/toolbar/save-button/save-button.component';
import { CopyJsonButtonComponent } from '@shared/ui/toolbar/copy-json-button/copy-json-button.component';
import { PeselItemComponent } from '@features/generator/ui/pesel-item/pesel-item.component';
import { GotoParseButtonComponent } from '@shared/ui/toolbar/goto-parse-button/goto-parse-button.component';

@Component({
  selector: 'app-pesel-output',
  imports: [
    CopyButtonComponent,
    SaveButtonComponent,
    CopyJsonButtonComponent,
    ToolbarComponent,
    PeselItemComponent,
    GotoParseButtonComponent,
  ],
  templateUrl: './pesel-output.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselOutputComponent {
  public data = input.required<string[]>();
  public readonly preview = computed(() => this.data().slice(0, 100));
  public peselList = computed(() => this.data().join('\n'));
}
