import { Component, computed, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { PeselInfo } from '@services/pesel-parser.service';
import { CopyButtonComponent } from '../copy-button/copy-button.component';

@Component({
  selector: 'app-result-output',
  imports: [DatePipe, TitleCasePipe, CopyButtonComponent],
  templateUrl: './result-output.component.html',
  styleUrl: './result-output.component.scss',
})
export class ResultOutputComponent {
  public data = input<Omit<PeselInfo, 'message'> | null>(null);

  public dataString = computed(() => {
    const info = this.data();
    return info
      ? `PESEL info:\nSex: ${info.sex}\nDOB: ${info.birthDate}\nAge: ${info.age}\nSerial: ${info.serial}`
      : '';
  });
}
