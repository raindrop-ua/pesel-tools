import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpdateNoticeComponent } from '@shared/ui/update-notice/update-notice.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UpdateNoticeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
