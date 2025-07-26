import {Component, computed, input, Input} from '@angular/core';
import { PeselInfo } from '../../../services/pesel-parser.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CopyButtonComponent } from '../copy-button/copy-button.component';

@Component({
  selector: 'app-result-output',
  imports: [DatePipe, TitleCasePipe, CopyButtonComponent],
  templateUrl: './result-output.component.html',
  styleUrl: './result-output.component.scss',
})
export class ResultOutputComponent {
  //@Input() data!: Omit<PeselInfo, 'message'> | null;
  data = input<Omit<PeselInfo, 'message'> | null>(null);

  dataString = computed(() => {
    const info = this.data();
    return info
      ? `PESEL info:\nSex: ${info.sex}\nDOB: ${info.birthDate}\nAge: ${info.age}\nSerial: ${info.serial}`
      : '';
  })

  // get dataString(): string {
  //   const d = this.data;
  //   return d
  //     ? `PESEL info:\nSex: ${d.sex}\nDOB: ${d.birthDate}\nAge: ${d.age}\nSerial: ${d.serial}`
  //     : '';
  // }
}
