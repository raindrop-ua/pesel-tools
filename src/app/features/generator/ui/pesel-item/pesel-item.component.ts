import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CopyButtonComponent } from '@shared/ui/toolbar/copy-button/copy-button.component';
import { CopyJsonButtonComponent } from '@shared/ui/toolbar/copy-json-button/copy-json-button.component';
import { SaveButtonComponent } from '@shared/ui/toolbar/save-button/save-button.component';
import { ToolbarComponent } from '@shared/ui/toolbar/toolbar.component';
import { GotoParseButtonComponent } from '@shared/ui/toolbar/goto-parse-button/goto-parse-button.component';

@Component({
  selector: 'app-pesel-item',
  imports: [
    CopyButtonComponent,
    ToolbarComponent,
    CopyJsonButtonComponent,
    SaveButtonComponent,
    GotoParseButtonComponent,
  ],
  templateUrl: './pesel-item.component.html',
  host: { class: 'relative mb-2 block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselItemComponent {
  public readonly peselNumber = input<string>();
}
