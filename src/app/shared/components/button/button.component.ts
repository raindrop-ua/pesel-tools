import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonType = 'primary' | 'secondary' | 'danger';

@Component({
  // Using an attribute selector on native elements to create
  // a universal button/link component.
  // This preserves native button/anchor behavior and supports routerLink.
  // Disabling eslint rule as this specific selector pattern is intentional.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() appButton: ButtonType = 'primary';

  @HostBinding('class') get hostClasses(): string {
    return `app-button app-button--${this.appButton}`;
  }
}
