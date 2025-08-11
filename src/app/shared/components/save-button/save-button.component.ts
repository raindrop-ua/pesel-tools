import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { SvgIconComponent } from '@core/components/svg-icon/svg-icon.component';
import { DownloadService } from '@services/download.service';

@Component({
  selector: 'app-save-button',
  imports: [SvgIconComponent],
  templateUrl: './save-button.component.html',
  styleUrl: './save-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveButtonComponent {
  private readonly download = inject(DownloadService);
  public contentToSave = input.required<string>();
  public saved = signal(false);

  public onSave(): void {
    if (!this.contentToSave()) return;

    const payload = this.contentToSave().split('\n');
    const date = new Date().toISOString().slice(0, 10);
    this.download.downloadJson(payload, `pesels-${date}.json`, 2);
  }
}
