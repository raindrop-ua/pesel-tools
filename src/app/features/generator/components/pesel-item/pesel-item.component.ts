import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CopyButtonComponent } from '@components/toolbar/copy-button/copy-button.component';
import { CopyJsonButtonComponent } from '@components/toolbar/copy-json-button/copy-json-button.component';
import { SaveButtonComponent } from '@components/toolbar/save-button/save-button.component';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';
import { GotoParseButtonComponent } from '@components/toolbar/goto-parse-button/goto-parse-button.component';

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
  styleUrl: './pesel-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselItemComponent {
  public readonly peselNumber = input<string>();
}
