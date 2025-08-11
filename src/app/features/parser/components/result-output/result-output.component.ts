import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { PeselInfo } from '@services/pesel-parser.service';
import { CopyButtonComponent } from '@components/toolbar/copy-button/copy-button.component';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';

@Component({
  selector: 'app-result-output',
  imports: [DatePipe, TitleCasePipe, CopyButtonComponent, ToolbarComponent],
  templateUrl: './result-output.component.html',
  styleUrl: './result-output.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultOutputComponent {
  public readonly data = input<Omit<PeselInfo, 'message'> | null>(null);

  public readonly dataString = computed(() => {
    const info = this.data();
    return info
      ? `PESEL info:\nSex: ${info.sex}\nDOB: ${info.birthDate}\nAge: ${info.age}\nSerial: ${info.serial}`
      : '';
  });
}
