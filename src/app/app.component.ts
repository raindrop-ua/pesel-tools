import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ButtonComponent} from './shared/components/button/button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pesel-tools-draft';
}
