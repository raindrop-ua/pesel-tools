import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';

type ButtonType = 'primary' | 'secondary' | 'danger';

@Component({
  // Using an attribute selector on native elements to create
  // a universal button/link component.
  // This preserves native button/anchor behavior and supports routerLink.
  // Disabling eslint rule as this specific selector pattern is intentional.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[app-button], a[app-button]',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input('app-button') appButton: ButtonType = 'primary';

  @HostBinding('class') get hostClasses(): string {
    return `app-button app-button-${this.appButton}`;
  }
}
