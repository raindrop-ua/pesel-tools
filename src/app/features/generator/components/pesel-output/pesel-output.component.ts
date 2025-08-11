import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CopyButtonComponent } from '@components/copy-button/copy-button.component';
import { SaveButtonComponent } from '@components/save-button/save-button.component';

@Component({
  selector: 'app-pesel-output',
  imports: [CopyButtonComponent, SaveButtonComponent],
  templateUrl: './pesel-output.component.html',
  styleUrl: './pesel-output.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeselOutputComponent {
  public data = input.required<string[]>();
  public peselList = computed(() => this.data().join('\n'));
}
