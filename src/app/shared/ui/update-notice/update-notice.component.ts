import { Component, inject } from '@angular/core';
import { SwUpdateService } from '@services/sw-update.service';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-update-notice',
  imports: [ButtonComponent],
  templateUrl: './update-notice.component.html',
  styleUrl: './update-notice.component.css',
})
export class UpdateNoticeComponent {
  readonly updates = inject(SwUpdateService);
}
