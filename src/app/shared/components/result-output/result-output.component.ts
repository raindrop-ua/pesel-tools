import { Component, Input } from '@angular/core';
import { PeselInfo } from '../../../services/pesel-parser.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { CopyButtonComponent } from '../copy-button/copy-button.component';

@Component({
  selector: 'app-result-output',
  imports: [DatePipe, TitleCasePipe, CardComponent, CopyButtonComponent],
  templateUrl: './result-output.component.html',
  styleUrl: './result-output.component.scss',
})
export class ResultOutputComponent {
  @Input() data!: Omit<PeselInfo, 'message'> | null;

  get dataString(): string {
    const d = this.data;
    return d
      ? `PESEL info:\nSex: ${d.sex}\nDOB: ${d.birthDate}\nAge: ${d.age}\nSerial: ${d.serial}`
      : '';
  }
}
